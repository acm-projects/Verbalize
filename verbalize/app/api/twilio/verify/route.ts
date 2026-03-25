import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const digits = formData.get('Digits'); 

  if (digits !== '1234') {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">Invalid PIN code. Access denied. Goodbye.</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">PIN verified. Let's begin your technical interview.</Say>
    <Redirect>/api/twilio/question?next=1</Redirect>
</Response>`;

  return new NextResponse(twiml, { 
    headers: { 'Content-Type': 'text/xml', 'Cache-Control': 'no-store' } 
  });
}