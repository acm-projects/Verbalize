// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// const model = genAI.getGenerativeModel({ 
//   model: "gemini-3-flash-preview", 
//   generationConfig: {
//     responseMimeType: "application/json",
//   }
// });

// export async function analyzeTranscript(text: string) {
//   const prompt = `
//     Analyze the following student transcript. 
//     1. Provide a brief summary of the response.
//     2. Assign a score from 0 to 100 based on how clear and complete the answer is.
//     3. Return strictly a JSON object with keys "summary" and "score".

//     Transcript: "${text}"
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const cleanText = response.text();
    
//     return JSON.parse(cleanText);
//   } catch (error) {
//     console.error("Gemini Analysis Error:", error);
//     return { 
//       summary: "Error processing transcript.", 
//       score: 0 
//     };
//   }
// }
