import { SAVED_MENU_ID, DEFAULT_MENU_ID } from "../components/Generate";
import { StorageAPI } from "../helpers/storage";

export const getImagesData = (id) => {
  const data = StorageAPI.getItem(SAVED_MENU_ID);
  const menu = data?.find((i) => i.id === DEFAULT_MENU_ID);
  const item = menu?.items?.find((i) => i.id === id);
  return id ? item : menu;
};
