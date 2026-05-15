import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(".");
const requiredFiles = [
  "electron/main.cjs",
  "web/server.mjs",
  "steam/app_build_steam.template.vdf",
  "steam/depot_build_windows.template.vdf",
  "docs/steam-release.md",
  "docs/steam-implementation.md",
  "docs/steam-store-page-draft.md",
  "docs/steam-store-page-fact-check.md",
  "docs/steam-local-release-checklist.md",
  "docs/steam-feature-scope.md",
  "docs/steamworks-upload-runbook.md",
  "docs/third-party-notices.md",
  "scripts/check-desktop-package.mjs",
  "scripts/check-electron-smoke.mjs",
  "dist/desktop/win-unpacked/受験番長.exe",
  "dist/desktop/win-unpacked/resources/app/web/index.html",
  "dist/desktop/win-unpacked/resources/app/web/app.js",
  "dist/desktop/win-unpacked/resources/app/electron/main.cjs",
  "dist/desktop/linux-unpacked/juken-bancho",
  "test-results/electron-smoke/initial-profile.png",
  "test-results/electron-smoke/target-confirm.png",
];

for (const relativePath of requiredFiles) {
  assertFile(relativePath);
}

const packageJson = JSON.parse(readFile("package.json"));
for (const scriptName of ["desktop:pack", "steam:stage", "test:desktop-package", "test:desktop-smoke", "steam:local-check"]) {
  if (!packageJson.scripts?.[scriptName]) {
    throw new Error(`Missing package script: ${scriptName}`);
  }
}

assertIncludes("steam/app_build_steam.template.vdf", "YOUR_STEAM_APP_ID");
assertIncludes("steam/depot_build_windows.template.vdf", "YOUR_WINDOWS_DEPOT_ID");
assertIncludes("steam/depot_build_windows.template.vdf", "../dist/desktop/win-unpacked");
assertIncludes("docs/third-party-notices.md", "VOICEVOX");
assertIncludes("docs/third-party-notices.md", "CC0");
assertIncludes("docs/steam-store-page-draft.md", "920 x 430");
assertIncludes("docs/steam-store-page-draft.md", "1920 x 1080");
assertIncludes("docs/steam-store-page-fact-check.md", "公開・Steamworks入力前の下書きとしては使用可能");
assertIncludes("docs/steam-feature-scope.md", "初回Steam提出では、Steam API連携を必須化しない");
assertIncludes("docs/steamworks-upload-runbook.md", "検証branch");

console.log(`Steam local readiness ok: ${requiredFiles.length} files, ${Object.keys(packageJson.scripts).length} scripts.`);

function assertFile(relativePath) {
  const filePath = join(root, relativePath);
  if (!existsSync(filePath)) {
    throw new Error(`Missing required Steam readiness file: ${filePath}`);
  }
}

function assertIncludes(relativePath, expectedText) {
  const content = readFile(relativePath);
  if (!content.includes(expectedText)) {
    throw new Error(`Expected ${relativePath} to include: ${expectedText}`);
  }
}

function readFile(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}
