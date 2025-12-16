export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  const fixed = i === 0 ? 0 : 1;
  return `${n.toFixed(fixed)} ${units[i]}`;
}

export function renderFileProgressLine(opts: {
  index: number;
  total: number;
  fileName: string;
  downloaded: number;
  totalBytes?: number;
}): string {
  const { index, total, fileName, downloaded, totalBytes } = opts;

  const prefix = `${index}/${total} ${fileName}`;

  if (totalBytes && totalBytes > 0) {
    const pct = Math.floor((downloaded / totalBytes) * 100);
    const barWidth = 20;
    const filled = Math.max(
      0,
      Math.min(barWidth, Math.round((downloaded / totalBytes) * barWidth)),
    );
    const bar = `${"█".repeat(filled)}${"░".repeat(barWidth - filled)}`;
    return `${prefix}  [${bar}] ${String(pct).padStart(3, " ")}%  ${formatBytes(downloaded)}/${formatBytes(
      totalBytes,
    )}`;
  }

  return `${prefix}  ${formatBytes(downloaded)} downloaded`;
}
