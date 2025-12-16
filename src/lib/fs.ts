import { existsSync } from "node:fs";
import { mkdir, utimes } from "node:fs/promises";
import dayjs from "dayjs";

export async function makeFolderIfNonExisting(
  folderPath: string,
): Promise<void> {
  if (existsSync(folderPath)) return;

  try {
    await mkdir(folderPath, { recursive: true });
  } catch (_err) {
    console.log("Could not make folder", folderPath);
  }
}

/**
 * Sets atime/mtime from the memory date
 */
export async function updateFileMetadata(
  filePath: string,
  date: string,
): Promise<void> {
  const d = dayjs(date);
  if (!d.isValid()) return;

  const t = d.toDate();
  await utimes(filePath, t, t);
}
