import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key
const getAPIKey = () => {
  const API_KEY = "AIzaSyAvrtSe_-7tNxaD4Rrfe0dnpPoYLU6cKIk"; // @TODO read from .env
  return API_KEY;
};
const API_KEY = getAPIKey();
const genAI = new GoogleGenerativeAI(API_KEY);

// Models
const Models = {
  GEMINI_1_5_FLASH: "gemini-1.5-flash",
  GEMINI_1_5_PRO: "gemini-1.5-pro",
  TEXT_EMBEDDING: "text-embedding-004",
};

// Prompts
const extractMenuPrompt =
  "This is a picture of menu from a restaurant or food store. Write a book report on everything you see in the image, think step by step. Break it down by sections shown in image or create sections if none exist for food, drinks, appetizers, etc. Write each section using shorthand notation in markdown format.";

/**
 * We use @google/generative-ai package for api calls.
 * gemini-1.5-pro:     2RPM,  50RPD,     Input (Audio, images, videos, and text), Input Tokens (2Million)
 * gemini-1.5-flash:   15RPM, 1,500 RPD, Input (Audio, images, videos, and text), Input Tokens (1Million)
 * text-embedding-004: 1,500 RPM,        Input (Text), Input Tokens (2K), Dimension Size (768)
 */
export const aiActions = () => {
  const extractMenuDataFromImage = async (filesUpload) => {
    if (!filesUpload || filesUpload.length === 0)
      throw new Error("Please provide an image.");

    /**
     * Converts a File object to a GoogleGenerativeAI.Part object.
     * Takes image types (image/png, image/jpeg, image/webp)
     */
    const encodeFileToGenerative = async (file) => {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
      });
      return {
        inlineData: {
          data: await base64EncodedDataPromise,
          mimeType: file.type,
        },
      };
    };

    const run = async () => {
      const model = genAI.getGenerativeModel({
        model: Models.GEMINI_1_5_FLASH,
      });

      const imageParts = await Promise.all(
        [...filesUpload].map(encodeFileToGenerative)
      );

      const result = await model.generateContent([
        extractMenuPrompt,
        ...imageParts,
      ]);
      console.log("@@ result:\n", result);
      const response = result?.response;
      const text = response.text();
      console.log(text);
      return text;
    };

    return run();
  };

  return {
    extractMenuDataFromImage,
  };
};
