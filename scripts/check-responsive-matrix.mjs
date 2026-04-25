import { mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const outputDir = resolve("test-results/responsive-matrix");
const externalUrl = process.env.TEST_URL;
const viewports = [
  { name: "mobile-portrait", width: 390, height: 844 },
  { name: "small-mobile", width: 360, height: 800 },
  { name: "mobile-landscape", width: 844, height: 390 },
  { name: "desktop", width: 1280, height: 800 },
];
const profiles = [
  { id: "bancho", label: /目指せ合格番長/ },
  { id: "gyaru", label: /目指せ優等生ギャル/ },
];

function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolvePort(address.port));
    });
  });
}

async function waitForUrl(url) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the local server is ready.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 120));
  }
  throw new Error(`Server did not become ready: ${url}`);
}

async function startServer() {
  if (externalUrl) {
    return { url: externalUrl, stop: async () => {} };
  }

  const port = await getFreePort();
  const child = spawn(process.execPath, ["web/server.mjs"], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  const url = `http://127.0.0.1:${port}/`;
  await waitForUrl(url);
  return {
    url,
    stop: async () => {
      child.kill("SIGTERM");
      await new Promise((resolveStop) => child.once("exit", resolveStop));
    },
  };
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) {
    throw new Error(`${label}: horizontal overflow ${overflow}px`);
  }
}

async function assertProfileFitsWithoutScroll(page, label) {
  const overflow = await page.evaluate(() => {
    const dialogue = document.querySelector(".dialogue-box");
    return {
      pageY: document.documentElement.scrollHeight - window.innerHeight,
      dialogueY: dialogue.scrollHeight - dialogue.clientHeight,
    };
  });
  if (overflow.pageY > 1 || overflow.dialogueY > 1) {
    throw new Error(`${label}: profile requires vertical scroll ${JSON.stringify(overflow)}`);
  }
}

async function assertBothProfileSpritesVisible(page, label) {
  const state = await page.evaluate(() => {
    const main = document.querySelector("#characterSprite");
    const compare = document.querySelector("#profileCompareSprite");
    const mainStyle = getComputedStyle(main);
    const compareStyle = getComputedStyle(compare);
    return {
      mainHidden: main.hidden,
      compareHidden: compare.hidden,
      mainDisplay: mainStyle.display,
      compareDisplay: compareStyle.display,
      mainOpacity: Number(mainStyle.opacity),
      compareOpacity: Number(compareStyle.opacity),
    };
  });
  if (state.mainHidden || state.compareHidden || state.mainDisplay === "none" || state.compareDisplay === "none") {
    throw new Error(`${label}: profile sprites are not both visible ${JSON.stringify(state)}`);
  }
}

async function assertCentered(page, label, viewport) {
  const data = await page.locator("#characterSprite").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      center: rect.x + rect.width / 2,
      viewportCenter: window.innerWidth / 2,
      width: rect.width,
      height: rect.height,
      display: style.display,
      opacity: Number(style.opacity),
      screen: document.querySelector(".novel-stage").dataset.screen,
      stageClass: document.querySelector(".novel-stage").className,
    };
  });
  if (data.display === "none") {
    throw new Error(`${label}: centered character is hidden ${JSON.stringify(data)}`);
  }
  if (Math.abs(data.center - data.viewportCenter) > 26) {
    throw new Error(`${label}: character is not centered ${JSON.stringify(data)}`);
  }
  if (viewport.width <= 560 && viewport.height >= 700 && data.width < 230) {
    throw new Error(`${label}: mobile portrait character is too small ${JSON.stringify(data)}`);
  }
  if (viewport.height <= 520 && data.width < 160) {
    throw new Error(`${label}: mobile landscape character is too small ${JSON.stringify(data)}`);
  }
}

async function screenshot(page, name) {
  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: true });
}

async function runCase(browser, baseUrl, viewport, profile) {
  const label = `${viewport.name}-${profile.id}`;
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#choiceList button");
  await assertNoHorizontalOverflow(page, `${label} profile`);
  await assertProfileFitsWithoutScroll(page, `${label} profile`);
  await assertBothProfileSpritesVisible(page, `${label} profile`);
  await screenshot(page, `${label}-profile`);

  await page.getByRole("button", { name: profile.label }).click();
  await page.waitForTimeout(80);
  await assertCentered(page, `${label} intro`, viewport);
  await assertNoHorizontalOverflow(page, `${label} intro`);
  await screenshot(page, `${label}-intro`);

  for (let index = 0; index < 3; index += 1) {
    await page.getByRole("button", { name: "次へ" }).click();
    await assertCentered(page, `${label} intro-${index + 2}`, viewport);
  }

  await page.getByRole("button", { name: "予定を決める" }).click();
  await assertCentered(page, `${label} target`, viewport);
  await assertNoHorizontalOverflow(page, `${label} target`);
  await screenshot(page, `${label}-target`);

  await page.getByRole("button", { name: /城北実学大学/ }).click();
  await assertCentered(page, `${label} choices`, viewport);
  await assertNoHorizontalOverflow(page, `${label} choices`);
  await screenshot(page, `${label}-choices`);
  await page.close();
}

await mkdir(outputDir, { recursive: true });
const server = await startServer();
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    for (const profile of profiles) {
      await runCase(browser, server.url, viewport, profile);
    }
  }
  console.log(`Responsive matrix ok. Screenshots: ${outputDir}`);
} finally {
  await browser.close();
  await server.stop();
}
