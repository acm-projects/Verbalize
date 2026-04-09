import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get('text') ?? '';

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model_id: 'eleven_turbo_v2_5' }),
    }
  );

  return new NextResponse(response.body, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}