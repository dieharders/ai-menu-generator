import { useContext } from "react";
import { DEFAULT_MENU_ID } from "../components/Generate";
import { languageCodes } from "../helpers/languageCodes";
import { Context } from "../Context";
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
  const extractMenuDataFromImage = async (filesUpload: File[]) => {
    if (!filesUpload || filesUpload.length === 0)
      throw new Error("Please provide an image.");

    try {
      /**
       * Converts a File object to a GoogleGenerativeAI.Part object.
       * Takes image types (image/png, image/jpeg, image/webp).
       */
      const encodeFileToGenerative = async (file: File) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
          // @TODO We may need to compress/downsize since vercel edge func only handle 5mb payload
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(reader.result?.toString().split(",")[1]);
          reader.readAsDataURL(file);
        });
        return {
          inlineData: {
            data: await base64EncodedDataPromise,
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
        }
      );

      const r = await result?.json();
      if (r?.error) throw new Error(r.message);
      return r.data;
    } catch (err) {
      toast.error(`Failed to extract menu data:\n${err}`);
    }
  };

  /**
   * Take a plain text document and translate it to another language, return in json format.
   */
  const translateMenuDataToLanguage = async ({ data, lang, primary }) => {
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
        }
      );
      const res = await result.json();
      if (res?.error) throw new Error(res.message);
      return res?.data;
    } catch (err) {
      toast.error(`Failed to translate (${lang}):\n${err}`);
    }
  };

  const structureMenuData = async ({ menuDocument, prompt }) => {
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
  }: {
    name: string;
    description: string;
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
