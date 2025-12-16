# snapchat-memory-downloader

Download your Snapchat Memories from the `memories_history.json` export and save them locally, organized by year, with per-file download progress.

## Features

- Downloads **Images** (`.png`) and **Videos** (`.mp4`)
- Organizes output into `snapchat_memories/<year>/...`
- Filenames are timestamp-based
- Logs failures to `errors.txt` so you can redownload them manually

## Requirements

- **Bun**
- **macOS/Linux** (Windows has filename restrictions; see notes below)
- A Snapchat export file named: `memories_history.json`

## Setup

1. **Get your Snapchat export**
   - Request/download your Snapchat data export from Snapchat: https://accounts.snapchat.com/v2/download-my-data
   - In the export options, make sure you select **Export your Memories**.
   - Also make sure the export format includes **JSON files**.
   - From the exported files, locate the file named **`memories_history.json`**.
2. **Place `memories_history.json` in the project root**
3. **Install dependencies**
   ```bash
   bun install
   ```

## Run

### Normal run

```bash
bun start
```

### Fresh run

Deletes the `snapchat_memories/` directory and the errors.txt file before running.

```bash
bun start:fresh
```

## Output files

- `snapchat_memories/`  
  Your downloaded memories, grouped by year.

- `errors.txt`  
  A log of any items that failed to download (missing fields, network errors, HTTP failures, etc.).
