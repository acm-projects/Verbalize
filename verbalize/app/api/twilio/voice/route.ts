import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  
  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say>Hello, how are you? Welcome to Verbalize.</Say>
    </Response>
  `;

 
  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}