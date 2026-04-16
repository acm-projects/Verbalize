import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from "@/lib/supabase/server";
import { analyzeTranscript } from "@/lib/analysis"; 

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdxStr = url.searchParams.get('next');
  const nextIdx = parseInt(nextIdxStr || '0', 10);
  const questionId = url.searchParams.get('questionId');
  // const qText = url.searchParams.get('qText') || 'Unknown Question';
  const source = url.searchParams.get('source');
  const qIds = url.searchParams.get('qIds') || "";
  
  const formData = await request.formData();
  
  const digits = formData.get('Digits') as string | null;


  if (digits === '0') {
    console.log(`User pressed 0. Repeating Q${parseInt(nextIdxStr || '0') + 1}`);
    const twiml = new VoiceResponse();
    
   
    twiml.redirect(`/api/twilio/question?submissionId=${submissionId}&next=${nextIdxStr}&repeat=true&qIds=${qIds}`);
    
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  
  const transcriptionText = formData.get('TranscriptionText') as string;
  const recordingUrl = formData.get('RecordingUrl') as string;
  const callSid = formData.get('CallSid') as string; 

 
  if (transcriptionText && submissionId) {
    console.log(`Received Answer for Q${parseInt(nextIdxStr || '0') + 1}:`, transcriptionText);
    
    
    try {
      const supabase = await createClient();
      let questionTextForAI = "";
      const { data: subData } = await supabase
        .from('Submissions')
        .select('student_id, assignment_id')
        .eq('id', submissionId)
        .single();

      if (!subData) throw new Error("Submission not found");
      if (source === "student_specific") {
        const { data: specData } = await supabase
          .from('StudentSpecificQuestions')
          .select('questions')
          .eq('assignment_id', subData.assignment_id)
          .eq('student_id', subData.student_id)
          .single();
        
        questionTextForAI = specData?.questions[nextIdx] || "";
    }
      else{
        const { data: qData } = await supabase
          .from('Assignment_Questions')
          .select('question_text')
          .eq('id', questionId)
          .single();
        
        questionTextForAI = qData?.question_text || "";
      }
      
      const aiResult = await analyzeTranscript(transcriptionText,questionTextForAI); 
      
      await supabase.from('Results').insert({
        submission_id: parseInt(submissionId, 10),
        student_id: subData?.student_id || null, 
        call_id: callSid,   
        specific_q_id: source === "student_specific" ? questionId : null,
        assignment_q_id: source === "assignment_general" ? questionId : null,
        question_id: questionId,                    
        transcript: transcriptionText,             
        confidence_score: aiResult.grade,
        summary: aiResult.summary || "No summary provided",
        recording_url: recordingUrl             
      });
      console.log(`✅ Saved Q${parseInt(nextIdxStr || '0') + 1} to DB successfully.`);
    } catch (error) {
      console.error('❌ Failed to process AI or save to DB:', error);
    }
    return new NextResponse(null, { status: 200 });
  }

  
  // if (transcriptionText) {
  //     return NextResponse.json({ success: true });
  // }

 
  const twiml = new VoiceResponse();
   

  twiml.say({ voice: 'Polly.Joanna' }, "Response recorded.");
  twiml.redirect(`/api/twilio/question?submissionId=${submissionId}&next=${nextIdx+1}&qIds=${qIds}`);

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}