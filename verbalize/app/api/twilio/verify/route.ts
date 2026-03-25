import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 解析 Twilio 传过来的表单数据，提取按键结果 (Digits)
  const formData = await request.formData();
  const digits = formData.get('Digits'); 

  // 模拟后端数据库验证 (假设正确的 PIN 是 1234)
  if (digits !== '1234') {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="Polly.Joanna">Invalid PIN code. Goodbye.</Say>
        <Hangup/>
    </Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }

  // PIN 码正确，准备第一道题
  // timeout="5" 就是 PM 要求的 5秒静音断开
  // transcribe="true" 开启语音转文字
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">PIN verified. Let's begin.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Joanna">Question 1: What is a closure in JavaScript?</Say>
    
    <Record 
        action="/api/twilio/question?next=2" 
        timeout="5" 
        transcribe="true" 
        transcribeCallback="/api/twilio/transcription" 
        playBeep="true" 
    />
</Response>`;

  return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
}