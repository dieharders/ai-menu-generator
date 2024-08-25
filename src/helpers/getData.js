import { useContext } from "react";
import { Context } from "../Context";

const getImageSrc = (imgData) => {
  return imgData?.imageSource?.startsWith("data:image/") ||
    imgData?.imageSource?.startsWith("http")
    ? imgData?.imageSource
    : imgData?.imageSource
    ? `images/${imgData?.imageSource}`
    : "";
};

export const useImagesData = (id = "") => {
  const { storedImages } = useContext(Context);
  let item;
  // Return banner image if no id passed
  if (!id) {
    item = storedImages.find((i) => i.id === "banner");
  } else {
    item = storedImages?.find((i) => i.id === id);
  }
  return { item, src: getImageSrc(item) };
};
