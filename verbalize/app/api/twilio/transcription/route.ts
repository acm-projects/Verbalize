import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. 解析 Twilio 异步传过来的表单数据
  const formData = await request.formData();
  
  // 2. 提取最核心的三个数据
  const transcriptionText = formData.get('TranscriptionText'); // 提取出的纯文本！
  const recordingUrl = formData.get('RecordingUrl');           // 对应的录音文件链接
  const callSid = formData.get('CallSid');                     // 这通电话的唯一 ID

  // 3. 打印到控制台（这里就是你未来对接后端的发力点）
  console.log('--- 收到新的语音转文本 (Transcript) ---');
  console.log(`[电话 ID]: ${callSid}`);
  console.log(`[录音链接]: ${recordingUrl}`);
  console.log(`[学生回答]: ${transcriptionText}`);
  console.log('---------------------------------------');

  // 未来真实场景的代码类似这样：
  /*
  await supabase.from('submissions').update({
      transcript: transcriptionText,
      audio_url: recordingUrl
  }).eq('call_sid', callSid);
  */

  // 4. 回复 Twilio 200 OK
  // 注意：这个接口不需要返回 XML，因为它是后台异步触发的，不影响电话那头的声音
  return new NextResponse('OK', { status: 200 });
}