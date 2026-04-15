import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from "@/lib/supabase/server";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdx = parseInt(url.searchParams.get('next') || '0', 10);
  const isRepeat = url.searchParams.get('repeat') === 'true';
  const twiml = new VoiceResponse();

  if (!submissionId) {
    twiml.say({ voice: 'Polly.Joanna' }, 'Error: missing submission data.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  
  if (nextIdx >= 3) {
    twiml.say({ voice: 'Polly.Joanna' }, 'You have completed all questions. Thank you for your time. Your answers are being processed. Please wait.');
    twiml.pause({ length: 3 }); 
    twiml.hangup();
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  const supabase = await createClient();
  
  const { data: submission } = await supabase
    .from('Submissions')
    .select('student_id, assignment_id')
    .eq('id', submissionId)
    .single();

  if (!submission) {
    twiml.say({ voice: 'Polly.Joanna' }, 'Error: submission record not found.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  let questionToAsk = "";


  if (nextIdx === 0 || nextIdx === 1) {
    const { data: specificData } = await supabase
      .from('StudentSpecificQuestions')
      .select('questions')
      .eq('assignment_id', submission.assignment_id)
      .eq('student_id', submission.student_id)
      .single();

    if (specificData && Array.isArray(specificData.questions) && specificData.questions.length > nextIdx) {
      questionToAsk = specificData.questions[nextIdx];
    } else {
      questionToAsk = "Please provide an overview of your logic in the submitted code.";
    }
  } else if (nextIdx === 2) {
    const { data: generalData } = await supabase
      .from('Assignment_Questions')
      .select('question_text')
      .eq('assignment_id', submission.assignment_id)
      .limit(1); 

    if (generalData && generalData.length > 0) {
      questionToAsk = generalData[0].question_text;
    } else {
      questionToAsk = "Please explain the fundamental concepts covered in this assignment.";
    }
  }

 
  const gather = twiml.gather({
    action: `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}`,
    numDigits: 1,
    timeout: 2, 
  });


  if (nextIdx === 0 && !isRepeat) {
    
    const introSay = gather.say({ voice: 'Polly.Joanna' });
    
    introSay.prosody(
      { rate: '90%' }, 
      "Before we begin, please note: You will hear a beep two seconds after each question to start your recording. Before the beep, you can press 0 to hear the current question again."
    );
  }


  const questionSay = gather.say({ voice: 'Polly.Joanna' });
  questionSay.prosody(
    { rate: '80%' }, 
    `Question ${nextIdx + 1}: ${questionToAsk}`
  );

 
  twiml.record({
    action: `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}&qText=${encodeURIComponent(questionToAsk)}`,
    transcribe: true,
    transcribeCallback: `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}&qText=${encodeURIComponent(questionToAsk)}`,
    maxLength: 120, 
    timeout: 5,     
    playBeep: true, 
  });

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}