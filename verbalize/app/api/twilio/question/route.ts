import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from "@/lib/supabase/server";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdx = parseInt(url.searchParams.get('next') || '0', 10);
  
  const twiml = new VoiceResponse();

  if (!submissionId) {
    twiml.say('Error: missing submission data.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  // 1. Logic for completion (after all 3 questions are answered)
  if (nextIdx >= 3) {
    twiml.say('You have completed all questions. Thank you for your time. Your answers are being processed. Goodbye!');
    
    // 🌟 IMPORTANT: Added a 3-second pause to prevent Twilio from 
    // cutting off the final transcription callback before hanging up.
    twiml.pause({ length: 3 }); 
    
    twiml.hangup();
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  const supabase = await createClient();
  
  // Fetch submission details to get the student_id and assignment_id
  const { data: submission } = await supabase
    .from('Submissions')
    .select('student_id, assignment_id')
    .eq('id', submissionId)
    .single();

  if (!submission) {
    twiml.say('Error: submission record not found.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  let questionToAsk = "";

  // 🌟 Core Logic: 2 Code-Specific Questions + 1 General Question
  if (nextIdx === 0 || nextIdx === 1) {
    // Phase 1: Fetch personalized questions based on student's code
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
    // Phase 2: Fetch a general conceptual question from the assignment question bank
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

  // 2. Announce the question and trigger recording
  // The qText is passed to the transcription step for better AI context
  twiml.say(`Question ${nextIdx + 1}: ${questionToAsk}`);
  
  twiml.record({
    action: `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}&qText=${encodeURIComponent(questionToAsk)}`,
    transcribe: true,
    transcribeCallback: `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}&qText=${encodeURIComponent(questionToAsk)}`,
    maxLength: 120, // 2-minute limit per answer
    timeout: 5,    // Auto-detect silence after 5 seconds to proceed to next question
    playBeep: true,
  });

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
