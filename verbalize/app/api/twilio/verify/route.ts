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
    .select('id, assignment_id, student_id') 
    .eq('pin_id', digits)
    .single();

  if (subError || !submission) {
    const twiml = `<Response><Say voice="Polly.Joanna">Invalid PIN code. Access denied.</Say><Hangup/></Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  
  const { data: specificRow } = await supabase
    .from('StudentSpecificQuestions')
    .select('id')
    .eq('assignment_id', submission.assignment_id)
    .eq('student_id', submission.student_id)
    .single();

  
  const { data: generalPool } = await supabase
    .from('Assignment_Questions')
    .select('id')
    .eq('assignment_id', submission.assignment_id);

  if (!specificRow || !generalPool || generalPool.length === 0) {
    const twiml = `<Response><Say voice="Polly.Joanna">Error loading questions.</Say><Hangup/></Response>`;
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  }

    const randomGeneralId = generalPool[Math.floor(Math.random() * generalPool.length)].id;
    

  
  const specificId = specificRow.id;
  const selectedQuestionIds = `${specificId},${specificId},${randomGeneralId}`;

  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
      <Say voice="Polly.Joanna">PIN verified. Let's begin.</Say>
      <Redirect>/api/twilio/question?next=0&amp;qIds=${selectedQuestionIds}&amp;submissionId=${submission.id}</Redirect>
  </Response>`;

  return new NextResponse(twiml, { 
    headers: { 'Content-Type': 'text/xml', 'Cache-Control': 'no-store' } 
  });
}