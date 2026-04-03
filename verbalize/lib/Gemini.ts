import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeTranscript(text: string) {
  const prompt = `
    Analyze the following student transcript. 
    1. Provide a brief summary of the response.
    2. Assign a confidence score from 0 to 100 based on how clear and complete the answer is.
    3. Return the result strictly in JSON format.

    Transcript: "${text}"
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text()); // Returns { summary: "...", confidence: 85 }
}
