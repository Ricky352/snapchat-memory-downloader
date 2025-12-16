import dayjs from "dayjs";

/**
 * "2025-12-31 13:27:19" -> "2025-12-31_13-27-19"
 */
export function formatFileName(date: string): string {
  const trimmed = date.trim().replace(" UTC", "");

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.replace(" ", "_").replaceAll(":", "-");
  }

  const d = dayjs(trimmed);
  if (d.isValid()) return d.format("YYYY-MM-DD_HH-mm-ss");

  return trimmed.replace(/[^\w:.-]+/g, "_").replaceAll(":", "-");
}
