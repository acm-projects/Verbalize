import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const nextStep = url.searchParams.get('next'); 
  

  const formData = await request.formData();
  const recordingUrl = formData.get('RecordingUrl');
  if (recordingUrl) {
    console.log(`[Twilio Log] last record URL: ${recordingUrl}`);
  }


  if (nextStep === '1') {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">Question 1: What is a closure in JavaScript?</Say>
        <Record 
            action="/api/twilio/question?next=2" 
            timeout="3" 
            transcribe="true" 
            transcribeCallback="/api/twilio/transcription" 
            playBeep="true" 
        />
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  
  if (nextStep === '2') {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">Received. Now, Question 2: Explain React Hooks.</Say>
        <Record 
            action="/api/twilio/question?next=done" 
            timeout="3" 
            transcribe="true" 
            transcribeCallback="/api/twilio/transcription" 
            playBeep="true" 
        />
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  
  if (nextStep === 'done') {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">You have completed the assignment. Thank you, and goodbye!</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  return new NextResponse('Invalid State', { status: 400 });
}