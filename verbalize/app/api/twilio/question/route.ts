import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const currentIndex = parseInt(url.searchParams.get('next') || '0');
  const submissionId = url.searchParams.get('submissionId');
  const qIdsParam = url.searchParams.get('qIds'); 

  if (!submissionId || !qIdsParam) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  // Parse the comma-separated IDs back into an array
  const questionIds = qIdsParam.split(',');

  // 1. Check if the assessment is complete
  if (currentIndex >= questionIds.length) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">You have completed the assessment. Thank you and goodbye.</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  const currentQuestionId = questionIds[currentIndex];
  const supabase = await createClient();

  // 2. Fetch the specific question text from the database
  const { data: questionData, error } = await supabase
    .from('Assignment_Questions')
    .select('id, question_text')
    .eq('id', currentQuestionId)
    .single();

  if (error || !questionData) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response><Say voice="Polly.Joanna">Error loading question.</Say><Hangup/></Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  const nextIndex = currentIndex + 1;
  
  // 3. Generate TwiML and pass state forward
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
      <Say voice="Polly.Joanna">Question ${nextIndex}: ${questionData.question_text}</Say>
      <Record 
          action="/api/twilio/question?next=${nextIndex}&amp;qIds=${qIdsParam}&amp;submissionId=${submissionId}" 
          timeout="5" 
          transcribe="true" 
          transcribeCallback="/api/twilio/transcription?submissionId=${submissionId}&amp;questionId=${questionData.id}" 
          playBeep="true" 
      />
  </Response>`;

  return new NextResponse(twiml, { 
    headers: { 'Content-Type': 'text/xml', 'Cache-Control': 'no-store' } 
  });
}