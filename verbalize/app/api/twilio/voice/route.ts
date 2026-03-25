import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // <Gather> get user pin
  // action to check out pin
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather action="/api/twilio/verify" numDigits="4" timeout="10">
        <Say voice="Polly.Joanna">Welcome to Verbalize. Please enter your 4-digit PIN code using your keypad.</Say>
    </Gather>
    <Say voice="Polly.Joanna">We didn't receive any input. Goodbye!</Say>
    <Hangup/>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml', 'Cache-Control': 'no-store' },
  });
}