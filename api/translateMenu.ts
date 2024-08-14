import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJsonFromText } from "../apiUtils/data.ts";
import { assignUniqueIds } from "../apiUtils/ids.ts";
import { GeminiModels } from "../apiUtils/aiModels.ts";

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

/**
 * Translate doc to target language and return as json.
 */
export const POST = async (req: Request) => {
  let obj = {};

  try {
    const { language, langCode, prompt, primary, apiKey } = await req.json();
    // Generate
    const serverApiKey = process?.env?.GEMINI_API_KEY;
    const genGemini = new GoogleGenerativeAI(apiKey || serverApiKey);
    const model = genGemini?.getGenerativeModel({
      model: GeminiModels.GEMINI_1_5_FLASH,
    });
    // Response
    const result = await model.generateContent(prompt);
    const response = result?.response;
    // Extract json from "text"
    const jsonStr = extractJsonFromText(response.text());
    if (jsonStr) obj = JSON.parse(jsonStr);
    // Assign language
    obj[language] = langCode;
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
