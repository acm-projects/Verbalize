import Papa from "papaparse";
import { SupabaseClient } from "@supabase/supabase-js";

export class StudentUploader {
  supabase: SupabaseClient;
  file: File | null;

  constructor(supabase: SupabaseClient, file: File | null = null) {
    this.supabase = supabase;
    this.file = file;
  }

  setFile(file: File) {
    this.file = file;
  }

  // Upload the CSV to Supabase Storage
  async uploadToStorage(): Promise<string> {
    if (!this.file) throw new Error("No file selected");

    const uniqueName = `${Date.now()}-${this.file.name}`;
    const { data, error } = await this.supabase.storage
      .from("StudentBucket")
      .upload(`uploads/${uniqueName}`, this.file);

    if (error) throw error;
    return data.path;
  }

  // Parse the CSV and insert students into database
  async parseAndInsert(): Promise<void> {
    if (!this.file) throw new Error("No file selected");

    return new Promise<void>((resolve, reject) => {
      Papa.parse(this.file!, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Skip header row
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

  // Full process: upload + insert
  async process(): Promise<void> {
    await this.uploadToStorage();
    await this.parseAndInsert();
  }
}