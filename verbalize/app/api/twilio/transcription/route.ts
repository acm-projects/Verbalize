import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from "@/lib/supabase/server";
import { analyzeTranscript } from "@/lib/Gemini"; 

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdxStr = url.searchParams.get('next');
  const qText = url.searchParams.get('qText') || 'Unknown Question';
  
  const formData = await request.formData();
  const transcriptionText = formData.get('TranscriptionText') as string;
  const recordingUrl = formData.get('RecordingUrl') as string;
  const callSid = formData.get('CallSid') as string; 

  if (transcriptionText && submissionId) {
    console.log(`Received Answer for Q${parseInt(nextIdxStr || '0') + 1}:`, transcriptionText);
    
    try {
      const supabase = await createClient();

    
      const { data: subData } = await supabase
        .from('Submissions')
        .select('student_id')
        .eq('id', submissionId)
        .single();

      
      const aiResult = await analyzeTranscript(transcriptionText); 
      
      
      await supabase.from('Results').insert({
        submission_id: parseInt(submissionId, 10),
        student_id: subData?.student_id || null, 
        call_id: callSid,                       
        transcript: transcriptionText,             
        confidence_score: aiResult.score || 0,
        summary: aiResult.summary || "No summary provided",
        recording_url: recordingUrl             
      });
      console.log(`✅ Saved Q${parseInt(nextIdxStr || '0') + 1} to DB successfully.`);
    } catch (error) {
      console.error('❌ Failed to process AI or save to DB:', error);
    }
  }

  if (transcriptionText) {
      return NextResponse.json({ success: true });
  }

  const twiml = new VoiceResponse();
  const nextIdx = parseInt(nextIdxStr || '0', 10);
  const nextQuestionIdx = nextIdx + 1; 

  twiml.say("Response recorded.");
  twiml.redirect(`/api/twilio/question?submissionId=${submissionId}&next=${nextQuestionIdx}`);

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
