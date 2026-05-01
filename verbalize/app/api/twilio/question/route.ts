import { NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get('submissionId');
  const nextIdx = parseInt(url.searchParams.get('next') || '0', 10);

  const qIds = url.searchParams.get('qIds') || "";
  const sources = url.searchParams.get('sources') || "";

  const qIdArray = qIds.split(',');
  const sourceArray = sources.split(',');

  const currentQuestionId = qIdArray[nextIdx] || '';
  const currentSource = sourceArray[nextIdx] || 'assignment_general';

  const twiml = new VoiceResponse();

  if (!submissionId) {
    const sayNode = twiml.say(
      { voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" },
      ''
    );
    sayNode.prosody({ rate: '80%' }, 'Error: missing submission data.');

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  const demoQuestions = [
    "What happens when your code accesses an array index out of bounds?",
    "Please explain the difference between a local variable and a global variable."
  ];

  if (nextIdx >= demoQuestions.length) {
    const sayNode = twiml.say(
      { voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" },
      ''
    );
    sayNode.prosody({ rate: '80%' }, 'Assessment complete. Thank you.');

    twiml.pause({ length: 1 });
    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  const questionToAsk = demoQuestions[nextIdx];

  const transcriptionUrl =
    `/api/twilio/transcription?submissionId=${submissionId}` +
    `&next=${nextIdx}` +
    `&questionId=${currentQuestionId}` +
    `&source=${currentSource}` +
    `&qIds=${qIds}` +
    `&sources=${sources}`;

  const gather = twiml.gather({
    input: ['speech'],
    action: transcriptionUrl,
    method: 'POST',
    speechTimeout: 'auto',
    timeout: 20,
  });

  const sayNode = gather.say(
    { voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" },
    ''
  );

  sayNode.prosody(
    { rate: '80%' },
    `Question ${nextIdx + 1}. ${questionToAsk}`
  );

  const noInputSay = twiml.say(
    { voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" },
    ''
  );

  noInputSay.prosody(
    { rate: '80%' },
    'I did not hear a response. Moving to the next question.'
  );

  twiml.redirect(
    `/api/twilio/question?submissionId=${submissionId}&next=${nextIdx + 1}&qIds=${qIds}&sources=${sources}`
  );

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}