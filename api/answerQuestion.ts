import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiModels } from "../apiUtils/aiModels.ts";

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

export const POST = async (req: Request) => {
  try {
    const { prompt, info, apiKey } = await req.json();
    const serverApiKey = process?.env?.GEMINI_API_KEY;
    const genGemini = new GoogleGenerativeAI(apiKey || serverApiKey);
    const model = genGemini?.getGenerativeModel({
      model: GeminiModels.GEMINI_1_0_PRO,
    });
    // Use `info` as basis for info retrieval
    const result = await model.generateContent([prompt, info]);
    const response = result?.response;
    const text = response?.text();
    return new Response(JSON.stringify({ data: text }));
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
