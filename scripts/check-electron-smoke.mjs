import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { _electron as electron } from "playwright";

const outputDir = resolve("test-results/electron-smoke");
const consoleFailures = [];
const pageFailures = [];

await mkdir(outputDir, { recursive: true });

const app = await electron.launch({
  args: ["electron/main.cjs"],
  env: {
    ...process.env,
    ELECTRON_DISABLE_SECURITY_WARNINGS: "true",
  },
});

try {
  const page = await app.firstWindow();
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleFailures.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageFailures.push(error.message);
  });

  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("#choiceList button", { timeout: 10000 });
  await assertLocalGameUrl(page);
  await assertTitle(page);
  await assertNoHorizontalOverflow(page, "initial profile");
  await page.screenshot({ path: `${outputDir}/initial-profile.png`, fullPage: true });

  await page.getByRole("button", { name: /目指せ合格番長/ }).click();
  await page.waitForFunction(() => document.querySelector(".novel-stage")?.dataset.screen === "intro");
  while ((await getScreen(page)) === "intro") {
    await page.getByRole("button", { name: /次へ|最初の選択へ/ }).click();
  }

  await page.waitForFunction(() => document.querySelector(".novel-stage")?.dataset.screen === "opening");
  await page.getByRole("button", { name: /徹平の赤点を拾う/ }).click();
  await page.getByRole("button", { name: "志望校を決める" }).click();
  await page.getByRole("button", { name: /城北実学大学を候補/ }).click();
  await page.getByRole("button", { name: /城北実学大学で三年間を始める/ }).click();
  await page.waitForFunction(() => document.querySelector(".novel-stage")?.dataset.screen === "targetConfirm");
  await assertNoHorizontalOverflow(page, "target confirm");
  await page.screenshot({ path: `${outputDir}/target-confirm.png`, fullPage: true });

  await page.getByRole("button", { name: "最初の12週へ" }).click();
  await page.waitForFunction(() => document.querySelector(".novel-stage")?.dataset.screen === "choices");
  await page.waitForSelector("#choiceList button");
  await assertNoHorizontalOverflow(page, "first 12 weeks");
  await assertNoRendererFailures();

  console.log(`Electron smoke ok. Screenshots: ${outputDir}`);
} finally {
  await app.close();
}

async function assertLocalGameUrl(page) {
  const url = page.url();
  if (!/^http:\/\/127\.0\.0\.1:\d+\//.test(url)) {
    throw new Error(`Electron did not load the local game server: ${url}`);
  }
}

async function assertTitle(page) {
  const title = await page.title();
  if (title !== "受験番長") {
    throw new Error(`Unexpected Electron page title: ${title}`);
  }
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) {
    throw new Error(`${label}: horizontal overflow ${overflow}px`);
  }
}

async function getScreen(page) {
  return page.locator(".novel-stage").evaluate((element) => element.dataset.screen);
}

async function assertNoRendererFailures() {
  if (pageFailures.length || consoleFailures.length) {
    throw new Error(
      [
        ...pageFailures.map((message) => `pageerror: ${message}`),
        ...consoleFailures.map((message) => `console.error: ${message}`),
      ].join("\n"),
    );
  }
}
