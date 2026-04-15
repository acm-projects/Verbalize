import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const digits = formData.get('Digits');

  if (!digits) {
    return new NextResponse('<Response><Hangup/></Response>', { 
      headers: { 'Content-Type': 'text/xml' } 
    });
  }

  const supabase = await createClient();

  // 1. Verify the PIN code
  const { data: submission, error: subError } = await supabase
    .from('Submissions')
    .select('id, assignment_id')
    .eq('pin_id', digits)
    .single();

  if (subError || !submission) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Stephen-Neural">Invalid PIN code. Access denied.</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  // 2. Fetch all questions related to this assignment
  const { data: allQuestions, error: qError } = await supabase
    .from('Assignment_Questions')
    .select('id')
    .eq('assignment_id', submission.assignment_id);

  if (qError || !allQuestions || allQuestions.length === 0) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Stephen-Neural">No questions available for this assignment.</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  // 3. Randomly select exactly 3 questions (or less if pool is smaller)
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  const selectedQuestionIds = shuffled.slice(0, 3).map(q => q.id).join(',');

  // 4. Redirect to the question route, passing the selected IDs in the URL
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
      <Say voice="Polly.Stephen-Neural">PIN verified. Let's begin your assessment.</Say>
      <Redirect>/api/twilio/question?next=0&amp;qIds=${selectedQuestionIds}&amp;submissionId=${submission.id}</Redirect>
  </Response>`;

  return new NextResponse(twiml, { 
    headers: { 'Content-Type': 'text/xml', 'Cache-Control': 'no-store' } 
  });
}