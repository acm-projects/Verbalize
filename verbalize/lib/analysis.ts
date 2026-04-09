import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeTranscript(text: string) {
  
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `You are an expert CS Teaching Assistant. Analyze the student's oral response.
        1. Provide a concise 1-2 sentence summary of their answer.
        2. Assign a confidence score (0-100) based on technical accuracy and clarity.
        Return ONLY valid JSON.`
      },
      { role: "user", content: `Transcript: "${text}"` }
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
            confidence: { type: "number" } 
          },
          required: ["summary", "confidence"],
          additionalProperties: false
        }
      }
    }
  });

  // Parse and return the structured data
  return JSON.parse(response.choices[0].message.content || "{}");
}