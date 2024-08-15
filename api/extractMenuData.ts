import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiModels, getGeminiApiKey } from "../apiUtils/aiModels";

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

export const POST = async (req: Request) => {
  try {
    const { images, prompt, apiKey } = await req.json();
    const serverApiKey = getGeminiApiKey();
    const genGemini = new GoogleGenerativeAI(apiKey || serverApiKey);
    const model = genGemini?.getGenerativeModel({
      model: GeminiModels.GEMINI_1_5_FLASH,
    });
    const result = await model.generateContent([prompt, ...images]);
    const response = result?.response;
    const text = response.text();
    const data = text.trim();
    return new Response(JSON.stringify({ data }));
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
