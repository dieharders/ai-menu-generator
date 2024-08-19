import { useContext } from "react";
import { useAiActions } from "./useAiActions";
import { Context } from "../Context";
import { requestImageSearch } from "./tools";
import { DEFAULT_MENU_ID, SAVED_MENU_ID } from "../components/Generate";
import { StorageAPI } from "../helpers/storage";

export const useAppActions = () => {
  const { generateMenuImage } = useAiActions();
  const { setMenuData } = useContext(Context);

  // Make a single google image search request
  const onGoogleImageRequest = async (item: any) => {
    const imgUrl = await requestImageSearch({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
    });
    // Check error
    if (!imgUrl) return { error: true, message: "No image(s) returned." };
    // Return img source string
    return imgUrl;
  };

  // Make a single Ai image generation request
  const onGenImageRequest = async (item: any) => {
    let data = "";
    const res = await generateMenuImage({
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
      category: item.category,
    });
    data = res?.imageSource;
    // Check error msg
    if (res?.error) return res;
    // Return img source string
    return data;
  };

  // Image Action
  interface itemProps {
    id: string;
    name: string;
    description: string;
    ingredients: string;
    category: string;
  }
  const imageAction = async (item: itemProps) => {
    let data: string | { error: boolean; message: string };

    try {
      if (window.location.hostname.includes("localhost"))
        data = await onGenImageRequest(item);
      else data = await onGoogleImageRequest(item);

      // Check response ok
      if (typeof data === "object" && data?.error) return data;
      // Save source to localStorage
      const menuStorage = StorageAPI.getItem(SAVED_MENU_ID) || "";
      const menu = JSON.parse(menuStorage);
      const primary = menu?.find((i: any) => i.id === DEFAULT_MENU_ID);
      const items = primary?.items;
      const newItem =
        item.id === "banner"
          ? primary
          : items.find((i: any) => i.id === item.id);
      if (!data && typeof data !== "string")
        throw new Error("Could not save image. No data returned to persist.");
      if (!newItem || !menu)
        throw new Error("Could not save image. Something went wrong.");
      // Save new menu data to disk
      newItem.imageSource = data;
      StorageAPI.setItem(SAVED_MENU_ID, JSON.stringify(menu));
      // Update menu data
      setMenuData(primary);
    } catch (err) {
      console.error(`${err}`);
    }
  };

  return {
    onGoogleImageRequest,
    onGenImageRequest,
    imageAction,
  };
};
