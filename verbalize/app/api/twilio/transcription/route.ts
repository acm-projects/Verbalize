import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server"
import { analyzeTranscript } from "@/lib/analysis";

export async function POST(request: Request) {

  const supabase = await createClient()
  
  try {
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

  const aiData = await analyzeTranscript(transcriptionText as string);

  if (transcriptionText && callSid) {
      const { error } = await supabase
        .from('Results') 
        .insert([
          { 
            call_id: callSid,
            recording_url: recordingUrl,
            student_response: transcriptionText,
            summary: aiData.summary,
            confidence_score: aiData.confidence,
            created_at: new Date().toISOString()
          },
        ]);

      if (error) {
        console.error('Supabase Insert Error:', error);
        // We still return 200 to Twilio so they stop retrying, 
        // but log the error internally.
      } else {
        console.log('Successfully saved to database.');
      }
    }

  // 5. Return a 200 OK to Twilio
  // NOTE: This endpoint does NOT need to return TwiML/XML because it's an 
  // asynchronous background process that doesn't affect the live call audio.
  return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling Twilio webhook:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}