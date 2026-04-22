import { NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdx = parseInt(url.searchParams.get('next') || '0', 10);

  const twiml = new VoiceResponse();

  if (!submissionId) {
    twiml.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, 'Error: missing submission data.');
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  const demoQuestions = [
    "Please explain the difference between a local variable and a global variable.",
    "What happens when your code accesses an array index out of bounds?"
  ];

  if (nextIdx >= demoQuestions.length) {
    twiml.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, 'Assessment complete. Thank you.');
    twiml.pause({ length: 1 });
    twiml.hangup();
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

  const questionToAsk = demoQuestions[nextIdx];
  const transcriptionUrl = `/api/twilio/transcription?submissionId=${submissionId}&next=${nextIdx}&qText=${encodeURIComponent(questionToAsk)}`;

  const sayNode = twiml.say({ voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" }, '');

  if (nextIdx === 0) {
    sayNode.prosody(
      { rate: '80%' }, 
      ` Question 1. ${questionToAsk}`
    );
  } else {
    sayNode.prosody(
      { rate: '80%' }, 
      `Question 2. ${questionToAsk}`
    );
  }

  twiml.record({
    action: transcriptionUrl,
    transcribe: true,
    transcribeCallback: transcriptionUrl,
    maxLength: 60,
    timeout: 2,
    playBeep: false
  });

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}