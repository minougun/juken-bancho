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
const endingStorageKey = "jukenBancho.unlockedEndings.v1";
const eventCgStorageKey = "jukenBancho.unlockedEventCgs.v1";
const studyReviewStorageKey = "jukenBancho.studyReview.v1";
const currentRunStorageKey = "jukenBancho.currentRun.v1";

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

async function assertVisibleArtwork(page, label, expectedPath) {
  await page.waitForFunction(
    (path) => {
      const artwork = document.querySelector("#endingArtwork");
      return artwork && !artwork.hidden && artwork.getAttribute("src")?.includes(path) && artwork.complete && artwork.naturalWidth > 0;
    },
    expectedPath,
  );
  const data = await page.evaluate(() => {
    const artwork = document.querySelector("#endingArtwork");
    const dialogue = document.querySelector(".dialogue-box");
    const artworkRect = artwork.getBoundingClientRect();
    const dialogueRect = dialogue.getBoundingClientRect();
    const overlapX = Math.max(0, Math.min(artworkRect.right, dialogueRect.right) - Math.max(artworkRect.left, dialogueRect.left));
    const overlapY = Math.max(0, Math.min(artworkRect.bottom, dialogueRect.bottom) - Math.max(artworkRect.top, dialogueRect.top));
    return {
      hidden: artwork.hidden,
      src: artwork.getAttribute("src") || "",
      naturalWidth: artwork.naturalWidth,
      width: artworkRect.width,
      height: artworkRect.height,
      overlapArea: overlapX * overlapY,
    };
  });
  if (data.hidden || !data.src.includes(expectedPath) || data.width < 120 || data.height < 80) {
    throw new Error(`${label}: artwork not visible ${JSON.stringify(data)}`);
  }
  if (data.overlapArea > 1) {
    throw new Error(`${label}: artwork is covered by dialogue ${JSON.stringify(data)}`);
  }
}

async function assertBranchResultVisible(page, label) {
  const data = await page.evaluate(() => {
    const dialogue = document.querySelector(".dialogue-box");
    return {
      text: document.querySelector("#dialogueText").textContent,
      scrollTop: dialogue.scrollTop,
      scrollHeight: dialogue.scrollHeight,
      clientHeight: dialogue.clientHeight,
      advanceHidden: document.querySelector("#advanceButton").hidden,
      choiceCount: document.querySelectorAll("#choiceList button").length,
    };
  });
  if (!data.text.includes("選択:") || data.choiceCount !== 0 || data.advanceHidden) {
    throw new Error(`${label}: branch result did not replace choices ${JSON.stringify(data)}`);
  }
  if (data.scrollHeight > data.clientHeight + 1 && data.scrollTop <= 0) {
    throw new Error(`${label}: branch result did not scroll to the appended text ${JSON.stringify(data)}`);
  }
}

async function playToFirstSeasonalEvent(page, label, profile) {
  for (let week = 0; week < 10; week += 1) {
    await page.getByRole("button", { name: /補習/ }).click();
    await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "studyQuiz");
    await assertNoHorizontalOverflow(page, `${label} study quiz ${week + 1}`);
    await page.locator("#choiceList button").first().click();
    if (week === 0) {
      await openTopMenu(page);
      await page.locator("#studyReviewButton").evaluate((element) => {
        element.scrollIntoView({ block: "center", inline: "nearest" });
      });
      await page.locator("#studyReviewButton").click();
      await page.locator("#studyReviewPanel:not([hidden])").waitFor();
      await page.waitForFunction(() => document.querySelectorAll("#studyReviewList .study-review-record").length > 0);
      await assertNoHorizontalOverflow(page, `${label} study review`);
      await screenshot(page, `${label}-study-review`);
      await page.locator("#studyReviewBackButton").click();
    }
    if (week < 9) {
      await page.getByRole("button", { name: "次の週へ" }).click();
    }
  }

  const expectedArtwork = profile.id === "gyaru" ? "events/gyaru/spring-study-room-gyaru.png" : "events/bancho/spring-study-room-bancho.png";
  await assertVisibleArtwork(page, `${label} first seasonal event`, expectedArtwork);
  await assertNoHorizontalOverflow(page, `${label} first seasonal event`);
  await screenshot(page, `${label}-seasonal-event`);

  await page.locator("#choiceList button").first().click();
  await page.waitForFunction(() => document.querySelector("#dialogueText").textContent.includes("選択:"));
  await assertBranchResultVisible(page, `${label} seasonal branch`);
  await assertNoHorizontalOverflow(page, `${label} seasonal branch`);
  await screenshot(page, `${label}-seasonal-branch`);
}

