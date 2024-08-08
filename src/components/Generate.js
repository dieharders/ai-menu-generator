import { useState } from "react";
import { aiActions, OpenAIModels } from "../actions/aiActions";
import { generateShortId } from "../helpers/uniqueId";
import { StorageAPI } from "../helpers/storage";
import styles from "./Generate.module.scss";

const createFileHash = (files = []) => {
  // @TODO Create a hash of the input files. Hash of multiple hashes.
  return "";
};

export const DEFAULT_MENU_ID = "DEFAULT_MENU";

export const GenerateMenuButton = () => {
  const {
    extractMenuDataFromImage,
    convertMenuDataToStructured,
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

  const generateImages = async (data) => {
    const timeout = 25000; // 25 sec
    let numGenerations = 0;
    const maxGenerations = 10;
    const createEncodedImage = async (description) => {
      let source = "";
      let img = require("../assets/images/placeholder.png");
      try {
        // Call image generation model
        if (numGenerations < maxGenerations) {
          img = await generateImage({
            prompt: description,
            model: OpenAIModels.DALL_E_2,
          });
        }
      } catch (err) {
        console.error(err);
      }
      source = await encodeB64(img);
      numGenerations += 1;

      return source;
    };
    const newData = { ...data };
    const menu = {
      id: newData.menu.id,
      description: newData.menu.bannerImageDescription,
    };
    const sectionItems = newData.sections.map((section) =>
      section.items.map((item) => ({
        id: item.id,
        description: item.imageDescription,
        sectionId: section.id,
      }))
    );
    const items = [menu, ...sectionItems.flat()];

    const intervalPromise = () => {
      return new Promise((resolve, reject) => {
        let counter = 0;

        // Loop thru all items and generate images
        const startInterval = () => {
          const intervalId = setInterval(async () => {
            try {
              // Generate image for item
              const currItem = items[counter];
              const descr = currItem?.description;
              const imageSource = await createEncodedImage(descr);
              // Store images in data, counter 0 should always the banner
              if (counter === 0) newData.menu.bannerImageSource = imageSource;
              else {
                const sectionIndex = newData.sections.findIndex(
                  (section) => section.id === currItem?.sectionId
                );
                const itemIndex = newData.sections[
                  sectionIndex
                ]?.items?.findIndex((i) => i.id === currItem?.id);
                newData.sections[sectionIndex].items[itemIndex].imageSource =
                  imageSource;
              }
            } catch (err) {
              console.error(`Failed to generate image:\n${err}`);
              clearInterval(intervalId);
              resolve("stopped");
            }
            // Set timer
            counter += 1;
            if (counter >= items.length) {
              clearInterval(intervalId);
              resolve("stopped");
            }
          }, timeout);
        };

        startInterval();
      });
    };
    // fire api calls on a rolling basis (due to request limits)
    await intervalPromise();

    return newData;
  };

  /**
   * Loop through all items and assign a unique id
   */
  const assignUniqueIds = ({ data, id, hash = "" }) => {
    if (!data || Object.keys(data).length === 0)
      throw new Error("No data to assign.");
    const result = { ...data };
    // assign id to menu
    result.menu.id = id || generateShortId();
    // record unique hash of source file
    result.menu.sourceHash = hash;
    // assign id to each item and section
    const sections = result?.sections?.map((section) => {
      const sectionResult = { ...section, id: generateShortId() };
      const sectionItems = sectionResult?.items?.map((item) => {
        const itemResult = { ...item, id: generateShortId() };
        return itemResult;
      });
      sectionResult.items = sectionItems;
      return sectionResult;
    });
    result.sections = sections;

    return result;
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
              const extractedData = await extractMenuDataFromImage(files);
              console.log("@@ extraction successfull:\n", extractedData);
              const structuredData = await convertMenuDataToStructured(
                extractedData
              );
              if (Object.keys(structuredData).length === 0) {
                throw new Error("structuredData failed");
              } else {
                console.log("@@ structuredData successfull:\n", structuredData);
                let result = assignUniqueIds({
                  data: structuredData,
                  id: DEFAULT_MENU_ID, // always overwrite same id if storing locally
                  hash,
                });
                // Generate images
                result = await generateImages(result);
                // @TODO Create translations
                // ...
                // Store all data locally (text & images)
                const menuId = result?.menu?.id;
                const payload = {
                  menu: result?.menu,
                  sections: result?.sections,
                  translations: result?.translations || [],
                };
                StorageAPI.setItem(menuId, payload);

                if (!menuId) throw new Error("No id found for menu.");

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
