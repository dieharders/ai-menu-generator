import { useState } from "react";
import { aiActions, OpenAIModels } from "../actions/aiActions";
import { assignUniqueIds } from "../helpers/transformData";
import { StorageAPI } from "../helpers/storage";
import { languages } from "../helpers/languageCodes";
import styles from "./Generate.module.scss";

const createFileHash = (files = []) => {
  // @TODO Create a hash of the input files or hash of multiple hashes.
  return "";
};

export const DEFAULT_MENU_ID = "DEFAULT_MENU";
export const SAVED_MENU_ID = "SAVED_MENU";

export const GenerateMenuButton = () => {
  const {
    extractMenuDataFromImage,
    convertMenuDataToStructured,
    translateMenuDataToLanguage,
    generateImage,
  } = aiActions();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const getImageInputFiles = () =>
    document.querySelector("input[type=file]")?.files || [];

  const reset = () => {
    setIsDisabled(true);
    const input = document.querySelector("input[type=file]");
    if (input?.value) input.value = "";
    setIsFetching(false);
  };

  const waitForTimeout = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const encodeB64 = async (imageSrc) => {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Compress image and resize to 256p
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 256, 256);

        const dataURL = canvas.toDataURL("image/jpg", 0.7);
        resolve(dataURL);
      };

      img.onerror = () => {
        reject("Failed to load image");
      };

      img.src = imageSrc;
    });
  };

  const generateImages = async (data, numGenerations) => {
    const maxGenerations = 10;
    const isOverLimit = numGenerations >= maxGenerations;
    // Check api key
    const openaiAPIKey = document.querySelector(
      "input[name=input-openai-api-key]"
    )?.value;
    const timeout = isOverLimit || !openaiAPIKey ? 100 : 25000; // 25 sec or 100ms if over limit or no expected requests

    // Return an image as a base64 string
    const createEncodedImage = async (description) => {
      let source = "";
      let img = require("../assets/images/placeholder.png");
      try {
        // Call image generation model
        if (!isOverLimit) {
          img = await generateImage({
            prompt: description,
            model: OpenAIModels.DALL_E_2,
          });
        }
      } catch (err) {
        console.error(err);
      }
      source = await encodeB64(img);

      return source;
    };

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
      for (const item of [menu, ...menuItems]) {
        console.log("@@ processing image for item: ", item);
        try {
          // Generate image for item
          const descr = item?.description;
          const imageSource = await createEncodedImage(descr, index);
          // Assign for menu banner image
          if (index === 0) newData.imageSource = imageSource;
          else {
            // Assign for menu items
            const itemIndex = newData.items.findIndex((i) => i.id === item.id);
            newData.items[itemIndex].imageSource = imageSource;
          }
        } catch (err) {
          console.error(err);
        }
        index += 1;

        // Wait between calls
        await waitForTimeout(timeout);
      }
      return;
    };

    // fire api calls on a rolling basis (due to request limits)
    await intervalImages();

    return newData;
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*"
        onChange={() => setIsDisabled(getImageInputFiles()?.length === 0)}
      ></input>
      {/* Generate button */}
      {!isDisabled && (
        <button
          disabled={isDisabled}
          className={styles.inputButton}
          onClick={async () => {
            try {
              setIsDisabled(true);
              setIsFetching(true);
              const files = getImageInputFiles();
              const hash = createFileHash(files);
              // @TODO Exit if name/hash already exists (if storing in cloud)
              // ...
              const menuDocument = await extractMenuDataFromImage(files);
              console.log("@@ extraction successfull:\n", menuDocument);
              let structuredData = await convertMenuDataToStructured(
                menuDocument
              );
              if (Object.keys(structuredData).length === 0) {
                throw new Error("structuredData failed");
              } else {
                structuredData = assignUniqueIds({
                  data: structuredData,
                  id: DEFAULT_MENU_ID, // mark as the primary document
                  hash,
                });
                console.log("@@ structuredData successfull:\n", structuredData);
                // Generate images
                console.log("@@ generating images...");
                structuredData = await generateImages(structuredData);
                // Create translations
                const timeout = 5000; // 5 seconds
                const translations = [];
                const iterateTranslations = async () => {
                  for (const lang of languages) {
                    console.log("@@ translating: ", lang);
                    // Skip translating the source data
                    if (structuredData.language === lang) continue;
                    // Translate
                    const res = await translateMenuDataToLanguage({
                      data: menuDocument,
                      lang,
                      primary: structuredData,
                    });
                    // Record result
                    translations.push(res);
                    // Wait between calls
                    await waitForTimeout(timeout);
                  }
                  return;
                };
                await iterateTranslations();
                // Store all data locally (text & images)
                const menuId = structuredData?.id;
                structuredData.sourceDocument = menuDocument; // save original text in primary data
                if (!menuId) throw new Error("No id found for menu.");
                const payload = [structuredData, ...translations];
                StorageAPI.setItem(SAVED_MENU_ID, payload);
                console.log("@@ finished!");

                reset();
              }
            } catch (err) {
              console.error("@@ extraction failed:\n", err);
              reset();
            }
          }}
        >
          {isFetching ? "Waiting..." : isDisabled ? "Choose pic" : "Generate"}
        </button>
      )}
    </div>
  );
};
