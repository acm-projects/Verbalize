import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const nextQuestion = url.searchParams.get('next'); // 获取 URL 里的 ?next=2
  
  // Twilio 会在 formData 里传来上一题的录音文件 URL (RecordingUrl)
  const formData = await request.formData();
  const recordingUrl = formData.get('RecordingUrl');
  console.log(`[第一题录音地址]: ${recordingUrl}`); // 你可以把这个存进数据库

  if (nextQuestion === '2') {
    // 问第二题
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">Received. Now, Question 2: Explain React Hooks.</Say>
        <Record 
            action="/api/twilio/question?next=done" 
            timeout="5" 
            transcribe="true" 
            transcribeCallback="/api/twilio/transcription" 
            playBeep="true" 
        />
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  if (nextQuestion === 'done') {
    // 结束通话
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">You have completed the assignment. Thank you, and goodbye!</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }
}