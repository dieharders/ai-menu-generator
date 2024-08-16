import OpenAI from "openai";
import { OpenAIModels, getOpenAIApiKey } from "../apiUtils/aiModels";

const generateImage = async ({ prompt, model, apiKey }) => {
  const openai = new OpenAI(apiKey);
  const image = await openai.images.generate({
    prompt,
    model,
    size: "256x256",
    response_format: "b64_json",
    style: "vivid", // dall-e-3 only
    quality: "hd", // dall-e-3 only
  });
  return image;
};

// Return an image as a base64 string
const createEncodedImage = async (description: string, apiKey: string) => {
  let source = "";
  try {
    // Call image generation model
    if (apiKey) {
      const imgRes = await generateImage({
        apiKey,
        prompt: description,
        model: OpenAIModels.DALL_E_3,
      });
      const parsed = imgRes?.data?.[0]?.["b64_json"];
      source = `data:image/png;base64,${parsed}`;
    } else {
      throw new Error("No API key 🔑 provided.");
    }
  } catch (err) {
    const msg = `Failed to generate image:\n${err}`;
    if (!apiKey) console.error(msg);
    else console.error(`${msg}\n${err}`);
  }

  return source;
};

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

export const POST = async (req: Request) => {
  const { description, apiKey } = await req.json();
  let imageSource = "";

  try {
    // Generate image for item
    imageSource = await createEncodedImage(
      description,
      apiKey || getOpenAIApiKey()
    );
    return new Response(JSON.stringify({ data: { imageSource } }));
  } catch (err) {
    const msg = `Failed to process image:\n${err}`;
    console.error(msg);

    return new Response(
      JSON.stringify({ error: true, message: msg, data: {} }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
