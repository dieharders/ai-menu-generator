import { GoogleGenerativeAI } from "@google/generative-ai";

// Use regex to extract text between ```json```
const extractJsonFromText = (input) => {
  const regex = /```json([\s\S]*?)```/;
  const match = input.match(regex);
  return match ? match[1].trim() : null;
};

// Gen AI
let genAI;
const getAPIKey = () => {
  // For testing and demonstration ONLY!
  const inputComponent = document.querySelector("input[name=input-api-key]");
  const API_KEY = inputComponent.value;
  return API_KEY;
};
const getGenAI = () => {
  if (!genAI) genAI = new GoogleGenerativeAI(getAPIKey());
  return genAI;
};

// Models
const Models = {
  GEMINI_1_0_PRO: "gemini-1.0-pro", // text only, cheapest, use for translations
  GEMINI_1_5_FLASH: "gemini-1.5-flash",
  GEMINI_1_5_PRO: "gemini-1.5-pro",
  TEXT_EMBEDDING: "text-embedding-004",
  AQA: "aqa", // Providing source-grounded answers to questions (RAG?)
};

// Formats
const extractionOutputFormat = `
# Company Name

(if none exists generate one)

## Company Description

(if none exists generate one)

## Food Type

(american, japanese, greek)

## Contact Info

(if none exists, leave out)

## Location Info

(if none exists, leave out)

## Theme Color

(an integer between 0 and 255 that best represents the hue color value of this menu)

## Company Website

(if none exists, leave out)

## Language

(ISO 639-1 format: en, de, ko)

## Banner Image Description

(generate a description of this menu's banner image based on color, language, location, food type, company name, company description)

# Section

(section name)

## Item

(item name)

### Description

(if none exists generate one based on item name)

### Price

(number)

### Currency

(USD, YEN, EUR)

### Category

(protein, grain, vegetable, fruit, dairy, food, alcohol beverage, non-alcohol beverage, other)

### Ingredients

(if none exists generate one based on description, price, item name, section name)

### Image Description

(if none exists generate one based on description, ingredients, price, item name, section name)

### Health Info

(if none exists generate one)

### Allergy Info

(if none exists generate one)
`;
const structuredOutputFormat = `
{
  "menu": {
    "name": "",
    "id": "", // leave blank
    "description": "",
    "type": "",
    "contact": "",
    "location": "",
    "color": 0,
    "website": "",
    "language": "",
    "bannerImageDescription": "",
    "bannerImageId": "", // leave blank
    "bannerImageSource": "", // leave blank
    "sourceHash": "", // leave blank
  },
  "sections": [
    {
      "name": "",
      "id": "", // leave blank
      "items": [
        {
          "name": "",
          "id": "", // leave blank
          "description": "",
          "price": "0.00",
          "currency": "",
          "category": "",
          "ingredients": "",
          "imageDescription": "",
          "imageId": "", // leave blank
          "imageSource": "", // leave blank
          "health": "",
          "allergy": ""
        }
      ]
    }
  ]
}
`;

// Prompts
const extractMenuPrompt = `These are picture(s) of menu from a restaurant or food store. Write a book report on everything you see in the image, think step by step. Break it down by sections shown in image or create sections if none exist for food, drinks, appetizers, etc. Write each section using shorthand notation in markdown format. Example output:\n\n${extractionOutputFormat}`;

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
      const model = getGenAI()?.getGenerativeModel({
        model: Models.GEMINI_1_5_FLASH,
      });

      const imageParts = await Promise.all(
        [...filesUpload].map(encodeFileToGenerative)
      );

      const result = await model.generateContent([
        extractMenuPrompt,
        ...imageParts,
      ]);
      const response = result?.response;
      const text = response.text();
      return text;
    };

    return run();
  };

  const convertMenuDataToStructured = async (unstructuredData) => {
    if (!unstructuredData) throw new Error("Please provide data to process.");

    const structuredMenuPrompt = `Convert this markdown text to json format: ${unstructuredData}\n\nExample output:\n\n${structuredOutputFormat}\n\nResponse:`;

    const model = getGenAI()?.getGenerativeModel({
      model: Models.GEMINI_1_5_FLASH,
    });

    const result = await model.generateContent([
      structuredMenuPrompt,
      unstructuredData,
    ]);
    const response = result?.response;
    const text = response.text();
    // Convert result to js object
    const structText = extractJsonFromText(text);
    if (!structText) throw new Error("Failed to extract json from response.");
    try {
      const obj = JSON.parse(structText);
      return obj;
    } catch (err) {
      console.error(`Failed to parse structured response.\n${err}`);
      return {};
    }
  };

  return {
    extractMenuDataFromImage,
    convertMenuDataToStructured,
  };
};
