import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { createClient } from "@/lib/supabase/server"; 
import fs from "fs";
import path from "path";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { assignmentId, studentId } = await req.json();

    
    const filePath = path.join(process.cwd(), "test-data", `sample_submission.js`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at ${filePath}`);
    }
    const studentCode = fs.readFileSync(filePath, "utf8");

   
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", 
      messages: [
        {
          role: "system",
          content: `You are a CS professor. Analyze the provided student code. 
          Generate exactly 2 unique questions that challenge the student on their specific implementation. 
          Focus on: Why they chose a certain logic, how they handle edge cases in THEIR code, or potential bugs you see.
          Return ONLY valid JSON.`
        },
        { role: "user", content: `Assignment ID: ${assignmentId}\nStudent Code:\n${studentCode}` }
      ],
      response_format: { type: "json_object" } 
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
   
    const supabase = await createClient();
    const { error } = await supabase
      .from("StudentSpecificQuestions") 
      .upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        questions: result.questions, 
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    return NextResponse.json({ success: true, questions: result.questions });

  } catch (error: any) {
    console.error("Student AI Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}