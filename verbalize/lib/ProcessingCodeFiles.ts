// src/lib/student-processing.ts
import { createClient } from '@/lib/supabase/server'; // Use server-side client

export async function processStudentCode(submissionId: number, filePath: string) {
  const supabase = await createClient();

  //Download file from Storage
  const { data, error: downloadError } = await supabase.storage
    .from('assignmentsBucket') // Replace with your actual bucket name
    .download(filePath);

  if (downloadError) throw downloadError;

  //Convert Blob to string text
  const codeContent = await data.text();

  //Save extracted text back to the Submissions table
  const { error: updateError } = await supabase
    .from('Submissions')
    .update({ code_text: codeContent })
    .eq('id', submissionId);

  if (updateError) throw updateError;

  return { success: true };
}
