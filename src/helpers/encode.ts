interface I_EncodeParams {
  imageSource: string;
  quality: number; // 0.7 (compression)
  size?: number; // 256
}
export const encodeImage = async ({
  imageSource,
  size,
  quality,
}: I_EncodeParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSource;
    img.onload = () => {
      // Compress image and resize
      const canvas = document.createElement("canvas");
      canvas.width = size || img.width;
      canvas.height = size || img.height;

      const ctx = canvas.getContext("2d");
      ctx && ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/jpeg", quality);
      if (dataURL) resolve(dataURL);
      else reject("Something went wrong loading image.");
    };

    img.onerror = (err) => {
      reject(`Failed to load image: ${err}`);
    };
  });
};
