import { aiActions } from "../actions/aiActions";
import { generateShortId } from "../helpers/uniqueId";
import { StorageAPI } from "../helpers/storage";
import styles from "./Generate.module.scss";

export const GenerateMenuButton = () => {
  const { extractMenuDataFromImage, convertMenuDataToStructured } = aiActions();
  /**
   * Loop through all items and assign a unique id
   */
  const assignUniqueIds = (data) => {
    if (!data || Object.keys(data).length === 0)
      throw new Error("No data to assign.");
    const result = { ...data };
    // assign id to menu
    result.menu.id = generateShortId();
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
      <input type="file" accept="image/*"></input>
      <button
        className={styles.inputButton}
        onClick={async () => {
          try {
            const fileInput = document.querySelector("input[type=file]");
            const files = fileInput?.files;
            const extractedData = await extractMenuDataFromImage(files);
            console.log("@@ extraction successfull:\n", extractedData);
            const structuredData = await convertMenuDataToStructured(
              extractedData
            );
            if (Object.keys(structuredData).length === 0)
              throw new Error("structuredData failed");
            else {
              console.log("@@ structuredData successfull:\n", structuredData);
              const result = assignUniqueIds(structuredData);
              // @TODO This is for testing only...
              // "store" data in window obj locally
              const menuId = result?.menu?.id;
              const payload = {
                menu: result?.menu,
                sections: result?.sections,
                translations: result?.translations || [],
              };
              StorageAPI.setItem(menuId, payload);
              // Go to next page with id injected
              if (!menuId) {
                console.error("No id found for menu.");
                return;
              }
              const queryParams = new URLSearchParams(window.location.search);
              queryParams.set("id", menuId);
              const language = "en";
              queryParams.set("lang", language);
              const query = queryParams.toString();
              window.location.href = `${window.location.origin}/?${query}`;
            }
          } catch (err) {
            console.error("@@ extraction failed:\n", err);
          }
        }}
      >
        Generate
      </button>
    </div>
  );
};
