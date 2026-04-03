import Papa from "papaparse";
import { SupabaseClient } from "@supabase/supabase-js";

export class StudentUploader {
  supabase: SupabaseClient;
  file: File | null;

  courseId?: number | string; 


  constructor(supabase: SupabaseClient, file: File | null = null, courseId?: number | string) {
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
            const rows = results.data.slice(1); 
            

            const studentsToInsert = rows.map((row: any) => ({
              first_name: row[0],
              last_name: row[1],
              netID: row[2],
              email: row[3],
              course_section: row[4],
            }));

            const { error } = await this.supabase
              .from("Students")
              .insert(studentsToInsert);

            if (error) reject(error);
            else resolve();
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(err),
      });
    });
  }

  async process(): Promise<void> {
    await this.uploadToStorage();
    await this.parseAndInsert();
  }
}