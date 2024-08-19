import { useContext } from "react";
import { Context } from "../Context";

export const useImagesData = (id = "") => {
  const { storedImages } = useContext(Context);
  // Return banner image if no id passed
  if (!id) return storedImages.find((i) => i.id === "banner");

  const item = storedImages?.find((i) => i.id === id);
  return item;
};
