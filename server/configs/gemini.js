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

Requirements:
- Length: Minimum 1200 words (comprehensive and well-developed).
- Tone: Formal, informative, and analytical, suitable for an educated audience (tech professionals, researchers, policymakers).
- Style: Editorial or research-backed essay, similar to a published newspaper opinion piece or policy journal.
- Structure:
   <h2>Introduction</h2>
   <h2>Positive Impacts</h2>
   <h2>Negative Impacts</h2>
   <h2>Conclusion</h2>
- Content depth:
   • Support claims with established theories, scholarly concepts, or models (e.g., Schumpeter’s Creative Destruction, Human Capital Theory, Network Society).
   • Provide real-world examples, case studies, or relevant data.
   • Avoid vague or generic statements; prioritize clarity, insight, and intellectual rigor.
- Formatting:
   • Return output in clean HTML with <h2> for section headings, <p> for paragraphs.
   • Use <ul><li> only when presenting theories, frameworks, or categorized lists.
   • Ensure readability and a professional newspaper-style layout.
- Coherence: Ensure smooth transitions between sections for logical flow and consistency.
- Conclusion: End with a strong, reflective insight or call to action highlighting the broader significance of the topic.
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