async function assertArtworkViewer(page, label, expectedPath) {
  await page.locator("#artworkViewer:not([hidden])").waitFor();
  const data = await page.locator("#artworkViewerImage").evaluate((element) => ({
    src: element.getAttribute("src") || "",
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height,
  }));
  if (!data.src.includes(expectedPath) || data.width < 180 || data.height < 100) {
    throw new Error(`${label}: artwork viewer did not show expected image ${JSON.stringify(data)}`);
  }
}

async function openTopMenu(page) {
  await page.locator("#menuButton").click();
  await page.locator("#menuPanel:not([hidden])").waitFor();
}

async function runCollectionCase(browser, baseUrl, viewport) {
  const label = `${viewport.name}-collections`;
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.addInitScript(
    ({ endingKey, eventKey, studyKey }) => {
      window.localStorage.setItem(endingKey, JSON.stringify(["passed_bancho"]));
      window.localStorage.setItem(eventKey, JSON.stringify(["spring_study_room:bancho"]));
      window.localStorage.setItem(
        studyKey,
        JSON.stringify([
          {
            id: "math_quadratic",
            attempts: 2,
            correct: 1,
            lastAnswerIndex: 0,
            lastCorrect: true,
            lastAnsweredAt: "2026-04-26T00:00:00.000Z",
          },
        ]),
      );
    },
    { endingKey: endingStorageKey, eventKey: eventCgStorageKey, studyKey: studyReviewStorageKey },
  );
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#choiceList button");

  await openTopMenu(page);
  await page.locator("#endingBookButton").click();
  await page.locator("#endingBookPanel:not([hidden])").waitFor();
  await assertNoHorizontalOverflow(page, `${label} ending book`);
  await screenshot(page, `${label}-ending-book`);
  await page.locator("#endingBookList button").first().click();
  await assertArtworkViewer(page, `${label} ending artwork`, "endings/passed-bancho.png");
  await screenshot(page, `${label}-ending-artwork`);
  await page.locator("#artworkBackButton").click();
  await page.locator("#endingBookBackButton").click();

  await openTopMenu(page);
  await page.locator("#eventGalleryButton").click();
  await page.locator("#eventGalleryPanel:not([hidden])").waitFor();
  await assertNoHorizontalOverflow(page, `${label} event gallery`);
  await screenshot(page, `${label}-event-gallery`);
  await page.locator("#eventGalleryList button").first().click();
  await assertArtworkViewer(page, `${label} event artwork`, "events/bancho/spring-study-room-bancho.png");
  await screenshot(page, `${label}-event-artwork`);
  await page.locator("#artworkBackButton").click();
  await page.locator("#eventGalleryBackButton").click();

  await openTopMenu(page);
  await page.locator("#studyReviewButton").click();
  await page.locator("#studyReviewPanel:not([hidden])").waitFor();
  await page.waitForFunction(() => document.querySelectorAll("#studyReviewList .study-review-record").length > 0);
  await assertNoHorizontalOverflow(page, `${label} seeded study review`);
  await screenshot(page, `${label}-seeded-study-review`);
  await page.close();
}

async function assertNoAudioRequestsWhileBgmOff(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const audioRequests = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (/\.(mp3|ogg)$/i.test(path)) {
      audioRequests.push(request.url());
    }
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#choiceList button");
  await page.getByRole("button", { name: /目指せ合格番長/ }).click();
  await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "intro");
  while ((await page.locator(".novel-stage").evaluate((element) => element.dataset.screen)) === "intro") {
    await page.getByRole("button", { name: /次へ|最初の選択へ/ }).click();
  }
  await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "opening");
  await page.getByRole("button", { name: /鉄平の赤点を拾う/ }).click();
  await page.getByRole("button", { name: "志望校を決める" }).click();
  await page.getByRole("button", { name: /城北実学大学/ }).click();
  await page.waitForTimeout(500);
  await page.close();
  if (audioRequests.length) {
    throw new Error(`BGM OFF loaded audio unexpectedly: ${audioRequests.join(", ")}`);
  }
}

