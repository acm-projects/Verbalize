import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server"
import { analyzeTranscript } from "@/lib/analysis";

export async function POST(request: Request) {
  console.log(" Transcription webhook received");
  const supabase = await createClient();

  
  try {
   
    const url = new URL(request.url);
    const submissionId = url.searchParams.get('submissionId');
    const questionId = url.searchParams.get('questionId');

    const formData = await request.formData();
    const transcriptionText = formData.get('TranscriptionText') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;
    const callSid = formData.get('CallSid') as string;

    if (!transcriptionText || !submissionId) {
      return new NextResponse('Missing Data', { status: 200 });
    }

   const { data: qData } = await supabase
      .from('Assignment_Questions')
      .select('question_text')
      .eq('id', questionId)
      .single();

    const { data: subData } = await supabase
      .from('Submissions')
      .select('student_id')
      .eq('id', submissionId)
      .single();

    
    const aiData = await analyzeTranscript(transcriptionText,qData?.question_text || "");

   
    const { error } = await supabase.from('Results').insert([{ 
      submission_id: submissionId,
      student_id: subData?.student_id, 
      recording_url: recordingUrl,
      call_id: callSid,
      transcript: transcriptionText,
      confidence_score: aiData.confidence, 
      summary: aiData.summary
    }]);
    if (error) console.error('DB Insert Error:', error.message);
    else {
  console.log("SUCCESS: Saved response to DB");
}

    return new NextResponse('OK', { status: 200 });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Final Hook Error:', err.message);
    return new NextResponse('Internal Error', { status: 500 });
  }
}