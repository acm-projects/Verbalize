import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from "@/lib/supabase/server";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdx = parseInt(url.searchParams.get('next') || '0', 10);
  const isRepeat = url.searchParams.get('repeat') === 'true';
  
  
  const qIdsParam = url.searchParams.get('qIds') || "";
  const qIdArray = qIdsParam.split(',');
  const targetId = qIdArray[nextIdx] || "unknown";

  const twiml = new VoiceResponse();

  if (!submissionId) {
    twiml.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, 'Error: missing submission data.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  if (nextIdx >= 3) {
    twiml.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, 'You have completed all questions. Thank you for your time. Your answers are being processed. Please wait.');
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
    twiml.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, 'Error: submission record not found.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  let questionToAsk = "";
  let source = ""; // CHANGE: Variable to track which table we are using

  if (nextIdx === 0 || nextIdx === 1) {
    source = "student_specific"; // CHANGE: Mark as specific source
    const { data: specificData } = await supabase
      .from('StudentSpecificQuestions')
      .select('id, questions')
      .eq('assignment_id', submission.assignment_id)
      .eq('student_id', submission.student_id)
      .single();

    if (specificData && Array.isArray(specificData.questions) && specificData.questions.length > nextIdx) {
      questionToAsk = specificData.questions[nextIdx];
    } else {
      questionToAsk = "Please provide an overview of your logic in the submitted code.";
    }
  } else if (nextIdx === 2) {
    source = "assignment_general"; 
    const { data: generalData } = await supabase
      .from('Assignment_Questions')
      .select('id, question_text')
      
      .eq('id', targetId) 
      .single(); 

    if (generalData) {
      questionToAsk = generalData.question_text;
    } else {
      questionToAsk = "Please explain the fundamental concepts covered in this assignment.";
    }
  }

  
  const transcriptionUrl = `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}&questionId=${targetId}&source=${source}&qIds=${qIdsParam}`;

  const gather = twiml.gather({
    action: transcriptionUrl,
    numDigits: 1,
    timeout: 2, 
  });

  if (nextIdx === 0 && !isRepeat) {
    const introSay = gather.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, '');
    introSay.prosody(
      { rate: '90%' }, 
      "Before we begin, please note: You will hear a beep two seconds after each question to start your recording. Before the beep, you can press 0 to hear the current question again."
    );
  }

  const questionSay = gather.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, '');
  questionSay.prosody(
    { rate: '80%' }, 
    `Question ${nextIdx + 1}: ${questionToAsk}`
  );

  twiml.record({
    action: transcriptionUrl,
    transcribe: true,
    transcribeCallback: transcriptionUrl,
    playBeep: true, 
    trim: "do-not-trim"
  });

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}