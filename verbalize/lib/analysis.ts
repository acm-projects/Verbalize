import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeTranscript(text: string,questionText: string) {
  
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `You are a STRICT and ELITE CS Teaching Assistant. 
        You are grading an oral response to this specific question: "${questionText}" on a scale from 0-100, using only whole numbers

        STRICT GRADING RULES:
        1. RELEVANCY: If the student's answer is random or doesn't address the question, score MUST be 0.
        2. NO PITY POINTS: Do not give a 30-50 score for "effort." 
        3. BULLSHIT DETECTOR: If the student uses buzzwords but doesn't explain the concept, score below 15.
        4. FORMAT: The grade MUST be a WHOLE NUMBER (Integer) between 0 and 100.
        
        Return ONLY valid JSON.`
      },
      { role: "user", content: `Student Answer: "${text}"` }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "transcript_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            grade: { type: "integer" } 
          },
          required: ["summary", "grade"],
          additionalProperties: false
        }
      }
    }
  });

  // Parse and return the structured data
  return JSON.parse(response.choices[0].message.content || "{}");
}