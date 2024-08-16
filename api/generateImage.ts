import OpenAI from "openai";
import { OpenAIModels, getOpenAIApiKey } from "../apiUtils/aiModels";

const generateImage = async ({ prompt, model, apiKey }) => {
  const openai = new OpenAI(apiKey);
  const image = await openai.images.generate({
    prompt,
    model,
    size: "256x256", // dall-e-3 only supports 1024x and up
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
      });
      const parsed = imgRes?.data?.[0]?.["b64_json"];
      source = `data:image/png;base64,${parsed}`;
    } else {
      throw new Error("No API key 🔑 provided.");
    }
    return source;
  } catch (err) {
    const msg = `Failed to generate image:\n${err}`;
    if (!apiKey) console.error(msg);
    else console.error(`${msg}`);
    throw msg;
  }
};

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

export const POST = async (req: Request) => {
  const { name, description, apiKey } = await req.json();
  let imageSource = "";

  try {
    // Build a prompt
    const descr = description ? `Description: ${description}` : "";
    const prompt = `
    A professional, high-resolution photograph of an elegant food presentation shot from a three-quarters view focused on subject with bokeh effect:
    Subject: ${name}.
    ${descr}
    Style: Curated, high quality, food menu style similar to photos on unsplash.com or Yelp.
    Scene: Place the subject on a decorated table or other surface in an environment that reflects the location of the origin of the item. The food is beautifully arranged with artistic garnishes that will contrast with the subject. The lighting is warm and natural, highlighting the textures and colors of the dishes, creating a welcoming and appetizing atmosphere. The background is blurred slightly to emphasize the focus on the food.
    `;

    // Generate image for item
    imageSource = await createEncodedImage(prompt, apiKey || getOpenAIApiKey());
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