async function assertDialogueVoiceAssignments(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const voiceCalls = [];
    class FakeSpeechSynthesisUtterance {
      constructor(text) {
        this.text = text;
        this.lang = "";
        this.pitch = 1;
        this.rate = 1;
        this.volume = 1;
        this.voice = null;
        this.onend = null;
        this.onerror = null;
      }
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: FakeSpeechSynthesisUtterance });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [
          { name: "Kyoko Japanese Female", lang: "ja-JP" },
          { name: "Otoya Japanese Male", lang: "ja-JP" },
        ],
        speak: (utterance) => {
          voiceCalls.push({
            text: utterance.text,
            pitch: utterance.pitch,
            rate: utterance.rate,
            voice: utterance.voice?.name ?? "",
          });
          window.setTimeout(() => utterance.onend?.(), 0);
        },
        cancel: () => voiceCalls.push({ cancel: true }),
      },
    });
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input?.url ?? "";
      if (url.includes("/voicevox/")) {
        return Promise.reject(new Error("VOICEVOX disabled in responsive voice test"));
      }
      return originalFetch(input, init);
    };
    Object.defineProperty(window, "__jukenVoiceCalls", { value: voiceCalls });
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.JUKEN_BANCHO_AUDIO);
  const assignments = await page.evaluate(() =>
    window.JUKEN_BANCHO_AUDIO
      .buildVoiceLines(
        "受験番長",
        "鉄平「数学9点っす」\n受験番長「逃げる手じゃなく、覚える手にしろ」\n鬼塚先生「説教は3分」\n黒羽レン「中途半端だな」\nミナ「私も大学、目指してみたい」\n優等生ギャル「横あけとく」",
      )
      .map((line) => line.castId),
  );
  for (const castId of ["teppei", "bancho", "teacher", "ren", "mina", "gyaru"]) {
    if (!assignments.includes(castId)) {
      throw new Error(`voice assignment missing ${castId}: ${assignments.join(",")}`);
    }
  }
  const voiceNormalization = await page.evaluate(() => ({
    protagonistCast: window.JUKEN_BANCHO_AUDIO.buildVoiceLines("受験番長", "俺の名は受験番長。144週、逃げずに積む。")[0]?.castId,
    ignoredLabels: window.JUKEN_BANCHO_AUDIO.buildVoiceLines("受験番長", "得たもの: 人望+3\n学力+1").length,
    renText: window.JUKEN_BANCHO_AUDIO.buildVoiceLines("黒羽レン", "黒羽レン「黒羽レンは国立天嶺大学でBGMとVOICEVOXまで盛る気か」")[0]?.text ?? "",
    renShortText: window.JUKEN_BANCHO_AUDIO.buildVoiceLines("黒羽レン", "黒羽レン「点数は、見栄を助けない」")[0]?.text ?? "",
    renFallbackGender: window.JUKEN_BANCHO_AUDIO.voiceCast.ren.fallback.gender,
    renSpeakerPreferences: window.JUKEN_BANCHO_AUDIO.voiceCast.ren.speakerPreferences,
  }));
  if (voiceNormalization.protagonistCast !== "bancho") {
    throw new Error(`intro monologue must use protagonist cast: ${JSON.stringify(voiceNormalization)}`);
  }
  if (voiceNormalization.ignoredLabels !== 0) {
    throw new Error(`voice labels/status should not be read: ${JSON.stringify(voiceNormalization)}`);
  }
  if (!voiceNormalization.renText.includes("くろば レン") || !voiceNormalization.renText.includes("てんれい") || !voiceNormalization.renText.includes("ボイスボックス")) {
    throw new Error(`voice pronunciation normalization missing: ${JSON.stringify(voiceNormalization)}`);
  }
  if (voiceNormalization.renShortText.length > 20 || !voiceNormalization.renShortText.includes("点数は")) {
    throw new Error(`ren voice line should stay short: ${JSON.stringify(voiceNormalization)}`);
  }
  if (voiceNormalization.renFallbackGender !== "female" || voiceNormalization.renSpeakerPreferences.some((name) => /玄野|青山/.test(name))) {
    throw new Error(`ren voice should not use the male villain cast: ${JSON.stringify(voiceNormalization)}`);
  }

  await page.getByRole("button", { name: /目指せ合格番長/ }).click();
  await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "intro");
  await openTopMenu(page);
  await page.locator("#voiceButton").click();
  await page.waitForFunction(() => window.__jukenVoiceCalls.some((call) => call.text?.includes("俺の名は")));
  await page.waitForFunction(() => document.querySelector("#voiceButton").textContent.includes("動作確認用"));
  const cancelCountBeforeMenu = await page.evaluate(() => window.__jukenVoiceCalls.filter((call) => call.cancel).length);
  await page.getByRole("button", { name: "メニュー" }).click();
  await page.waitForFunction((count) => window.__jukenVoiceCalls.filter((call) => call.cancel).length > count, cancelCountBeforeMenu);
  while ((await page.locator(".novel-stage").evaluate((element) => element.dataset.screen)) === "intro") {
    await page.getByRole("button", { name: /次へ|最初の選択へ/ }).click();
  }
  await page.waitForFunction(() => window.__jukenVoiceCalls.some((call) => call.text?.includes("数学9点")));
  const calls = await page.evaluate(() => window.__jukenVoiceCalls.filter((call) => call.text));
  if (!calls.some((call) => call.text.includes("俺の名は") && call.voice.includes("Otoya"))) {
    throw new Error(`bancho fallback voice was not assigned to male voice: ${JSON.stringify(calls)}`);
  }
  if (!calls.some((call) => call.text.includes("数学9点") && call.pitch > 1)) {
    throw new Error(`teppei fallback profile was not applied: ${JSON.stringify(calls)}`);
  }
  await page.close();
}

