import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server"
import { analyzeTranscript } from "@/lib/gemini"; 

export async function POST(request: Request) {
  const supabase = await createClient();
  
  try {
   
    const url = new URL(request.url);
    const submissionId = url.searchParams.get('submissionId');

    const formData = await request.formData();
    const transcriptionText = formData.get('TranscriptionText') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;
    const callSid = formData.get('CallSid') as string;

    if (!transcriptionText || !submissionId) {
      return new NextResponse('Missing Data', { status: 200 });
    }

   
    const { data: subData } = await supabase
      .from('Submissions')
      .select('student_id')
      .eq('id', submissionId)
      .single();

    
    const aiData = await analyzeTranscript(transcriptionText);

   
    const { error } = await supabase
      .from('Results') 
      .insert([
        { 
          submission_id: submissionId,
          student_id: subData?.student_id, 
          call_id: callSid,
          student_response: transcriptionText,
          confidence_score: aiData.confidence, 
          
        },
      ]);

    if (error) console.error('DB Insert Error:', error.message);

    return new NextResponse('OK', { status: 200 });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Final Hook Error:', err.message);
    return new NextResponse('Internal Error', { status: 500 });
  }
}