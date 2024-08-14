import { OpenAIModels } from "../apiUtils/aiModels";
import { waitForTimeout } from "../apiUtils/common";
import OpenAI from "openai";

const maxGenerations = 10;

const generateImage = async ({ prompt, model, apiKey }) => {
  const openai = new OpenAI(apiKey);
  const image = await openai.images.generate({
    prompt,
    model,
    size: "256x256",
    response_format: "b64_json",
    // style: "vivid", // dall-e-3 only
    // quality: "hd", // dall-e-3 only
  });
  return image;
};

// Return an image as a base64 string
const createEncodedImage = async (
  description: string,
  index: number,
  total: number,
  apiKey: string
) => {
  let source = "";
  const isOverLimit = index >= maxGenerations;
  try {
    // Call image generation model
    if (!isOverLimit && apiKey) {
      // setLoadingText(
      //   `Generating image from description (${index}/${total}):\n\n${description}`
      // );

      const imgRes = await generateImage({
        apiKey,
        prompt: description,
        model: OpenAIModels.DALL_E_3,
      });
      const parsed = imgRes?.data?.[0]?.["b64_json"];
      source = `data:image/png;base64,${parsed}`;
    } else {
      // const img = (await import("../assets/images/placeholder.png")).default;
      // source = await encodeB64(img);
      // @TODO We will use the static image url instead of storing the b64 string
      source = "";
    }
    // setLoadingText("Skipping image generation. Assigning placeholder.");
  } catch (err) {
    const msg = `Failed to generate image:\n${err}`;
    if (isOverLimit || !apiKey) console.error(msg);
    else {
      // toast.error(msg);
      console.error(`${msg}\n${err}`);
    }
    // const img = (await import("../assets/images/placeholder.png")).default;
    // source = await encodeB64(img);
    // @TODO We will use the static image url instead of storing the b64 string
    source = "";
  }

  return source;
};

export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

export const POST = async (req: Request) => {
  const { data, apiKey } = await req.json();

  // Loop thru all items and generate images
  const menu = {
    id: data.id,
    description: data.imageDescription,
  };
  const menuItems = data.items.map((item) => ({
    id: item.id,
    description: item.imageDescription,
  }));
  const newData = { ...data };
  const intervalImages = async () => {
    let index = 0;
    const totalItems = [menu, ...menuItems];
    for (const item of totalItems) {
      // setLoadingText(
      //   `Processing image for item (${index + 1}/${
      //     totalItems.length - 1
      //   }):\n\n${item}`
      // );
      try {
        // Generate image for item
        const descr = item?.description;
        const imageSource = await createEncodedImage(
          descr,
          index,
          totalItems.length,
          apiKey
        );
        // Assign for menu banner image
        if (index === 0) newData.imageSource = imageSource;
        else {
          // Assign for menu items
          const itemIndex = newData.items.findIndex((i) => i.id === item.id);
          newData.items[itemIndex].imageSource = imageSource;
        }
      } catch (err) {
        // toast.error(`Failed to process image:\n${err}`);
      }
      index += 1;

      // Wait between calls
      const isOverLimit = index >= maxGenerations;
      const timeout = isOverLimit || !apiKey ? 100 : 25000; // 25 sec or 100ms if over limit or no expected requests
      await waitForTimeout(timeout);
    }
    return;
  };

  try {
    // fire api calls on a rolling basis (due to request limits)
    await intervalImages();
    return new Response(JSON.stringify({ data: newData }));
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
