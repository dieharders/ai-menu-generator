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