async function assertCorruptCurrentRunFallsBack(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await page.addInitScript(
    ({ currentKey }) => {
      window.localStorage.setItem(
        currentKey,
        JSON.stringify({
          version: 1,
          savedAt: "2026-05-14T00:00:00.000Z",
          turn: 0,
          totalTurns: 144,
          stats: {},
          usedCardIds: [],
          log: [],
          complete: false,
          screen: "openingResult",
          introIndex: 0,
          openingChoiceId: "help_teppei",
          pendingResult: null,
          pendingStudyQuiz: null,
          studyQuizStreak: 0,
          profileId: "bancho",
          targetSchoolId: null,
          characterCentered: true,
        }),
      );
    },
    { currentKey: currentRunStorageKey },
  );
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /続きから/ }).click();
  await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "target");
  await assertNoHorizontalOverflow(page, "corrupt current run fallback");
  await page.close();
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
  await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "intro");
  await assertCentered(page, `${label} intro`, viewport);
  await assertNoHorizontalOverflow(page, `${label} intro`);
  await screenshot(page, `${label}-intro`);

  while ((await page.locator(".novel-stage").evaluate((element) => element.dataset.screen)) === "intro") {
    await page.getByRole("button", { name: /次へ|最初の選択へ/ }).click();
  }
  await page.waitForFunction(() => document.querySelector(".novel-stage").dataset.screen === "opening");
  await assertCentered(page, `${label} opening`, viewport);
  await assertNoHorizontalOverflow(page, `${label} opening`);
  await screenshot(page, `${label}-opening`);

  const firstOpeningChoice = profile.id === "gyaru" ? /ミナの通知に返す/ : /鉄平の赤点を拾う/;
  await page.getByRole("button", { name: firstOpeningChoice }).click();
  await assertCentered(page, `${label} opening-result`, viewport);
  await assertNoHorizontalOverflow(page, `${label} opening-result`);
  await screenshot(page, `${label}-opening-result`);

  await page.getByRole("button", { name: "志望校を決める" }).click();
  await assertCentered(page, `${label} target`, viewport);
  await assertNoHorizontalOverflow(page, `${label} target`);
  await screenshot(page, `${label}-target`);

  await page.getByRole("button", { name: /城北実学大学/ }).click();
  await assertCentered(page, `${label} choices`, viewport);
  await assertNoHorizontalOverflow(page, `${label} choices`);
  await screenshot(page, `${label}-choices`);
  await playToFirstSeasonalEvent(page, label, profile);
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
    await runCollectionCase(browser, server.url, viewport);
  }
  await assertNoAudioRequestsWhileBgmOff(browser, server.url);
  await assertDialogueVoiceAssignments(browser, server.url);
  await assertCorruptCurrentRunFallsBack(browser, server.url);
  console.log(`Responsive matrix ok. Screenshots: ${outputDir}`);
} finally {
  await browser.close();
  await server.stop();
}
