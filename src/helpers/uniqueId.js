import { customAlphabet } from "nanoid";

export const generateShortId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8
); // 8-character random string
