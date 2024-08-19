import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJsonFromText } from "../apiUtils/parsing";
import { assignUniqueIds } from "../apiUtils/ids";
import { GeminiModels, getGeminiApiKey } from "../apiUtils/aiModels";

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

/**
 * Translate doc to target language and return as json.
 */
export const POST = async (req: Request) => {
  let obj = {};

  try {
    const { langCode, prompt, primary, apiKey } = await req.json();
    // Generate
    const serverApiKey = getGeminiApiKey();
    const genGemini = new GoogleGenerativeAI(apiKey || serverApiKey);
    const model = genGemini?.getGenerativeModel({
      model: GeminiModels.GEMINI_1_5_FLASH,
      // systemInstruction:
      //   "You are a master translator. You have years of experience turning one language into another. You also have coding knowledge which you also use to translate a language into JSON code.",
      generationConfig: {
        temperature: 0.2,
        // responseSchema: {}, // requires Gemini 1.5 Pro models - https://ai.google.dev/gemini-api/docs/json-mode?lang=node
        // responseMimeType: "application/json",
        // candidateCount: 1,
        // stopSequences: ["x"],
        // maxOutputTokens: 20,
        // presencePenalty: float,
        // frequencyPenalty: float,
        // topP: number,
        // topK: number,
      },
    });
    // Response
    const result = await model.generateContent(prompt);
    const response = result?.response;
    // Extract json from "text"
    const jsonStr = extractJsonFromText(response.text());
    if (jsonStr) obj = JSON.parse(jsonStr);
    // Assign language
    obj["language"] = langCode;
    // Assign same ids as primary
    obj = assignUniqueIds({
      data: obj,
      primary,
    });
    return new Response(JSON.stringify({ data: obj }));
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: true, message: err, data: {} }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
