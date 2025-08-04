import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Use a more capable model if available
      generationConfig: {
        maxOutputTokens: 4096, // Higher limit for longer content
        temperature: 0.7, // Balanced creativity
      },
    });

    const detailedPrompt = `
Write a professional, theory-rich blog article on the topic: "${prompt}".

Guidelines:
- Use a formal and informative tone, suitable for an educated audience (e.g., tech professionals, researchers, or policy analysts).
- Structure the article like a published editorial or research-backed essay.
- Minimum length: 1000+ words.
- Begin with a strong, engaging introduction that defines the topic and sets context.
- Include clearly labeled sections with the following headings:
   1. Positive Impacts
   2. Negative Impacts
   3. Conclusion
- Support each point with theoretical explanations, examples, and (where appropriate) references to real-world events, studies, or data.
- Avoid overly simplistic language or generic claims—focus on depth, insight, and clarity.
- Format the output as a newspaper-style article: no excessive newlines, use clean paragraph structure, and avoid bulleted formatting unless listing complex theories or categories.
- Ensure coherence between sections and end with a strong concluding insight or call to action.
`;

    const result = await model.generateContent([detailedPrompt]);
    const response = await result.response;
    const text = await response.text();

    return text.trim();
  } catch (error) {
    console.error("Gemini generation error:", error.message);
    return "AI generation failed: " + error.message;
  }
}

export default main;
