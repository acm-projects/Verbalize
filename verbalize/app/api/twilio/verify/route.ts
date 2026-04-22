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

  const { data: submission, error: subError } = await supabase
    .from('Submissions')
    .select('id, assignment_id, student_id') 
    .eq('pin_id', digits)
    .single();

  if (subError || !submission) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Stephen-Neural">
            <prosody rate="80%">Invalid PIN code. Access denied.</prosody>
        </Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
      <Say voice="Polly.Stephen-Neural">
          <prosody rate="80%">PIN verified.</prosody>
      </Say>
      <Redirect>/api/twilio/question?next=0&amp;submissionId=${submission.id}</Redirect>
  </Response>`;

  return new NextResponse(twiml, { 
    headers: { 'Content-Type': 'text/xml', 'Cache-Control': 'no-store' } 
  });
}