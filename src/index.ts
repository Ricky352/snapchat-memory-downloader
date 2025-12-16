import json from "../memories_history.json" assert { type: "json" };
import type { SnapchatMemory } from "./types";
import { memoriesFolder } from "./paths";
import { makeFolderIfNonExisting } from "./lib/fs";
import { downloadMemories } from "./downloader";

const snapchatImages = json["Saved Media"].filter(
  (memory) => memory["Media Type"] === "Image",
) as SnapchatMemory[];

const snapchatVideos = json["Saved Media"].filter(
  (memory) => memory["Media Type"] === "Video",
) as SnapchatMemory[];

await makeFolderIfNonExisting(memoriesFolder);

console.log(`Output folder: ${memoriesFolder}`);
console.log(
  `Memories loaded: images=${snapchatImages.length}, videos=${snapchatVideos.length}`,
);

await makeFolderIfNonExisting(memoriesFolder);

console.log("Starting images download...");
await downloadMemories(snapchatImages);

console.log("Starting videos download...");
await downloadMemories(snapchatVideos);

console.log("All done.");
