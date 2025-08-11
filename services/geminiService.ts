/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import {GoogleGenAI, Type} from '@google/genai';

// Global API client instance - will be updated when user sets API key
let ai: GoogleGenAI | null = null;
const modelName = 'gemini-2.5-flash';

// Initialize with environment API key if available
if (process.env.API_KEY && process.env.API_KEY !== 'PLACEHOLDER_API_KEY') {
  ai = new GoogleGenAI({apiKey: process.env.API_KEY});
}

/**
 * Updates the global AI client with a new API key
 */
export function setApiKey(apiKey: string | null): void {
  if (apiKey && apiKey.trim()) {
    ai = new GoogleGenAI({apiKey: apiKey.trim()});
  } else {
    ai = null;
  }
}

/**
 * Gets the current API key from localStorage or environment
 */
export function getCurrentApiKey(): string | null {
  // First check localStorage for user-provided key
  if (typeof window !== 'undefined') {
    const userKey = localStorage.getItem('gemini_api_key');
    if (userKey && userKey.trim()) {
      return userKey;
    }
  }
  
  // Fallback to environment key
  if (process.env.API_KEY && process.env.API_KEY !== 'PLACEHOLDER_API_KEY') {
    return process.env.API_KEY;
  }
  
  return null;
}

/**
 * Initializes the AI client with the current API key
 */
function ensureAiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
      throw new Error('No API key configured. Please set up your Gemini API key.');
    }
    ai = new GoogleGenAI({apiKey});
  }
  return ai;
}

const ENABLE_THINKING_FOR_ASCII_ART = false;
const ENABLE_ASCII_TEXT_GENERATION = false;

export interface AsciiArtData {
  art: string;
  text?: string;
}

// == NEW WORKSHEET INTERFACES ==
export interface WordDetail {
  word: string;
  koreanMeaning: string;
  englishDefinition: string;
}

export interface TestItem {
  question: string;
  answer: string;
}

export interface WorksheetData {
  title: string;
  summary: string;
  keywords: string[];
  wordDetails: WordDetail[];
  test: TestItem[];
}


export async function analyzeTextForVocabulary(text: string): Promise<string[]> {
  const client = ensureAiClient();
  if (!text.trim()) return [];

  const prompt = `Analyze the following English text. Identify 10 to 20 of the most challenging vocabulary words. Exclude proper nouns, numbers, and common function words. The result must be a JSON array of strings, sorted by difficulty (most difficult first). Return ONLY the raw JSON array.

Text for analysis:
---
${text}
---`;

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'A list of 10-20 challenging vocabulary words, sorted by difficulty (most difficult first).',
        },
      },
    });
    
    const result = JSON.parse(response.text);

    if (!Array.isArray(result) || !result.every(item => typeof item === 'string')) {
        console.error("Gemini API returned an invalid format for vocabulary list:", result);
        throw new Error('API returned data in an unexpected format.');
    }

    return result;

  } catch (error) {
    console.error('Error analyzing vocabulary from Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    throw new Error(`Could not analyze text for vocabulary: ${errorMessage}`);
  }
}

/**
 * Generates a complete learning worksheet from a text and a list of words.
 */
