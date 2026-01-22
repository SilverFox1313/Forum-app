
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async searchCommunity(query: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search for information related to: ${query}. Provide a concise summary for a developer forum community.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No results found.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return { text, sources };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return { text: "Failed to fetch AI results.", sources: [] };
    }
  }

  async suggestTags(title: string, content: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 3-5 relevant technical tags for a forum post with Title: "${title}" and Content: "${content.substring(0, 300)}". Return only the tag names separated by commas.`,
      });
      return response.text?.split(',').map(t => t.trim()) || [];
    } catch (error) {
      return [];
    }
  }
}

export const gemini = new GeminiService();
