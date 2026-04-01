import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { createClient } from "@/lib/supabase/server"; 


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    
    const { assignmentId, instructionText } = await req.json();

    
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are an examiner. Generate 20 technical questions based on instructions of the coding assignment. Ask coding related questions only, like. Output ONLY JSON."
        },
        { role: "user", content: instructionText }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "question_bank",
          strict: true, 
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" }
                  },
                  required: ["text"],
                  additionalProperties: false
                }
              }
            },
            required: ["questions"],
            additionalProperties: false
          }
        }
      }
    });

    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    
    const questionsToInsert = result.questions.map((q: any) => ({
      assignment_id: assignmentId,
      question_text: q.text 
    }));

    
    const supabase = await createClient();
    const { error } = await supabase
      .from("Assignment_Questions")
      .insert(questionsToInsert);

    if (error) throw error;

    
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}