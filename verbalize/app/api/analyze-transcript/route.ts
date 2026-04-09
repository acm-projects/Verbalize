import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";
import { analyzeTranscript } from '@/lib/analysis'; 

export async function POST(request: Request) {
  try {
    const { transcriptionText, callSid } = await request.json();
    const supabase = await createClient();

    
    const analysis = await analyzeTranscript(transcriptionText);

    // 2. Update Supabase
    const { error } = await supabase
      .from('Results')
      .update({ 
        summary: analysis.summary, 
        confidence_score: analysis.confidence // This matches the key in your schema
      })
      .eq('call_sid', callSid);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Groq Analysis failed:", err.message);
    return new NextResponse('Internal Error handled', { status: 200 });
  }
}