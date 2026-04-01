import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Parse the asynchronous form data sent by Twilio
  const formData = await request.formData();
  
  // 2. Extract core metadata for the student's submission
  const transcriptionText = formData.get('TranscriptionText'); // The converted text
  const recordingUrl = formData.get('RecordingUrl');           // Link to the audio file
  const callSid = formData.get('CallSid');                     // Unique ID for this specific call

  // 3. Log data to the terminal (This is where we connect to Supabase later)
  console.log('--- New Transcript Received ---');
  console.log(`[Call SID]: ${callSid}`);
  console.log(`[Audio URL]: ${recordingUrl}`);
  console.log(`[Student Response]: ${transcriptionText}`);
  console.log('-------------------------------');


  // 4. Return a 200 OK to Twilio
  // NOTE: This endpoint does NOT need to return TwiML/XML because it's an 
  // asynchronous background process that doesn't affect the live call audio.
  return new NextResponse('OK', { status: 200 });
}