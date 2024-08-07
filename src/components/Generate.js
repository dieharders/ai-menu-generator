import { useState } from "react";
import { aiActions } from "../actions/aiActions";
import { generateShortId } from "../helpers/uniqueId";
import { StorageAPI } from "../helpers/storage";
import styles from "./Generate.module.scss";

const createFileHash = (files = []) => {
  // @TODO Create a hash of the input files. Hash of multiple hashes.
  return "";
};

export const DEFAULT_MENU_ID = "DEFAULT_MENU";

export const GenerateMenuButton = () => {
  const { extractMenuDataFromImage, convertMenuDataToStructured } = aiActions();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const defaultMenuExists = StorageAPI.getItem(DEFAULT_MENU_ID);
  const [isMenuButtonDisabled, setIsMenuButtonDisabled] = useState(
    !defaultMenuExists
  );

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
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 256, 256);

        const dataURL = canvas.toDataURL("image/jpg");
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
    const genImage = async (description) => {
      // @TODO Call image generator model
      // ...
      const img = require("../assets/images/placeholder.png");
      // @TODO Image post-processing here if needed
      // ...
      let source = "";
      try {
        source = await encodeB64(img);
      } catch (err) {
        log.error(err);
      }
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
              const imageSource = await genImage(descr);
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
              log.error(`Failed to generate image:\n${err}`);
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
              // Show a button to page when generation/saving is complete
              setIsMenuButtonDisabled(false);

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
      {/* Show generated menu button */}
      {defaultMenuExists && (
        <button
          disabled={isMenuButtonDisabled || isFetching}
          style={{ height: "2.5rem" }}
          className={styles.inputButton}
          onClick={() => {
            // Go to generated page
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set("id", DEFAULT_MENU_ID);
            const language = "en";
            queryParams.set("lang", language);
            const query = queryParams.toString();
            window.location.href = `${window.location.origin}/?${query}`;
          }}
        >
          View saved menu
        </button>
      )}
    </div>
  );
};
