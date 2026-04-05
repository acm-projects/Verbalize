import Papa from "papaparse";
import { SupabaseClient } from "@supabase/supabase-js";

export class StudentUploader {
  supabase: SupabaseClient;
  file: File | null;
  courseId: string | number;

  


  constructor(supabase: SupabaseClient, file: File | null = null, courseId: number | string) {
    this.supabase = supabase;
    this.file = file;
    this.courseId = courseId; 
  }

  setFile(file: File) {
    this.file = file;
  }

  async uploadToStorage(): Promise<string> {
    if (!this.file) throw new Error("No file selected");
    const uniqueName = `${Date.now()}-${this.file.name}`;
    const { data, error } = await this.supabase.storage
      .from("StudentBucket")
      .upload(`uploads/${uniqueName}`, this.file);
    if (error) throw error;
    return data.path;
  }

  async parseAndInsert(): Promise<void> {
    if (!this.file) throw new Error("No file selected");

    return new Promise<void>((resolve, reject) => {
      Papa.parse(this.file!, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const rows = results.data.slice(1) as string[][];

            for (const row of rows) {
              const first_name = row[0];
              const last_name = row[1];
              const netID = row[2].trim().toLowerCase();
              const email = row[3];

              let { data: student } = await this.supabase
                .from("Students")
                .select("id")
                .eq("netID", netID)
                .maybeSingle();

              if (!student) {
                const { data: newStudent, error: insertError } =
                  await this.supabase
                    .from("Students")
                    .insert({
                      first_name,
                      last_name,
                      netID,
                      email,
                    })
                    .select("id")
                    .single();

                if (insertError) throw insertError;
                student = newStudent;
              }

              const { error: enrollError } = await this.supabase
                .from("Course_Students")
                .insert({
                  course_id: this.courseId,
                  student_id: student.id,
                });

              if (enrollError && enrollError.code !== "23505") {
                throw enrollError;
              }
            }

            resolve();
          } catch (err) {
            reject(err);
          }
        },
      });
    });
  }

  async process(): Promise<void> {
    await this.uploadToStorage();
    await this.parseAndInsert();
  }
}