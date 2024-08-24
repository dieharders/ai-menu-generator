import OpenAI from "openai";
import { OpenAIModels, getOpenAIApiKey } from "../apiUtils/aiModels";

const generateImage = async ({ prompt, model, size, apiKey }) => {
  const openai = new OpenAI({ apiKey });
  const image = await openai.images.generate({
    prompt,
    model,
    size,
    response_format: "b64_json",
    // style: "vivid", // dall-e-3 only
    // quality: "hd", // dall-e-3 only
  });
  return image;
};

// Return an image as a base64 string
const createEncodedImage = async (prompt: string, apiKey: string) => {
  try {
    let source = "";
    // Call image generation model
    if (apiKey) {
      const imgRes = await generateImage({
        apiKey,
        prompt,
        model: OpenAIModels.DALL_E_2,
        size: "256x256", // dall-e-3 only supports 1024x and up
      });
      const parsed = imgRes?.data?.[0]?.["b64_json"];
      source = `data:image/png;base64,${parsed}`;
    } else {
      throw new Error("No API key 🔑 provided.");
    }
    return source;
  } catch (err) {
    const msg = `Failed to generate image:\n${err}`;
    console.error(`${msg}`);
    throw msg;
  }
};

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

export const POST = async (req: Request) => {
  const { name, description, category, ingredients, apiKey } = await req.json();
  let imageSource = "";

  try {
    // Build a prompt, max length 1000
    const descr = description ? `Description: ${description}` : "";
    const type = category ? `Category: ${category}.` : "";
    const ingredientsDescr = ingredients ? `Ingredients: ${ingredients}.` : "";
    const prompt = `
    A professional, high-resolution photograph of an elegant food presentation shot from a three-quarters view focused on subject with bokeh effect:
    Subject: ${name}.
    ${type}
    ${descr}
    ${ingredientsDescr?.substring?.(0, 100)}
    Style: Curated, high quality, food menu style similar to photos on unsplash.com or Yelp.
    Scene: Place the subject on a decorated surface. Arrange food with artistic garnishes that contrasts with the subject. Lighting is warm and natural to highlight the dish. Background is blurred slightly to emphasize focus on the food.
    `;

    // Generate image for item
    imageSource = await createEncodedImage(prompt, apiKey || getOpenAIApiKey());
    return new Response(JSON.stringify({ data: { imageSource } }));
  } catch (err) {
    const msg = `Failed to process image:\n${err}`;
    console.error(`${msg}`);

    return new Response(
      JSON.stringify({ error: true, message: msg, data: {} }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
