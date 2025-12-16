import path from "node:path";
import dayjs from "dayjs";
import { memoriesFolder } from "./paths";
import { formatFileName } from "./lib/naming";
import { getFileExtension } from "./lib/media";
import { makeFolderIfNonExisting, updateFileMetadata } from "./lib/fs";
import { renderFileProgressLine } from "./ui/progress";
import { appendFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import type { SnapchatMemory } from "./types";

export async function downloadMemories(
  memories: SnapchatMemory[],
): Promise<void> {
  const total = memories.length;
  let done = 0;

  for (const memory of memories) {
    const downloadLink = memory["Download Link"];
    const date = memory["Date"];

    if (!downloadLink || !date) {
      await appendFile(
        "errors.txt",
        `\nMissing Download Link or Date: ${JSON.stringify(memory)}\n`,
        {
          encoding: "utf8",
        },
      );
      done += 1;
      continue;
    }

    const ext = getFileExtension(memory);

    try {
      const s3Url = await (
        await fetch(downloadLink, { method: "POST" })
      ).text();

      const yearFolder = path.join(memoriesFolder, String(dayjs(date).year()));
      await makeFolderIfNonExisting(yearFolder);

      const fileName = formatFileName(date) + ext;
      const memoryFilePath = path.join(yearFolder, fileName);

      await downloadMemoryToDisk({
        memoryFilePath,
        memory,
        date,
        s3Url,
        index: done + 1,
        total,
        displayName: fileName,
      });
    } catch (err) {
      await appendFile(
        "errors.txt",
        `\n${String(err)}\n${JSON.stringify(memory)}\n`,
        { encoding: "utf8" },
      );
    } finally {
      done += 1;
    }
  }
}

async function downloadMemoryToDisk(opts: {
  memoryFilePath: string;
  memory: SnapchatMemory;
  date: string;
  s3Url: string;
  index: number;
  total: number;
  displayName: string;
}): Promise<void> {
  const { memoryFilePath, memory, date, s3Url, index, total, displayName } =
    opts;

  try {
    const res = await fetch(s3Url);

    if (!res.ok) {
      throw new Error(`Download failed: ${res.status} ${res.statusText}`);
    }
    if (!res.body) {
      throw new Error("Download failed: empty response body");
    }

    const totalBytesHeader = res.headers.get("content-length");
    const totalBytes = totalBytesHeader ? Number(totalBytesHeader) : undefined;

    const writer = createWriteStream(memoryFilePath);
    const reader = res.body.getReader();

    let downloaded = 0;

    process.stdout.write(
      `\r${renderFileProgressLine({ index, total, fileName: displayName, downloaded, totalBytes })}`,
    );

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;

        downloaded += value.byteLength;

        await new Promise<void>((resolve, reject) => {
          writer.write(Buffer.from(value), (err) =>
            err ? reject(err) : resolve(),
          );
        });

        process.stdout.write(
          `\r${renderFileProgressLine({ index, total, fileName: displayName, downloaded, totalBytes })}`,
        );
      }
    } finally {
      await new Promise<void>((resolve, reject) => {
        writer.end((err: NodeJS.ErrnoException | null) =>
          err ? reject(err) : resolve(),
        );
      });
    }

    process.stdout.write("\n");

    await updateFileMetadata(memoryFilePath, date);
  } catch (error) {
    process.stdout.write("\n");
    console.error(
      `Download failed for ${memoryFilePath}: ${error instanceof Error ? error.message : String(error)}`,
    );

    await appendFile(
      "errors.txt",
      `\n${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n${JSON.stringify(memory)}\n`,
      { encoding: "utf8" },
    );

    throw error;
  }
}
