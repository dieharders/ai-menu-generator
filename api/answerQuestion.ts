import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiModels, getGeminiApiKey } from "../apiUtils/aiModels";

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

const cleanMarkdown = (markdown: string) => {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove image syntax ![alt](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove link syntax [text](url)
    .replace(/(^|\s)(#+\s)/g, "$1") // Remove headings #, ##, ###, etc.
    .replace(/[*_~`]/g, "") // Remove *, _, ~, `
    .replace(/^[>\-+]\s/gm, "") // Remove blockquotes, bullets, and list items
    .replace(/\n{2,}/g, "\n") // Replace multiple newlines with a single newline
    .replace(/^\s+|\s+$/g, ""); // Trim leading and trailing whitespace
};

export const POST = async (req: Request) => {
  try {
    const { prompt, info, apiKey } = await req.json();
    const serverApiKey = getGeminiApiKey();
    const genGemini = new GoogleGenerativeAI(apiKey || serverApiKey);
    const model = genGemini?.getGenerativeModel({
      model: GeminiModels.GEMINI_1_0_PRO,
    });
    // Use `info` as basis for info retrieval
    const cleanedInfo = cleanMarkdown(info);
    const result = await model.generateContent([prompt, cleanedInfo]);
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
