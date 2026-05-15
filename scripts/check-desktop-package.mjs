import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve("dist/desktop/win-unpacked");
const requiredFiles = [
  "受験番長.exe",
  "resources/app/electron/main.cjs",
  "resources/app/web/index.html",
  "resources/app/web/app.js",
  "resources/app/web/styles.css",
  "resources/app/web/server.mjs",
  "resources/app/web/data/game-data.js",
];

for (const relativePath of requiredFiles) {
  const filePath = join(root, relativePath);
  if (!existsSync(filePath)) {
    throw new Error(`Missing desktop package file: ${filePath}`);
  }
}

const appJs = readFileSync(join(root, "resources/app/web/app.js"), "utf8");
const forbiddenPatterns = [
  { label: "old Teppei spelling", pattern: new RegExp("\\u9244\\u5e73") },
  { label: "stale progress milestone voice helper", pattern: /buildProgressMilestoneVoiceText/ },
  { label: "stale chapter relationship helper", pattern: /getChapterRelationshipReport/ },
];

for (const { label, pattern } of forbiddenPatterns) {
  if (pattern.test(appJs)) {
    throw new Error(`Desktop package still includes ${label}`);
  }
}

const assetFiles = await listFiles(join(root, "resources/app/web/assets"));
if (assetFiles.length < 30) {
  throw new Error(`Desktop package asset count is unexpectedly low: ${assetFiles.length}`);
}

console.log(`Desktop package ok: ${requiredFiles.length} required files, ${assetFiles.length} assets.`);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const childPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(childPath));
    } else if (entry.isFile()) {
      files.push(childPath);
    }
  }
  return files;
}
