import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini client", error);
}

export const generateMagicPost = async (topicOrDraft: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API Key not configured.");
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a social media expert. Rewrite the following text to be engaging, fun, and viral-worthy for a social media feed. Add a few relevant emojis. Keep it under 280 characters if possible, but prioritize quality. 
      
      Input: "${topicOrDraft}"`,
    });

    return response.text?.trim() || topicOrDraft;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
