import { useState } from "react";
import { aiActions } from "../actions/aiActions";
import { generateShortId } from "../helpers/uniqueId";
import { StorageAPI } from "../helpers/storage";
import styles from "./Generate.module.scss";

const createFileHash = (files = []) => {
  // @TODO Create a hash of the input files. Hash of multiple hashes.
  return "";
};

export const GenerateMenuButton = () => {
  const { extractMenuDataFromImage, convertMenuDataToStructured } = aiActions();
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

  /**
   * Loop through all items and assign a unique id
   */
  const assignUniqueIds = (data, hash = "") => {
    if (!data || Object.keys(data).length === 0)
      throw new Error("No data to assign.");
    const result = { ...data };
    // assign id to menu
    result.menu.id = generateShortId();
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
      <button
        disabled={isDisabled}
        className={styles.inputButton}
        onClick={async () => {
          try {
            setIsDisabled(true);
            setIsFetching(true);
            const files = getImageInputFiles();
            const hash = createFileHash(files);
            // @TODO Determine if we should exit if name/hash already exists
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
              const result = assignUniqueIds(structuredData, hash);
              // Store data locally
              const menuId = result?.menu?.id;
              const payload = {
                menu: result?.menu,
                sections: result?.sections,
                translations: result?.translations || [],
              };
              StorageAPI.setItem(menuId, payload);
              // @TODO For testing only, Go to next page with id injected
              if (!menuId) throw new Error("No id found for menu.");
              const queryParams = new URLSearchParams(window.location.search);
              queryParams.set("id", menuId);
              const language = "en";
              queryParams.set("lang", language);
              const query = queryParams.toString();
              window.location.href = `${window.location.origin}/?${query}`;
              // @TODO Add a button to page when generation/saving is complete
              // ...
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
    </div>
  );
};
