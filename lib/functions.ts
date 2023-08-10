import { AES, enc } from "crypto-js";

export function decrypt(string: string, key: string) {
  const decrypted = AES.decrypt(string, key).toString(enc.Utf8);
  return decrypted as string;
}
