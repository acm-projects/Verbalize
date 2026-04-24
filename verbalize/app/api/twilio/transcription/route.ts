import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from "@/lib/supabase/server";
import { analyzeTranscript } from "@/lib/analysis";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: Request) {
  const url = new URL(request.url);

  const submissionId = url.searchParams.get('submissionId');
  const nextIdxStr = url.searchParams.get('next');
  const nextIdx = parseInt(nextIdxStr || '0', 10);
  const questionId = url.searchParams.get('questionId');
  const source = url.searchParams.get('source');

  const qIds = url.searchParams.get('qIds') || "";
  const sources = url.searchParams.get('sources') || "";

  const formData = await request.formData();

  console.log("TRANSCRIPTION FORM:", Object.fromEntries(formData.entries()));

  const speechResult = formData.get('SpeechResult') as string | null;
  const transcriptionText = formData.get('TranscriptionText') as string | null;

  const finalText = speechResult || transcriptionText || "";

  const callSid = formData.get('CallSid') as string | null;

  if (finalText && submissionId && questionId) {
    console.log(`Received Answer for Q${nextIdx + 1}:`, finalText);

    try {
      const supabase = await createClient();

      const { data: subData } = await supabase
        .from('Submissions')
        .select('student_id, assignment_id')
        .eq('id', submissionId)
        .single();

      if (!subData) {
        throw new Error("Submission not found");
      }

      const { data: existing } = await supabase
        .from("Results")
        .select("id")
        .eq("submission_id", parseInt(submissionId, 10))
        .eq("question_id", questionId)
        .maybeSingle();

      if (existing) {
        console.log(`Duplicate Q${nextIdx + 1} skipped.`);
      } else {
        let questionTextForAI = "";

        if (source === "student_specific") {
          const { data: specData } = await supabase
            .from('StudentSpecificQuestions')
            .select('questions')
            .eq('assignment_id', subData.assignment_id)
            .eq('student_id', subData.student_id)
            .single();

          questionTextForAI = specData?.questions?.[nextIdx] || "";
        } else {
          const { data: qData } = await supabase
            .from('Assignment_Questions')
            .select('question_text')
            .eq('id', questionId)
            .single();

          questionTextForAI = qData?.question_text || "";
        }

        const aiResult = await analyzeTranscript(finalText, questionTextForAI);

        await supabase.from('Results').insert({
          submission_id: parseInt(submissionId, 10),
          student_id: subData.student_id || null,
          call_id: callSid,
          specific_q_id: source === "student_specific" ? questionId : null,
          assignment_q_id: source === "assignment_general" ? questionId : null,
          question_id: questionId,
          transcript: finalText,
          confidence_score: aiResult.grade,
          summary: aiResult.summary || "No summary provided",
          recording_url: null
        });

        console.log(`✅ Saved Q${nextIdx + 1} to DB successfully.`);
      }
    } catch (error) {
      console.error('❌ Failed to process AI or save to DB:', error);
    }
  } else {
    console.log(`No speech result for Q${nextIdx + 1}.`);
  }

  const twiml = new VoiceResponse();

  const sayNode = twiml.say(
    { voice: 'Polly.Stephen-Neural' as unknown as "Polly.Joanna" },
    ''
  );

  sayNode.prosody({ rate: '80%' }, 'Response recorded.');

  twiml.redirect(
    `/api/twilio/question?submissionId=${submissionId}&next=${nextIdx + 1}&qIds=${qIds}&sources=${sources}`
  );

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}