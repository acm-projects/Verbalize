import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { createClient } from "@/lib/supabase/server"; 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { assignmentId, studentId } = await req.json();
    const supabase = await createClient();

    
    const { data: submission, error: fetchError } = await supabase
      .from("Submissions")
      .select("code_text")
      .eq("assignment_id", assignmentId)
      .eq("student_id", studentId)
      .single();

    if (fetchError || !submission?.code_text) {
      throw new Error(`Code not found for Student ${studentId} in Assignment ${assignmentId}`);
    }

    const studentCode = submission.code_text;

    // 2. AI LOGIC: Using the real code fetched above
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", 
      messages: [
        {
          role: "system",
          content: `You are a CS professor. Analyze the provided student code. 
          Generate exactly 2 unique questions that challenge the student on their specific implementation.
          Focus on: Why they chose a certain logic, how they handle edge cases in THEIR code, or potential bugs you see.
          Return ONLY valid JSON.
`
        },
        { role: "user", content: `Code:\n${studentCode}` }
      ],
      response_format: { type: "json_schema",
        json_schema: {
          name: "student_questions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              // We force it to provide an array of strings
              questions: {
                type: "array",
                items: { type: "string" },
                minItems: 2,
                maxItems: 2
              }
            },
            required: ["questions"],
            additionalProperties: false
          }
        }
       } 
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // 3. STORAGE: Save to the specific questions table
    const { error: upsertError } = await supabase
      .from("StudentSpecificQuestions") 
      .upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        questions: result.questions, 
        created_at: new Date().toISOString()
      });

    if (upsertError) throw upsertError;

    return NextResponse.json({ success: true, questions: result.questions });

  } catch (error: any) {
    console.error("Student AI Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}