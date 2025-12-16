import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const memoriesFolder = path.resolve(
  path.join(__dirname, "../snapchat_memories"),
);