export async function generateWorksheetData(text: string, words: string[]): Promise<WorksheetData> {
    const client = ensureAiClient();
    if (!text.trim() || words.length === 0) throw new Error('Invalid input for worksheet generation.');

    const prompt = `You are an English language learning assistant. Based on the provided text and a list of vocabulary words, generate a comprehensive learning worksheet in JSON format.

    **Instructions:**
    1.  **title**: Create a concise, engaging title for the text (max 10 words).
    2.  **summary**: Write a one-paragraph summary of the text.
    3.  **keywords**: Extract an array of 5-7 important keywords from the text.
    4.  **wordDetails**: For each word in the provided list, create an object with:
        *   \`word\`: The vocabulary word itself.
        *   \`koreanMeaning\`: A concise Korean translation.
        *   \`englishDefinition\`: A simple, encyclopedia-style English definition.
    5.  **test**: Create a vocabulary test. For each word, generate a unique fill-in-the-blank question where the answer is the word. Provide the question and the answer.

    **Source Text:**
    ---
    ${text}
    ---

    **Vocabulary Words:**
    [${words.map(w => `"${w}"`).join(', ')}]

    Return ONLY the raw JSON object adhering to the specified schema.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A concise title for the text." },
            summary: { type: Type.STRING, description: "A one-paragraph summary of the text." },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 important keywords." },
            wordDetails: {
                type: Type.ARRAY,
                description: "Details for each vocabulary word.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING },
                        koreanMeaning: { type: Type.STRING },
                        englishDefinition: { type: Type.STRING }
                    },
                    required: ["word", "koreanMeaning", "englishDefinition"]
                }
            },
            test: {
                type: Type.ARRAY,
                description: "Vocabulary test with questions and answers.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        answer: { type: Type.STRING }
                    },
                    required: ["question", "answer"]
                }
            }
        },
        required: ["title", "summary", "keywords", "wordDetails", "test"]
    };

    try {
        const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });

        const data = JSON.parse(response.text) as WorksheetData;
        
        // Basic validation
        if (!data.title || !data.wordDetails || data.wordDetails.length === 0) {
            throw new Error('API returned incomplete worksheet data.');
        }

        return data;

    } catch (error) {
        console.error('Error generating worksheet from Gemini:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(`Could not generate worksheet: ${errorMessage}`);
    }
}


export async function* streamDefinition(topic: string): AsyncGenerator<string, void, undefined> {
  try {
    const client = ensureAiClient();
  } catch (error) {
    yield `Error: ${error instanceof Error ? error.message : 'API key not configured.'}`;
    return;
  }
  
  const client = ai!; // We know it's defined because ensureAiClient() succeeded
  const prompt = `Provide a concise, single-paragraph encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Do not use markdown, titles, or any special formatting. Respond with only the text of the definition itself.`;
  try {
    const response = await client.models.generateContentStream({
      model: modelName,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });
    for await (const chunk of response) {
      if (chunk.text) yield chunk.text;
    }
  } catch (error) {
    console.error('Error streaming from Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    yield `Error: Could not generate content for "${topic}". ${errorMessage}`;
    throw new Error(errorMessage);
  }
}

export async function generateAsciiArt(topic: string): Promise<AsciiArtData> {
  const client = ensureAiClient();
  
  const prompt = `For "${topic}", create a JSON object with one key: "art". "art" should be a meta ASCII visualization of the word. Use a palette of │─┌┐└┘├┤┬┴┼►◄▲▼○●◐◑░▒▓█▀▄■□▪▫★☆♦♠♣♥⟨⟩/\\_|. The visual form should embody the word's essence. Return ONLY the raw JSON object.`;

  const maxRetries = 1;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const config: any = { responseMimeType: 'application/json' };
      if (!ENABLE_THINKING_FOR_ASCII_ART) config.thinkingConfig = { thinkingBudget: 0 };

      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config,
      });

      let jsonStr = response.text.trim().replace(/^```(?:json)?\s*\n?(.*?)\n?\s*```$/s, '$1');
      if (!jsonStr.startsWith('{') || !jsonStr.endsWith('}')) throw new Error('Response is not a valid JSON object');

      const parsedData = JSON.parse(jsonStr) as AsciiArtData;
      if (typeof parsedData.art !== 'string' || parsedData.art.trim().length === 0) throw new Error('Invalid or empty ASCII art in response');
      
      const result: AsciiArtData = { art: parsedData.art };
      if (ENABLE_ASCII_TEXT_GENERATION && parsedData.text) result.text = parsedData.text;
      return result;

    } catch (error) {
      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error instanceof Error ? error.message : error);
      if (attempt === maxRetries) throw new Error(`Could not generate ASCII art after ${maxRetries} attempts.`);
    }
  }
  throw new Error('All ASCII art generation attempts failed');
}