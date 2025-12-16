import type { SnapchatMemory } from "../types";

export function getFileExtension(memory: SnapchatMemory): string {
  const mediaType = memory["Media Type"]?.toLowerCase?.() ?? "";
  if (mediaType.includes("image")) return ".png";
  if (mediaType.includes("video")) return ".mp4";
  return ".bin";
}
