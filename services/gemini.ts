import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, IdentificationResult, DailyFact, ExplorerResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDailyFact = async (): Promise<DailyFact> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = "Generate a fascinating, short, lesser-known cultural fact about India. Return JSON with 'topic' (e.g. Architecture, Food, History) and 'fact' (max 2 sentences).";
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            fact: { type: Type.STRING },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyFact;
    }
    throw new Error("No response");
  } catch (e) {
    return { topic: "Did You Know?", fact: "The Kumbh Mela is visible from space, gathering over 100 million people." };
  }
};

export const searchHeritage = async (query: string): Promise<ExplorerResult> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Provide detailed information about the Indian heritage site, monument, or cultural element: "${query}". 
    If the query is not related to India or invalid, return a polite error description in the description field.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            location: { type: Type.STRING },
            builtBy: { type: Type.STRING },
            year: { type: Type.STRING },
            architecturalStyle: { type: Type.STRING },
            interestingFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ExplorerResult;
    }
    throw new Error("No response");
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch heritage details.");
  }
};

export const identifyHeritageImage = async (base64Image: string, mimeType: string): Promise<IdentificationResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `Identify this image. It is likely related to Indian culture, heritage, food, or monuments. 
    Provide the name, location (if applicable), historical significance, and 2-3 interesting cultural facts.
    If it is not related to India or cannot be identified, return a polite error message in the name field.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            location: { type: Type.STRING },
            historicalSignificance: { type: Type.STRING },
            culturalFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as IdentificationResult;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error identifying image:", error);
    throw error;
  }
};

export const generateQuizQuestions = async (count: number = 5, topic?: string): Promise<QuizQuestion[]> => {
  try {
    const model = 'gemini-2.5-flash';
    let prompt = `Generate ${count} multiple-choice questions about Indian cultural heritage, history, monuments, or festivals.`;
    
    if (topic === 'daily') {
      prompt += ` This is for a Daily Quiz. Make the questions diverse and interesting. Include a mix of difficulty levels.`;
    } else {
      prompt += ` Focus on interesting and lesser-known facts.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              answer: { type: Type.STRING, description: "Must match one of the options exactly" },
              explanation: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};