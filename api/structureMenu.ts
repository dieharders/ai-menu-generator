import { GoogleGenerativeAI } from "@google/generative-ai";
import { assignUniqueIds } from "../apiUtils/ids";
import { extractJsonFromText } from "../apiUtils/parsing";
import { GeminiModels, getGeminiApiKey } from "../apiUtils/aiModels";

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

/**
 * Convert menu document to structured (json) data.
 */
export const POST = async (req: Request) => {
  try {
    const { menuDocument, id, prompt, apiKey } = await req.json();
    if (!menuDocument) throw new Error("Please provide data to process.");
    const serverApiKey = getGeminiApiKey();
    const genGemini = new GoogleGenerativeAI(apiKey || serverApiKey);
    const genModel = genGemini?.getGenerativeModel({
      model: GeminiModels.GEMINI_1_5_FLASH,
    });

    const res = await genModel.generateContent([prompt, menuDocument]);
    const response = res?.response;
    const text = response.text();
    // Convert result to js object
    const structText = extractJsonFromText(text);
    if (!structText) throw new Error("Failed to extract json from response.");
    const result = assignUniqueIds({
      data: JSON.parse(structText),
      id, // mark as the primary document
      // hash,
    });
    return new Response(JSON.stringify({ data: result }));
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
