// ... existing imports
import { analyzeTranscript } from '@/lib/gemini';

export async function POST(request: Request) {
  // ... (Your existing parsing and Supabase code)

  try {
    // 1. Run the AI Analysis
    const analysis = await analyzeTranscript(transcriptionText);

    // 2. Update the record in Supabase with the new data
    await supabase
      .from('transcripts')
      .update({ 
        summary: analysis.summary, 
        confidence_score: analysis.confidence 
      })
      .eq('call_sid', callSid);

    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error("AI Analysis failed:", err);
    return new NextResponse('OK', { status: 200 }); // Still return 200 to Twilio
  }
}
