// @TODO Create a hash of the input files or hash of multiple hashes.
export const createFileHash = (_files = []) => {
  return "";
};

// Use regex to extract text between ```json```
export const extractJsonFromText = (input: string) => {
  const regex = /```json([\s\S]*?)```/;
  const match = input.match(regex);
  return match ? match[1].trim() : null;
};

export const encodeB64 = async (imageSrc: string): Promise<string> => {
  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Compress image and resize to 256p
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;

      const ctx = canvas.getContext("2d");
      ctx && ctx.drawImage(img, 0, 0, 256, 256);

      const dataURL = canvas.toDataURL("image/jpg", 0.7);
      resolve(dataURL);
    };

    img.onerror = () => {
      reject("Failed to load image");
    };

    img.src = imageSrc;
  });
};
