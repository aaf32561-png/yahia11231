
import { GoogleGenAI, Type } from "@google/genai";
import { AppLanguage, ProgrammingLanguage, ProjectRoadmap } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  
  constructor() {
    // Direct initialization from process.env.API_KEY as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Changed return type to any to resolve the type mismatch in App.tsx where description is expected as a string from the API
  async getDynamicLanguageGuide(langName: string, appLang: AppLanguage): Promise<any> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a simplified guide for the programming language "${langName}" in ${appLang === 'ar' ? 'Arabic' : 'English'}. 
      Include: 1. A very simple 1-sentence description. 2. 3 common use cases. 3. A "Hello World" code snippet. 4. Recommended apps or tools for learning it. 
      Format as JSON with keys: description, useCases (array), helloWorld, tools (array of {name, platform, url, description}).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
            helloWorld: { type: Type.STRING },
            tools: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    try {
      // Use the .text property directly as per guidelines
      return JSON.parse(response.text.trim());
    } catch (e) {
      throw new Error("Failed to parse language guide");
    }
  }

  async generateProjectRoadmap(idea: string, appLang: AppLanguage): Promise<ProjectRoadmap> {
    const prompt = `Generate a coding project roadmap for this idea: "${idea}". 
    Target language: ${appLang === 'ar' ? 'Arabic' : 'English'}.
    Simplify it for a beginner. 
    Format as JSON with keys: title, difficulty, languages (array), steps (array of objects with title and description).`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            languages: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    // Use the .text property directly as per guidelines
    return JSON.parse(response.text.trim());
  }

  async chat(message: string, history: any[], lang: AppLanguage) {
    const chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: lang === 'ar'
          ? "أنت خبير في كل لغات البرمجة. تجيب باللغة العربية بأسلوب مشجع ومبسط جداً. إذا سأل المستخدم عن مشروع، اقترح عليه الخطوات والأدوات."
          : "You are an expert in all programming languages. Answer in English with an encouraging and very simplified style. If a user asks about a project, suggest steps and tools.",
      }
    });
    const response = await chat.sendMessage({ message });
    // Use the .text property directly as per guidelines
    return response.text || "";
  }
}
