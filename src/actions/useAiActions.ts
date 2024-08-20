import { useContext } from "react";
import { DEFAULT_MENU_ID } from "../components/Generate";
import { languageCodes } from "../helpers/languageCodes";
import { Context } from "../Context";
import { encodeImage } from "../helpers/encode";
import {
  extractionOutputFormat,
  structuredOutputFormat,
} from "../helpers/formats";
import toast from "react-hot-toast";

/**
 * We use @google/generative-ai package for api calls.
 * gemini-1.5-pro:     2RPM,  50RPD,     Input (Audio, images, videos, and text), Input Tokens (2Million)
 * gemini-1.5-flash:   15RPM, 1,500 RPD, Input (Audio, images, videos, and text), Input Tokens (1Million)
 * text-embedding-004: 1,500 RPM,        Input (Text), Input Tokens (2K), Dimension Size (768)
 */
export const useAiActions = () => {
  const { geminiAPIKeyRef, openaiAPIKeyRef } = useContext(Context);
  // Gen AI
  const getGeminiAPIKey = () => {
    // For testing and demonstration ONLY!
    // const inputComponent = document.querySelector("input[name=input-gemini-api-key]");
    return geminiAPIKeyRef.current || "";
  };
  const getOpenAIAPIKey = () => {
    // For testing and demonstration ONLY!
    // const inputComponent = document.querySelector("input[name=input-openai-api-key]");
    return openaiAPIKeyRef.current || "";
  };
  const extractMenuDataFromImage = async (
    filesUpload: File[],
    signal: AbortSignal
  ) => {
    if (!filesUpload || filesUpload.length === 0)
      throw new Error("Please provide an image.");

    try {
      const readImage = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onloadend = () => {
            resolve(reader.result?.toString() || "");
          };

          reader.onerror = (err) => {
            reject(err);
          };
        });
      /**
       * Converts a File object to a GoogleGenerativeAI.Part object.
       * Takes image types (image/png, image/jpeg, image/webp).
       */
      const encodeFileToGenerative = async (file: File) => {
        // Check file type is image
        if (!file.type.includes("image/")) throw "Please upload an image file.";

        const imageSource = await readImage(file);
        const sizeLimit = 20971520; // 20mb, https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference
        let base64EncodedData = imageSource;
        // Compress since Gemini Pro Vision has max payload
        if (file.size >= sizeLimit) {
          console.warn(`File is over limit (${file.size}), compressing...`);
          base64EncodedData = await encodeImage({
            imageSource,
            quality: 0.65,
          });
        }

        return {
          inlineData: {
            data: base64EncodedData.split(",")[1],
            mimeType: file.type,
          },
        };
      };

      const imageParts = await Promise.all(
        [...filesUpload].map(encodeFileToGenerative)
      );

      const extractMenuPrompt = `These are picture(s) of menu from a restaurant or food store. Write a book report on everything you see in the image, think step by step. Break it down by sections shown in image or create sections if none exist for food, drinks, appetizers, etc. Write each section using shorthand notation in markdown format. Example output:\n\n${extractionOutputFormat}`;
      const result = await fetch(
        `${location.protocol}//${location.host}/api/extractMenuData`,
        {
          method: "POST",
          body: JSON.stringify({
            prompt: extractMenuPrompt,
            images: imageParts,
            apiKey: getGeminiAPIKey(),
          }),
          signal,
        }
      );

      const r = await result?.json();
      if (r?.error) throw new Error(r.message);
      return r.data;
    } catch (err) {
      throw new Error(`${err}`);
    }
  };

  /**
   * Take a plain text document and translate it to another language, return in json format.
   */
  const translateMenuDataToLanguage = async ({
    data,
    lang,
    primary,
    signal,
  }) => {
    if (!data || !lang) return {};
    // Ask to translate doc and return as json
    const language = languageCodes[lang];
    const prompt = `Translate the following text into ${language} language:\n\n${data}\n\nNow convert the translated text into json in this format:\n\n${structuredOutputFormat}`;

    try {
      const result = await fetch(
        `${location.protocol}//${location.host}/api/translateMenu`,
        {
          method: "POST",
          body: JSON.stringify({
            prompt,
            langCode: lang,
            primary,
            apiKey: getGeminiAPIKey(),
          }),
          signal,
        }
      );
      const res = await result.json();
      if (res?.error) throw new Error(res.message);
      return res?.data;
    } catch (err) {
      toast.error(`Failed to translate (${lang}):\n${err}`);
    }
  };

  const structureMenuData = async ({ menuDocument, prompt, signal }) => {
    try {
      const res = await fetch(
        `${location.protocol}//${location.host}/api/structureMenu`,
        {
          method: "POST",
          body: JSON.stringify({
            menuDocument,
            prompt,
            id: DEFAULT_MENU_ID,
            apiKey: getGeminiAPIKey(),
          }),
          signal,
        }
      );
      const result = await res.json();
      if (result?.error) throw new Error(result.message);
      if (result?.data && Object.keys(result.data).length === 0)
        throw new Error("No data returned.");
      return result?.data;
    } catch (err) {
      toast.error(`Failed to structure menu:\n${err}`);
    }
  };

  const requestAnswer = async ({ prompt, info }) => {
    const errMsg =
      "I apologize, something went wrong. I could not answer your question. Please try again.";

    try {
      const fetchResponse = await fetch(
        `${location.protocol}//${location.host}/api/answerQuestion`,
        {
          method: "POST",
          body: JSON.stringify({
            prompt,
            info,
            apiKey: getGeminiAPIKey(),
          }),
        }
      );
      if (!fetchResponse.ok) throw new Error(fetchResponse?.statusText);
      const res = await fetchResponse?.json();
      if (res?.error) throw new Error(res?.message);
      return res?.data;
    } catch (err) {
      toast.error(`Failed to answer question:\n${err}`);
      return errMsg;
    }
  };

  const generateMenuImage = async ({
    name,
    description,
    ingredients,
    category,
  }: {
    name: string;
    description: string;
    ingredients: string;
    category: string;
  }) => {
    try {
      const apiKey = getOpenAIAPIKey();
      if (!apiKey) throw new Error("Please provide an API key.");

      const res = await fetch(
        `${location.protocol}//${location.host}/api/generateImage`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            ingredients,
            category,
            apiKey,
          }),
        }
      );
      const result = await res.json();
      if (result?.error) throw new Error(result.message);
      return result?.data;
    } catch (err) {
      return { error: true, message: `${err}` };
    }
  };

  return {
    extractMenuDataFromImage,
    translateMenuDataToLanguage,
    structureMenuData,
    requestAnswer,
    generateMenuImage,
    getOpenAIAPIKey,
    getGeminiAPIKey,
  };
};
