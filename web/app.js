import {
  CURRENT_RUN_STORAGE_KEY,
  ENDING_STORAGE_KEY,
  EVENT_CG_STORAGE_KEY,
  GAMEPLAY_BGM_SRC,
  PROFILE_SELECT_ANIMATION_MS,
  STUDY_REVIEW_STORAGE_KEY,
  TOTAL_TURNS,
  academicMilestones,
  cards,
  endingCatalog,
  events,
  getStudyQuestionById,
  getStudyQuestionFromPool,
  getStudyQuestionPoolSize,
  isStudyQuestionId,
  protagonistProfiles,
  seasonalEvents,
  statLabels,
  studyQuizTotalQuestionCount,
  studyQuizQuestions,
  targetExamQuestions,
  targetSchools,
  termBgm,
} from "./data/game-data.js";

const schoolCalendar = createSchoolCalendar();
const EFFECT_VARIANCE = 1;
const VOICE_STORAGE_KEY = "jukenBancho.voiceEnabled.v1";
const VOICEVOX_PROXY_PATH = "/voicevox";
const VOICEVOX_DIRECT_URLS = navigator.webdriver ? [] : ["http://127.0.0.1:50021", "http://localhost:50021"];
const VOICE_ACTING_VERSION = "2026-05-14-juken-bancho-cast-3";
const VOICE_START_DELAY_MS = 220;
const statHelpText = {
  face: "メンツ: 怖さではなく、約束を守る信用",
  looks: "ルックス: 顔立ち、清潔感、表情、声、疲れが外に出た対人コンディション",
};
const voiceCast = {
  narrator: {
    speakerPreferences: ["九州そら"],
    defaults: { speed: 0.98, pitch: -0.02, intonation: 1.02, volume: 0.82, pre: 0.12, post: 0.14, maxRate: 1.04 },
    fallback: { pitch: 0.92, rate: 0.98, volume: 0.78, gender: "female" },
    pausePolicy: { intra: 90, final: 170 },
  },
  bancho: {
    speakerPreferences: ["雀松朱司"],
    strictSpeakerPreference: true,
    defaults: { speed: 0.95, pitch: -0.03, intonation: 0.98, volume: 0.93, pre: 0.13, post: 0.17, maxRate: 0.99 },
    fallback: { pitch: 0.9, rate: 0.95, volume: 0.93, gender: "male" },
    pausePolicy: { intra: 110, final: 210 },
  },
  gyaru: {
    speakerPreferences: ["春日部つむぎ", "四国めたん", "満別花丸"],
    strictSpeakerPreference: true,
    defaults: { speed: 1.08, pitch: 0.045, intonation: 1.28, volume: 0.91, pre: 0.07, post: 0.12, maxRate: 1.12 },
    fallback: { pitch: 1.12, rate: 1.08, volume: 0.91, gender: "female" },
    pausePolicy: { intra: 80, final: 160 },
  },
  teppei: {
    speakerPreferences: ["白上虎太郎", "ずんだもん"],
    defaults: { speed: 1.12, pitch: 0.045, intonation: 1.34, volume: 0.9, pre: 0.06, post: 0.1, maxRate: 1.16 },
    fallback: { pitch: 1.08, rate: 1.12, volume: 0.88, gender: "male" },
    pausePolicy: { intra: 70, final: 150 },
  },
  mina: {
    speakerPreferences: ["雨晴はう", "春日部つむぎ", "四国めたん"],
    defaults: { speed: 0.96, pitch: 0.02, intonation: 1.06, volume: 0.84, pre: 0.14, post: 0.18, maxRate: 1.02 },
    fallback: { pitch: 1.03, rate: 0.96, volume: 0.84, gender: "female" },
    pausePolicy: { intra: 120, final: 230 },
  },
  teacher: {
    speakerPreferences: ["青山龍星", "玄野武宏"],
    defaults: { speed: 0.9, pitch: -0.04, intonation: 0.92, volume: 0.95, pre: 0.16, post: 0.2, maxRate: 0.94 },
    fallback: { pitch: 0.82, rate: 0.88, volume: 0.95, gender: "male" },
    pausePolicy: { intra: 130, final: 240 },
  },
  ren: {
    speakerPreferences: ["冥鳴ひまり", "四国めたん", "九州そら"],
    strictSpeakerPreference: true,
    defaults: { speed: 0.95, pitch: -0.015, intonation: 0.96, volume: 0.88, pre: 0.12, post: 0.16, maxRate: 0.99 },
    fallback: { pitch: 0.96, rate: 0.94, volume: 0.88, gender: "female" },
    pausePolicy: { intra: 110, final: 210 },
  },
};
const voicePronunciationLexicon = [
  ["VOICEVOX", "ボイスボックス"],
  ["VOICE", "ボイス"],
  ["BGM", "ビージーエム"],
  ["LINE", "ライン"],
  ["黒羽レン", "くろば レン"],
  ["国立天嶺大学", "こくりつ てんれい だいがく"],
  ["天嶺大学", "てんれい だいがく"],
  ["天嶺", "てんれい"],
  ["受験番長", "じゅけんばんちょう"],
  ["鬼塚先生", "おにづか先生"],
  ["進路希望票", "しんろ きぼうひょう"],
  ["赤本", "あかほん"],
  ["五科目", "ごかもく"],
  ["三者面談", "さんしゃ めんだん"],
  ["メンツ", "めんつ"],
  ["ルックス", "るっくす"],
  ["3連続", "さんれんぞく"],
  ["144週", "ひゃくよんじゅうよんしゅう"],
];
const speakerCastAliases = [
  { pattern: /受験番長|番田長生/, castId: "bancho" },
  { pattern: /優等生ギャル|優谷生/, castId: "gyaru" },
  { pattern: /徹平|舎弟/, castId: "teppei" },
  { pattern: /ミナ|友だち/, castId: "mina" },
  { pattern: /鬼塚|先生|生活指導|進路指導|模試監督|校長/, castId: "teacher" },
  { pattern: /黒羽レン|ライバル/, castId: "ren" },
];
const openingIncidentChoices = {
  bancho: [
    {
      id: "help_teppei",
      title: "徹平の赤点を拾う",
      subtitle: "舎弟を見捨てず、補習の机へ連れていく",
      text:
        "徹平「番長、数学9点っす。進路希望票、親に見せたら終わるっす」\n受験番長は願書の下書きを畳み、徹平の答案を机に広げた。\n自分の計画は少し遅れた。だが、見捨てない背中は教室に残った。",
      voiceText: "徹平「番長、数学9点っす。進路希望票、親に見せたら終わるっす」",
      gained: "徹平は救えた。逃げ癖のある舎弟が、初めて答案を自分の手で直し始めた。",
      lost: "ただし、願書の下書きは白紙のまま残った。最初の勉強時間は削れた。",
      effects: { academics: 1, trust: 4, face: 2, looks: 0, stamina: -3, stress: 1 },
      speaker: "徹平",
    },
    {
      id: "face_ren",
      title: "黒羽レンの模試勝負を受ける",
      subtitle: "挑発を点数で返す",
      text:
        "黒羽レン「その願書、名前だけ書いて記念にするのか。舎弟も志望校も、まとめて中途半端だな」\n受験番長は笑わず、模試の申込書にペンを走らせた。\n徹平の通知は未読のまま光っている。だが、逃げない姿勢は校門前に伝わった。",
      voiceText: "黒羽レン「点数は、見栄を助けない」",
      gained: "黒羽レンの名前を、倒したい相手として覚えた。校門前の空気は少し締まった。",
      lost: "徹平の通知は未読のまま残った。救えるはずの不安を、最初から一つ積み残した。",
      effects: { academics: 3, trust: -1, face: 3, looks: 0, stamina: -4, stress: 3 },
      speaker: "黒羽レン",
    },
    {
      id: "sleep_first",
      title: "今日は寝て明日に備える",
      subtitle: "初日から潰れない",
      text:
        "鬼塚先生「初日から全部背負うな。寝不足の番長ほど話が通じないものはない」\n受験番長はスマホを伏せ、明日の朝に徹平へ返す言葉だけメモした。\n逃げたわけじゃない。続けるために、今日は寝る。",
      voiceText: "鬼塚先生「初日から全部背負うな。寝不足の番長ほど話が通じないものはない」",
      gained: "顔色と声の余裕は守れた。明日も机に向かえる体力が残った。",
      lost: "徹平は一晩だけ、不安を一人で抱えた。番長の返事は朝まで遅れた。",
      effects: { academics: 0, trust: -1, face: 0, looks: 3, stamina: 6, stress: -4 },
      speaker: "鬼塚先生",
    },
  ],
  gyaru: [
    {
      id: "listen_mina",
      title: "ミナの通知に返す",
      subtitle: "親友の進路未定を聞く",
      text:
        "ミナ「進路希望票、何も書けなくて返された。もう詰んだかも」\n優等生ギャルはリップを閉じ、ミナの隣に座った。\n勉強時間は少し減った。でも、泣きそうな通知を既読スルーする自分にはなりたくない。",
      voiceText: "ミナ「進路希望票、何も書けなくて返された。もう詰んだかも」",
      gained: "ミナは少しだけ本音を出した。まだ大学受験を自分の話だと思えないことを、初めて口にした。",
      lost: "自分の課題は後回しになった。置いていかれる不安は、ミナの中に小さく残った。",
      effects: { academics: 1, trust: 4, face: 0, looks: 1, stamina: -2, stress: -1 },
      speaker: "ミナ",
    },
    {
      id: "prove_score",
      title: "黒羽レンに点で返す",
      subtitle: "見た目で判断された分、答案で黙らせる",
      text:
        "黒羽レン「その爪で国立志望？答案よりデコってんじゃん。友だちの面倒を見る余裕まで点数に出るの？」\n優等生ギャルは笑って、模試の申込欄を埋めた。\nミナの通知は気になる。けど、点で返したい日もある。",
      voiceText: "黒羽レン「その志望校、見栄だけで通ると思うな」",
      gained: "黒羽レンを、点で黙らせたい相手として刻んだ。見た目も答案も隠さず出す覚悟ができた。",
      lost: "ミナへの返事は短くなった。親友の不安より、自分の証明を先に選んだ。",
      effects: { academics: 3, trust: -1, face: 1, looks: 1, stamina: -4, stress: 3 },
      speaker: "黒羽レン",
    },
    {
      id: "condition_first",
      title: "今日は寝て顔を立て直す",
      subtitle: "明日の答案と表情を崩さない",
      text:
        "鬼塚先生「疲れは顔にも声にも出る。勝負するなら寝ろ」\n優等生ギャルは通知に短く返して、明日の朝に会う約束を入れた。\n友だちも答案も、余裕がない顔では守りきれない。",
      voiceText: "鬼塚先生「疲れは顔にも声にも出る。勝負するなら寝ろ」",
      gained: "肌も声も、明日の余裕も守れた。焦りを顔に出したまま戦わずに済んだ。",
      lost: "ミナは今夜だけ、一人で進路希望票の空欄を見つめることになった。",
      effects: { academics: 0, trust: 0, face: 0, looks: 4, stamina: 6, stress: -4 },
      speaker: "鬼塚先生",
    },
  ],
};

const state = {
  turn: 0,
  totalTurns: TOTAL_TURNS,
  stats: {},
  usedCardIds: new Set(),
  log: [],
  complete: false,
  screen: "choices",
  introIndex: 0,
  pendingResult: null,
  pendingStudyQuiz: null,
  studyQuizStreak: 0,
  studyQuizSkipCount: 0,
  openingChoiceId: null,
  profile: null,
  pendingProfile: null,
  targetSchool: null,
  pendingTargetSchoolId: null,
  looksContextIntroduced: false,
  shortGoalPlan: null,
  returnScreen: "choices",
  artworkViewer: null,
  artworkReturnScreen: "endingBook",
  unlockedEndingIds: loadUnlockedEndings(),
  unlockedEventCgIds: loadUnlockedEventCgs(),
  studyReviewRecords: loadStudyReviewRecords(),
  savedRunSummary: loadCurrentRunSummary(),
  bgmEnabled: false,
  sfxEnabled: true,
  voiceEnabled: localStorage.getItem(VOICE_STORAGE_KEY) === "true",
  voicePrimed: false,
  voiceSpeaking: false,
  voiceBackend: "idle",
  voiceTimer: 0,
  voiceToken: 0,
  activeVoiceAudio: null,
  voicevoxAvailable: null,
  voicevoxSpeakersPromise: null,
  voiceRenderKey: "",
  voiceDebugLog: [],
  voicevoxAudioCache: new Map(),
  voicevoxSynthesisPromises: new Map(),
  voiceAbortController: null,
  pendingBgmSrc: GAMEPLAY_BGM_SRC,
  audioContext: null,
  profileSelectionLocked: false,
  profileSelectionToken: 0,
  characterCentered: false,
  endingBookRenderKey: "",
  eventGalleryRenderKey: "",
  studyReviewRenderKey: "",
  menuOpen: false,
};

const elements = {
  novelStage: document.querySelector(".novel-stage"),
  statsHud: document.querySelector("#statsHud"),
  turnText: document.querySelector("#turnText"),
  statsGrid: document.querySelector("#statsGrid"),
  forecastPanel: document.querySelector("#forecastPanel"),
  speakerName: document.querySelector("#speakerName"),
  sceneTag: document.querySelector("#sceneTag"),
  dialogueBox: document.querySelector(".dialogue-box"),
  dialogueText: document.querySelector("#dialogueText"),
  choiceList: document.querySelector("#choiceList"),
  advanceButton: document.querySelector("#advanceButton"),
  endingBookButton: document.querySelector("#endingBookButton"),
  endingBookPanel: document.querySelector("#endingBookPanel"),
  endingBookCount: document.querySelector("#endingBookCount"),
  endingBookList: document.querySelector("#endingBookList"),
  endingBookClearButton: document.querySelector("#endingBookClearButton"),
  endingBookBackButton: document.querySelector("#endingBookBackButton"),
  eventGalleryButton: document.querySelector("#eventGalleryButton"),
  eventGalleryPanel: document.querySelector("#eventGalleryPanel"),
  eventGalleryCount: document.querySelector("#eventGalleryCount"),
  eventGalleryList: document.querySelector("#eventGalleryList"),
  eventGalleryClearButton: document.querySelector("#eventGalleryClearButton"),
  eventGalleryBackButton: document.querySelector("#eventGalleryBackButton"),
  studyReviewButton: document.querySelector("#studyReviewButton"),
  studyReviewPanel: document.querySelector("#studyReviewPanel"),
  studyReviewCount: document.querySelector("#studyReviewCount"),
  studyReviewList: document.querySelector("#studyReviewList"),
  studyReviewClearButton: document.querySelector("#studyReviewClearButton"),
  studyReviewBackButton: document.querySelector("#studyReviewBackButton"),
  startTopButton: document.querySelector("#startTopButton"),
  continueButton: document.querySelector("#continueButton"),
  menuButton: document.querySelector("#menuButton"),
  menuPanel: document.querySelector("#menuPanel"),
  artworkViewer: document.querySelector("#artworkViewer"),
  artworkViewerLabel: document.querySelector("#artworkViewerLabel"),
  artworkViewerTitle: document.querySelector("#artworkViewerTitle"),
  artworkViewerImage: document.querySelector("#artworkViewerImage"),
  artworkViewerBody: document.querySelector("#artworkViewerBody"),
  artworkBackButton: document.querySelector("#artworkBackButton"),
  skipIntroButton: document.querySelector("#skipIntroButton"),
  endingArtwork: document.querySelector("#endingArtwork"),
  characterSprite: document.querySelector("#characterSprite"),
  profileCompareSprite: document.querySelector("#profileCompareSprite"),
  restartTopButton: document.querySelector("#restartTopButton"),
  bgmAudio: document.querySelector("#bgmAudio"),
  bgmButton: document.querySelector("#bgmButton"),
  sfxButton: document.querySelector("#sfxButton"),
  voiceButton: document.querySelector("#voiceButton"),
  volumeSlider: document.querySelector("#volumeSlider"),
};

document.addEventListener("click", playButtonClickSound, true);
document.addEventListener("click", stopVoiceForButtonInteraction, true);
document.addEventListener("click", primeVoiceFromUserGesture, true);
elements.skipIntroButton.addEventListener("click", skipIntro);
elements.endingBookButton.addEventListener("click", openEndingBookPage);
elements.endingBookClearButton.addEventListener("click", clearEndingBook);
elements.endingBookBackButton.addEventListener("click", returnFromLibraryPage);
elements.eventGalleryButton.addEventListener("click", openEventGalleryPage);
elements.eventGalleryClearButton.addEventListener("click", clearEventGallery);
elements.eventGalleryBackButton.addEventListener("click", returnFromLibraryPage);
elements.studyReviewButton.addEventListener("click", openStudyReviewPage);
elements.studyReviewClearButton.addEventListener("click", clearStudyReview);
elements.studyReviewBackButton.addEventListener("click", returnFromLibraryPage);
elements.artworkBackButton.addEventListener("click", returnFromArtworkViewer);
elements.startTopButton.addEventListener("click", focusStartChoice);
elements.continueButton.addEventListener("click", continueCurrentRun);
elements.menuButton.addEventListener("click", toggleMenu);
elements.restartTopButton.addEventListener("click", restartGame);
elements.bgmButton.addEventListener("click", toggleBgm);
elements.sfxButton.addEventListener("click", toggleSfx);
elements.voiceButton.addEventListener("click", toggleVoice);
elements.volumeSlider.addEventListener("input", updateBgmVolume);

startNewGame();
updateBgmVolume();
updateBgmButton();
updateSfxButton();
updateVoiceButton();
scheduleLightAssetWarmup();
window.JUKEN_BANCHO_AUDIO = {
  voiceCast,
  resolveCastId,
  buildVoiceLines,
  voiceStatusLabel,
  voiceDebugLog: state.voiceDebugLog,
};

function startNewGame() {
  state.turn = 0;
  state.totalTurns = TOTAL_TURNS;
  state.stats = { ...protagonistProfiles[0].initialStats };
  state.usedCardIds = new Set();
  state.log = ["1年春。高校生活の三年間が始まった。"];
  state.complete = false;
  setScreen("profile");
  state.introIndex = 0;
  state.pendingResult = null;
  state.pendingStudyQuiz = null;
  state.studyQuizStreak = 0;
  state.studyQuizSkipCount = 0;
  state.openingChoiceId = null;
  state.profile = null;
  state.pendingProfile = null;
  state.targetSchool = null;
  state.pendingTargetSchoolId = null;
  state.looksContextIntroduced = false;
  state.shortGoalPlan = null;
  state.returnScreen = "profile";
  state.artworkViewer = null;
  state.artworkReturnScreen = "endingBook";
  state.characterCentered = false;
  state.menuOpen = false;
  clearProfileSelectionAnimation();
  state.profileSelectionToken += 1;
  setCharacterSprite(protagonistProfiles[0]);
  setBgmTrack(getSceneBgm());
  elements.advanceButton.onclick = advanceScene;
  render();
}

function restartGame() {
  const hasSave = Boolean(loadCurrentRun());
  const shouldRestart = !hasSave || window.confirm("保存中の進行を破棄して最初から始めますか？");
  if (!shouldRestart) {
    return;
  }

  clearCurrentRun();
  cancelVoice();
  state.menuOpen = false;
  startNewGame();
}

function focusStartChoice() {
  state.menuOpen = false;
  renderHudControls();
  elements.choiceList.querySelector("button")?.focus();
}

function toggleMenu() {
  cancelVoice();
  state.menuOpen = !state.menuOpen;
  renderHudControls();
}

function setScreen(screen, options = {}) {
  if (state.screen !== screen && options.cancelVoice !== false) {
    cancelVoice();
  }
  state.screen = screen;
}

function setDialogueText(text, voiceText = "") {
  elements.dialogueText.textContent = text;
  if (voiceText) {
    elements.dialogueText.dataset.voiceText = voiceText;
    return;
  }
  delete elements.dialogueText.dataset.voiceText;
}

function stopVoiceForButtonInteraction(event) {
  const button = event.target?.closest?.("button");
  if (!button || button === elements.voiceButton || !state.voiceEnabled) {
    return;
  }
  cancelVoice();
}

function startProfileSelection(profile) {
  if (state.profileSelectionLocked) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    selectProfile(profile);
    return;
  }

  state.profileSelectionLocked = true;
  const selectionToken = state.profileSelectionToken + 1;
  state.profileSelectionToken = selectionToken;
  state.pendingProfile = profile;
  elements.novelStage.dataset.selectedProfile = profile.id;
  elements.novelStage.classList.add("novel-stage--profile-selecting", `novel-stage--selected-${profile.id}`);
  setDialogueText(`${profile.title}で走り抜ける。\n三年間の予定表が、静かに開く。`);
  elements.choiceList.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  renderSkipIntroButton();

  window.setTimeout(() => {
    if (selectionToken !== state.profileSelectionToken || state.screen !== "profile") {
      return;
    }
    selectProfile(profile);
  }, PROFILE_SELECT_ANIMATION_MS);
}

function selectProfile(profile) {
  clearProfileSelectionAnimation();
  state.profile = profile;
  state.pendingProfile = null;
  state.stats = { ...profile.initialStats };
  state.log = [`1年春。${profile.title}の三年間が始まった。`];
  setScreen("intro");
  state.introIndex = getPlayableIntroStartIndex(profile);
  state.openingChoiceId = null;
  state.characterCentered = true;
  state.menuOpen = false;
  setCharacterSprite(profile);
  saveCurrentRun();
  render();
}

function chooseOpeningIncidentChoice(choice) {
  if (!state.profile || state.openingChoiceId) {
    return;
  }

  const effects = { ...choice.effects };
  const resultText = buildOpeningIncidentResultText(choice, effects);
  applyEffects(effects);
  state.openingChoiceId = choice.id;
  state.pendingResult = {
    speaker: choice.speaker,
    sceneTag: "入学式の最初の選択",
    text: resultText,
    artwork: null,
    artworkAlt: "",
    eventChoices: null,
    voiceText: choice.voiceText ?? "",
  };
  state.log.push(`最初の選択: ${choice.title}\n${resultText}`);
  setScreen("openingResult");
  saveCurrentRun();
  render();
}

function buildOpeningIncidentResultText(choice, effects) {
  return `${choice.text}\n\n得たもの: ${choice.gained}\n取りこぼしたもの: ${choice.lost}${formatEffectSentence(effects, { explainLooks: true })}`;
}

function buildResultVoiceText(reactionText, event, seasonalEvent, studyQuizOutcome, card, pressureMessages = []) {
  const voiceParts = [];
  if (reactionText) {
    voiceParts.push(reactionText.trim());
  }
  const studyQuizVoiceText = buildStudyQuizVoiceText(studyQuizOutcome, card);
  if (studyQuizVoiceText) {
    voiceParts.push(studyQuizVoiceText);
  }
  if (event) {
    voiceParts.push(`${event.speaker}「${event.message}」`);
  }
  if (seasonalEvent?.voiceText) {
    voiceParts.push(seasonalEvent.voiceText);
  } else if (seasonalEvent?.speaker && seasonalEvent?.text) {
    voiceParts.push(`${seasonalEvent.speaker}「${seasonalEvent.text.split("\n")[0]}」`);
  }
  const pressureVoiceText = pressureMessages.map(getPressureVoiceText).filter(Boolean).join("\n");
  if (pressureVoiceText) {
    voiceParts.push(pressureVoiceText);
  }
  return voiceParts.join("\n");
}

function getPressureText(message) {
  return typeof message === "string" ? message : message.text;
}

function getPressureVoiceText(message) {
  return typeof message === "string" ? "" : message.voiceText ?? "";
}

function previewTargetSchool(school) {
  state.pendingTargetSchoolId = school.id;
  renderTargetSchoolSelect();
}

function confirmTargetSchool() {
  selectTargetSchool(getPendingTargetSchool());
}

function selectTargetSchool(school) {
  state.targetSchool = school;
  state.pendingTargetSchoolId = null;
  state.totalTurns = school.totalTurns;
  state.shortGoalPlan = createShortGoalPlan(0);
  const commitmentText = buildTargetSchoolCommitmentText(school);
  state.pendingResult = {
    speaker: getProfile().title,
    sceneTag: "志望校決定",
    text: commitmentText,
    artwork: null,
    artworkAlt: "",
    eventChoices: null,
    voiceText: commitmentText.split("\n")[0],
  };
  state.log.push(`${school.name}を志望校に決めた。\n${commitmentText}`);
  setScreen("targetConfirm");
  state.menuOpen = false;
  saveCurrentRun();
  render();
}

function buildTargetSchoolCommitmentText(school) {
  const profile = getProfile();
  if (profile.id === "gyaru") {
    return `${school.name}。名前だけじゃ、途中で答案が崩れる。\nミナも、自分の机も、三年間で置いていかない。`;
  }

  return `${school.name}。名前だけで選んだら折れる。\n徹平への義理も、自分の赤本も、三年間で理由に変える。`;
}

function chooseCard(card) {
  if (state.complete || !isCardAvailable(card)) {
    return;
  }

  if (isLearningCard(card)) {
    startStudyQuiz(card);
    return;
  }

  completeCardChoice(card, rollEffects(card.effects));
}

function startStudyQuiz(card) {
  state.pendingStudyQuiz = {
    card,
    cardEffects: rollEffects(card.effects),
    question: pickStudyQuestion(card),
  };
  setScreen("studyQuiz");
  saveCurrentRun();
  render();
}

function answerStudyQuiz(answerIndex) {
  if (!state.pendingStudyQuiz) {
    return;
  }

  const { card, cardEffects, question } = state.pendingStudyQuiz;
  const correct = answerIndex === question.answerIndex;
  const adjustedEffects = applyStudyQuizResult(cardEffects, card, correct);
  recordStudyQuestion(question, answerIndex, correct);
  state.studyQuizStreak = correct ? state.studyQuizStreak + 1 : 0;
  state.pendingStudyQuiz = null;
  completeCardChoice(card, adjustedEffects, { question, correct, streak: state.studyQuizStreak });
}

function skipStudyQuiz() {
  if (!state.pendingStudyQuiz) {
    return;
  }

  const { card, cardEffects, question } = state.pendingStudyQuiz;
  state.studyQuizStreak = 0;
  state.studyQuizSkipCount += 1;
  state.pendingStudyQuiz = null;
  completeCardChoice(card, cardEffects, { question, skipped: true, skipCount: state.studyQuizSkipCount });
}

function completeCardChoice(card, cardEffects, studyQuizOutcome = null) {
  state.turn += 1;
  applyEffects(cardEffects);
  if (card.oneShot) {
    state.usedCardIds.add(card.id);
  }

  const event = tryApplyRandomEvent();
  const seasonalEvent = tryApplySeasonalEvent();
  const progressMessages = buildProgressReportMessages();
  const pressureMessages = [
    ...applyTargetSchoolPressure(),
    ...applyAcademicMilestonePressure(),
    ...applyLooksMentsQuadrantEvent(),
    ...applyPressureRules(),
  ];
  const effectText = formatEffectSentence(cardEffects, { explainLooks: true });
  const studyQuizText = studyQuizOutcome ? buildStudyQuizResultText(studyQuizOutcome, cardEffects, card) : "";
  const eventText = event ? `\n\n${event.speaker}「${event.message}」${formatEffectSentence(event.effects, { explainLooks: true })}` : "";
  const seasonalText = seasonalEvent
    ? `\n\n${seasonalEvent.title}\n${seasonalEvent.text}${formatEffectSentence(seasonalEvent.effects, { explainLooks: true })}${
        seasonalEvent.choices?.length ? "\n\nどう返す？" : ""
      }`
    : "";
  const progressText = progressMessages.length ? `${progressMessages.map(getPressureText).join("\n")}\n\n` : "";
  const pressureText = pressureMessages.length && !progressMessages.length ? `\n\n${pressureMessages.map(getPressureText).join("\n")}` : "";

  if (state.turn >= state.totalTurns) {
    state.complete = true;
  }

  const cardCopy = getRouteCardCopy(card);
  const reactionText = buildCardReaction(card);
  const resultText = progressMessages.length
    ? `${progressText}今週の変動: ${formatEffectSummary(cardEffects)}`
    : `${cardCopy.resultLead}\n${cardCopy.flavor}${reactionText}${studyQuizText}${effectText}${eventText}${seasonalText}${pressureText}`;
  state.pendingResult = {
    speaker: progressMessages.length ? "進路指導室" : seasonalEvent?.speaker ?? getCardSpeaker(card),
    sceneTag: progressMessages.length ? "12週レポート" : seasonalEvent?.sceneTag ?? (event ? event.title : sceneNameForTurn()),
    text: resultText,
    artwork: seasonalEvent?.artwork,
    artworkAlt: seasonalEvent?.artworkAlt,
    eventChoices: seasonalEvent?.choices ?? null,
    voiceText: buildResultVoiceText(reactionText, event, seasonalEvent, studyQuizOutcome, card, [...progressMessages, ...pressureMessages]),
  };
  state.log.push(resultText);
  setScreen("result");
  saveCurrentRun();
  render();
}

function advanceScene() {
  if (state.screen === "targetConfirm") {
    setScreen("choices");
    state.pendingResult = null;
    saveCurrentRun();
    render();
    return;
  }

  if (state.screen === "openingResult") {
    setScreen("target");
    state.pendingResult = null;
    state.pendingTargetSchoolId = targetSchools[0]?.id ?? null;
    saveCurrentRun();
    render();
    return;
  }

  if (state.screen === "intro") {
    state.introIndex += 1;
    if (state.introIndex >= getProfile().intro.length) {
      setScreen("opening");
    }
    saveCurrentRun();
    render();
    return;
  }

  if (state.complete) {
    setScreen("ending");
    saveCurrentRun();
    render();
    return;
  }

  setScreen("choices");
  state.pendingResult = null;
  saveCurrentRun();
  render();
}

function skipIntro() {
  if (!canUseSecondRunSkip()) {
    return;
  }

  if (state.screen === "profile" && state.profileSelectionLocked && state.pendingProfile) {
    selectProfile(state.pendingProfile);
    return;
  }

  setScreen("target");
  state.pendingResult = null;
  state.openingChoiceId = state.openingChoiceId ?? "skipped";
  state.introIndex = getProfile().intro.length - 1;
  saveCurrentRun();
  render();
}

function isCardAvailable(card) {
  if (state.turn < card.unlockTurn) {
    return false;
  }

  if (state.stats.stamina < card.minStamina) {
    return false;
  }

  return !(card.oneShot && state.usedCardIds.has(card.id));
}

function tryApplyRandomEvent() {
  for (const event of events) {
    if (state.turn < event.minTurn) {
      continue;
    }

    if (event.gateStat && state.stats[event.gateStat] > event.gateBelowOrEqual) {
      continue;
    }

    if (Math.random() <= event.chance) {
      const effects = rollEffects(event.effects);
      applyEffects(effects);
      return { ...getRouteRandomEventCopy(event), effects };
    }
  }

  return null;
}

function tryApplySeasonalEvent() {
  const event = seasonalEvents.find((candidate) => candidate.triggerTurn === state.turn);
  if (!event) {
    return null;
  }

  const routeEvent = getSeasonalEventRoute(event);
  const effects = rollEffects(event.effects);
  applyEffects(effects);
  unlockEventCg(getEventGalleryId(event.id, getProfile().id));
  return { ...event, ...routeEvent, effects };
}

function getRouteRandomEventCopy(event) {
  const route = getProfile().id;
  if (route === "gyaru") {
    if (event.id === "rival_school") {
      return {
        ...event,
        speaker: "黒羽レン",
        message: "ライバル校の黒羽レンが点数表をひらひら振る。言い返すより先に、次の模試で黙らせると決めた。",
      };
    }

    if (event.id === "friend_panic") {
      return {
        ...event,
        speaker: "ミナ",
        message: "親友のミナが進路希望票を握ったまま固まっていた。話を聞くうちに、自分の焦りも少し言葉になった。",
      };
    }

    if (event.id === "teacher_warning") {
      return {
        ...event,
        speaker: "鬼塚先生",
        message: "鬼塚先生に呼び止められた。小言は長いが、願書の締切と面談予約は逃さず拾った。",
      };
    }

    if (event.id === "burnout_hint") {
      return {
        ...event,
        speaker: "優等生ギャル",
        message: "目が滑る。メイクより先に睡眠を盛る日だと、今日は単語帳を閉じた。",
      };
    }

    if (event.id === "exam_ticket_panic") {
      return {
        ...event,
        speaker: "ミナ",
        message: "受験票がないとミナから泣きLINEが来た。机も鞄も総ざらいして、最後は単語帳の間から見つかった。",
      };
    }

    if (event.id === "principal_truce") {
      return {
        ...event,
        speaker: "校長",
        message: "友だち同士の揉め事を収め、受験生として自習室の鍵も預かった。なぜか校内が静かになった。",
      };
    }
  }

  if (event.id === "friend_panic") {
    return {
      ...event,
      speaker: "徹平",
      message: "舎弟の徹平が進路希望票を握ったまま固まっていた。話を聞くうちに、自分の焦りも少し言葉になった。",
    };
  }

  if (event.id === "teacher_warning") {
    return {
      ...event,
      speaker: "鬼塚先生",
      message: "鬼塚先生に呼び止められた。廊下の説教は長いが、願書の締切も教えてもらった。",
    };
  }

  if (event.id === "rival_school") {
    return {
      ...event,
      speaker: "黒羽レン",
      message: "ライバル校の黒羽レンが点数表をひらひら振る。挑発は買わず、次の模試で黙らせると決めた。",
    };
  }

  if (event.id === "exam_ticket_panic") {
    return {
      ...event,
      speaker: "徹平",
      message: "受験票がないと徹平が大騒ぎになった。机も鞄も総ざらいして、最後は単語帳の間から見つかった。",
    };
  }

  return event;
}

function chooseSeasonalEventChoice(choice) {
  if (!state.pendingResult?.eventChoices) {
    return;
  }

  const effects = rollEffects(choice.effects);
  applyEffects(effects);
  const effectText = formatEffectSentence(effects, { explainLooks: true });
  state.pendingResult.text = `${state.pendingResult.text}\n\n選択: ${choice.label}\n${choice.text}${effectText}`;
  state.pendingResult.eventChoices = null;
  state.pendingResult.shouldScrollToBranch = true;
  state.log.push(`選択: ${choice.label}\n${choice.text}${effectText}`);
  saveCurrentRun();
  render();
}

function applyPressureRules() {
  const messages = [];
  if (state.stats.stress >= 88) {
    applyEffects({ academics: -6, trust: -3, face: -1, looks: -5, stamina: 0, stress: -10 });
    messages.push("鏡の前で顔立ちへの自信まで揺らぐ。寝不足、焦り、荒れた身だしなみが重なって、ルックスも人望も削れていく。");
  } else if (state.stats.stress >= 72) {
    applyEffects({ academics: 0, trust: -1, face: 0, looks: -2, stamina: 0, stress: 0 });
    messages.push("寝不足で顔つきと声の余裕が崩れる。妙な空気が流れて、人望も少し冷える。");
  }

  if (state.stats.looks <= 35) {
    applyEffects({ academics: 0, trust: -2, face: -2, looks: 0, stamina: 0, stress: 2 });
    messages.push("顔立ちへの自信、髪、肌、返事の短さがまとめて表に出る。悪気はなくても雑に見られ、人望とメンツを取りこぼす。");
  }

  if (state.stats.stamina <= 6) {
    applyEffects({ academics: 0, trust: 0, face: -4, looks: -1, stamina: 0, stress: 8 });
    messages.push("受験番長「足が笑ってやがる。寝不足でメンツは張れねえな。」");
  }

  return messages;
}

function applyLooksMentsQuadrantEvent() {
  if (!state.targetSchool || state.turn <= 0 || state.turn >= state.totalTurns || state.turn % 8 !== 0) {
    return [];
  }

  const looksHigh = state.stats.looks >= 62;
  const looksLow = state.stats.looks <= 38;
  const faceHigh = state.stats.face >= 62;
  const faceLow = state.stats.face <= 38;
  if ((!looksHigh && !looksLow) || (!faceHigh && !faceLow)) {
    return [];
  }

  const route = getProfile().id;
  let title = "";
  let text = "";
  let effects = null;
  let voiceText = "";

  if (looksHigh && faceHigh) {
    title = "学校の見られ方: ルックス高 / メンツ高";
    text =
      route === "gyaru"
        ? "顔立ち、表情、声の張り、約束を守る姿勢がそろい、廊下の空気が少し変わる。見た目だけではない存在感で、話しかけられる前から場を制した。"
        : "顔立ち、制服の整い、逃げない姿勢がそろい、校門前の空気が少し変わる。怖さではなく、任せられる存在感で場を制した。";
    effects = { academics: 0, trust: 1, face: 1, looks: 0, stamina: 0, stress: -1 };
    voiceText =
      route === "gyaru"
        ? "ミナ「今日、声に余裕ある。ちゃんと前に出てる」"
        : "徹平「番長、今日の背中なら任せられるっす」";
  } else if (looksHigh && faceLow) {
    title = "学校の見られ方: ルックス高 / メンツ低";
    text =
      route === "gyaru"
        ? "見た目は整っている。だからこそ、約束を曖昧にした日の空白が目立つ。黒羽レンの視線は、答案より先にそこを刺してきた。"
        : "顔つきと制服は決まっている。だからこそ、逃げた約束が余計に目立つ。徹平は笑ってごまかしたが、少しだけ距離を置いた。";
    effects = { academics: 0, trust: -1, face: -1, looks: 0, stamina: 0, stress: 1 };
    voiceText =
      route === "gyaru"
        ? "黒羽レン「見た目は整ってる。約束の空白の方が目立つな」"
        : "徹平「番長、決まってるのに、約束だけ置いてったんすね」";
  } else if (looksLow && faceHigh) {
    title = "学校の見られ方: ルックス低 / メンツ高";
    text =
      route === "gyaru"
        ? "顔色も髪も万全ではない。それでも約束を守って席に着いた姿を、ミナは見ていた。派手さではなく、泥臭い信用が残る日だった。"
        : "顔色も制服も荒れている。それでも逃げずに机へ戻る姿を、徹平は見ていた。派手さではなく、泥臭い信用が残る日だった。";
    effects = { academics: 0, trust: 1, face: 0, looks: 0, stamina: 0, stress: 1 };
    voiceText =
      route === "gyaru"
        ? "ミナ「顔は疲れてる。でも逃げてないの、見てた」"
        : "徹平「顔は疲れてる。でも逃げてないの、見てたっす」";
  } else {
    title = "学校の見られ方: ルックス低 / メンツ低";
    text =
      route === "gyaru"
        ? "顔立ちへの自信、表情、声、約束の積み残しがまとめて沈む。学校は残酷で、説明しない不調まで印象として数えてくる。"
        : "顔つき、声、制服、約束の積み残しがまとめて沈む。学校は残酷で、説明しない不調まで印象として数えてくる。";
    effects = { academics: 0, trust: -2, face: -1, looks: 0, stamina: 0, stress: 3 };
    voiceText = "鬼塚先生「不調を説明しないなら、印象だけが先に残るぞ」";
  }

  applyEffects(effects);
  return [{ text: `${title}\n${text}${formatEffectSentence(effects)}`, voiceText }];
}

function buildProgressReportMessages() {
  if (!state.targetSchool || state.turn <= 0 || state.turn >= state.totalTurns || state.turn % 12 !== 0) {
    return [];
  }

  const profile = getProfile();
  const school = getTargetSchool();
  const weeksLeft = Math.max(0, state.totalTurns - state.turn);
  const academicGap = Math.max(0, school.passAcademic - state.stats.academics);
  const milestoneIndex = Math.max(0, Math.floor(state.turn / 12) - 1);
  const milestone = getProgressMilestone(profile.id, state.turn);
  const completedGoal = getDueShortGoalPlan(state.turn);
  const nextGoal = createShortGoalPlan(state.turn);
  const goalReport = buildShortGoalReport(profile.id, completedGoal);
  const nextGoalLine = formatShortGoalNextLine(profile.id, nextGoal);
  const statusLine = academicGap
    ? `${school.name}まで学力あと${academicGap}。今学期のズレが見えてきた。`
    : `${school.name}の学力ラインは射程内。ここからは人望とメンツも落とせない。`;
  state.shortGoalPlan = nextGoal;

  return [
    {
      text: `12週レポート\n${goalReport.character}\n学力: ${goalReport.academics}\n生活: ${goalReport.stamina}\n次の12週: ${nextGoalLine}\n次章: ${milestone.title.replace(/^固定事件: /, "")}\n${buildCompactMilestoneLine(milestone.text)}\n残り${weeksLeft}週。${statusLine}`,
      voiceText: goalReport.character,
    },
  ];
}

function buildCompactMilestoneLine(text) {
  const quote = text.match(/[^「」\n:：]{1,16}「[^」]+」/)?.[0];
  if (quote) {
    return quote;
  }

  return text.split(/[。\n]/)[0].trim();
}

function getDueShortGoalPlan(dueTurn) {
  if (state.shortGoalPlan?.dueTurn === dueTurn) {
    return state.shortGoalPlan;
  }

  return createShortGoalPlan(Math.max(0, dueTurn - 12), dueTurn);
}

function createShortGoalPlan(startTurn, dueTurn = Math.min(state.totalTurns, startTurn + 12)) {
  const school = getTargetSchool();
  const cycleIndex = Math.max(0, Math.floor(startTurn / 12));
  const academicTarget = Math.min(100, state.stats.academics + getShortGoalAcademicStep(school, cycleIndex));
  return {
    startTurn,
    dueTurn,
    academicTarget,
    startStats: {
      academics: state.stats.academics,
      trust: state.stats.trust,
      stamina: state.stats.stamina,
      stress: state.stats.stress,
    },
  };
}

function buildShortGoalReport(profileId, goal) {
  const academicDone = state.stats.academics >= goal.academicTarget;
  const academicDelta = state.stats.academics - (goal.startStats?.academics ?? state.stats.academics);
  const trustDelta = state.stats.trust - (goal.startStats?.trust ?? state.stats.trust);
  const staminaDelta = state.stats.stamina - (goal.startStats?.stamina ?? state.stats.stamina);
  return {
    character: buildShortGoalCharacterReaction(profileId, academicDone, trustDelta),
    academics: `${goal.academicTarget}目標→${state.stats.academics}。${academicDone ? "届いた" : "未達"}。前回比${formatSignedDelta(academicDelta)}。`,
    stamina: buildShortGoalStaminaReport(staminaDelta),
  };
}

function buildShortGoalCharacterReaction(profileId, academicDone, trustDelta) {
  if (profileId === "gyaru") {
    const speaker = "ミナ";
    if (state.stats.trust < 48) {
      return `${speaker}「点は${academicDone ? "動いてる" : "まだ足りない"}。でも、うちの通知ちょっと置いてかれてた」`;
    }
    if (trustDelta > 0) {
      return `${speaker}「点も動いたし、うちも置いてかれてない。次も一緒に机戻ろ」`;
    }
    return `${speaker}「${academicDone ? "点は届いた" : "点はまだ途中"}。でも、次はうちのことも予定に入れて」`;
  }

  const speaker = "徹平";
  if (state.stats.trust < 44) {
    return `${speaker}「番長、学力は${academicDone ? "上がってる" : "まだ届いてない"}っす。でも俺の補習、置き去りっす」`;
  }
  if (trustDelta > 0) {
    return `${speaker}「点も義理も落としてないっす。次の12週もついて行くっす」`;
  }
  return `${speaker}「${academicDone ? "点は届いた" : "点はまだ途中"}っす。次は補習も一回だけ拾ってほしいっす」`;
}

function buildShortGoalStaminaReport(staminaDelta) {
  if (state.stats.stamina < 32) {
    return `体力が危ない。前回比${formatSignedDelta(staminaDelta)}。睡眠を一度挟め。`;
  }
  if (state.stats.stress >= 70) {
    return `ストレスが顔と声に出始めた。体力前回比${formatSignedDelta(staminaDelta)}。`;
  }
  return `体力はまだ残っている。前回比${formatSignedDelta(staminaDelta)}。`;
}

function formatSignedDelta(value) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function formatShortGoalNextLine(profileId, goal) {
  if (profileId === "gyaru") {
    return `学力${goal.academicTarget}。友情を切らずに机へ戻れ。`;
  }

  return `学力${goal.academicTarget}。補習かラーメン会議を一度挟め。`;
}

function getProgressMilestone(profileId, turn) {
  const milestoneIndex = Math.max(0, Math.floor(turn / 12) - 1);
  const banchoMilestones = [
    {
      title: "固定事件: 徹平の赤点答案が拡散寸前",
      text: "徹平「数学9点、拡散されたら親より先に学校に詰むっす」\n鬼塚先生「救うなら答案も生活も見ろ。怒鳴るだけじゃ進路は戻らん」",
    },
    {
      title: "固定事件: 模試会場で黒羽レンが隣席",
      text: "黒羽レン「番長の答案、隣で見届けてやるよ」\n徹平「番長、ここで逃げたら俺も逃げ癖つくっす」",
    },
    {
      title: "固定事件: 文化祭会議の火種",
      text: "体育館裏の空気が固まる。拳ではなく、約束を守れるかでメンツが測られる日だ。",
    },
    {
      title: "固定事件: 鬼塚先生の三者面談前倒し",
      text: "鬼塚先生「点も仲間も睡眠も、全部ごまかせない顔で出る。今日だけは数字を見ろ」",
    },
    {
      title: "固定事件: 夏休みの補習名簿",
      text: "徹平の名前が補習名簿の一番上にあった。自分の赤本を開くか、隣で暗記カードを切るか、机の上で義理が割れる。",
    },
    {
      title: "固定事件: 黒羽レンが点数表を校門に貼る",
      text: "黒羽レン「隠す点なら、最初から受けるなよ」\n笑い声が校門に広がる。貼り返すなら拳ではなく、次の答案だ。",
    },
    {
      title: "固定事件: 体育館裏の進路会議",
      text: "徹平「就職も進学も、どっちも怖いっす」\n体育館裏に集まった仲間の顔が、点数より重く見えた。",
    },
    {
      title: "固定事件: 受験票が消えた夜",
      text: "徹平が受験票をなくした。机、鞄、単語帳の間まで探す夜に、番長のメンツは声の大きさではなく手の早さで決まる。",
    },
    {
      title: "固定事件: 秋模試の公開順位",
      text: "黒羽レンの名前が上にある。徹平は黙って順位表を見つめ、鬼塚先生は進路資料を一枚だけ机に置いた。",
    },
    {
      title: "固定事件: 願書写真の撮り直し",
      text: "寝不足の顔が写真に残る。顔立ちも、表情も、制服の乱れも、受験の日には逃げ場がない。",
    },
    {
      title: "固定事件: 最後の補習願い",
      text: "徹平「番長、最後だけでいいっす。俺も逃げないから」\n赤本のページと舎弟の答案が、同じ机でぶつかった。",
    },
    {
      title: "固定事件: 卒業式前の校門",
      text: "黒羽レンが校門で待っている。勝ち負けより先に、三年間で何を守ったかを見られている。",
    },
  ];
  const gyaruMilestones = [
    {
      title: "固定事件: ミナの進路希望票が空白",
      text: "ミナ「大学とか、まだ自分の話に聞こえない。でも、置いていかれるのはちょっと怖い」",
    },
    {
      title: "固定事件: 模試会場で黒羽レンが隣席",
      text: "黒羽レン「そのネイルで何点取るか、隣で見てる」\n優等生ギャルは笑った。見た目で来た言葉は、答案で返す。",
    },
    {
      title: "固定事件: 文化祭と茶化した本音",
      text: "ミナ「また勉強？ えらすぎて逆に引く」\n笑って茶化したあと、ミナは主人公のノートを閉じずに見ていた。気にしていない顔ほど、少しだけ嘘くさい。",
    },
    {
      title: "固定事件: 鬼塚先生の三者面談前倒し",
      text: "鬼塚先生「疲れは顔にも声にも出る。勝負するなら、点数だけじゃなく調子も整えろ」",
    },
    {
      title: "固定事件: 夏休みの小テスト前夜",
      text: "ミナ「小テストだけでも逃げないでみる。あんた、ずっと続けてるし」\n横で聞くか、自分の課題を進めるか。友情は予定表を食う。",
    },
    {
      title: "固定事件: 黒羽レンが点数表を広げる",
      text: "黒羽レン「見た目で判断するなって言うなら、点数で黙らせてみな」\n爪も答案も、今日は隠さず机に出す。",
    },
    {
      title: "固定事件: ミナが大学受験を口にする",
      text: "ミナは主人公の模試結果を見たあと、裏で声を落とした。\nミナ「私も大学、目指してみたい。置いていかれるからじゃなくて、自分で」",
    },
    {
      title: "固定事件: ミナの反発",
      text: "ミナ「置いていかれるのが怖いだけって、決めつけないで」\n初めて語気が強くなった。応援役で終わりたくない気持ちは、もう逃げ道ではなくなっている。",
    },
    {
      title: "固定事件: 秋模試の公開順位",
      text: "黒羽レンの名前が上にある。ミナは笑っているが、手元の志望校メモだけがくしゃくしゃだった。",
    },
    {
      title: "固定事件: 願書写真の撮り直し",
      text: "顔立ち、肌、髪、笑い方。見た目で判断される現実は嫌いだ。でも、出願写真は今日の自分を残してしまう。",
    },
    {
      title: "固定事件: 最後の受験準備",
      text: "ミナ「終わったら、私の過去問も見て。あんたが合格しても、見てるだけで終わりたくない」",
    },
    {
      title: "固定事件: 卒業式前の昇降口",
      text: "黒羽レンが昇降口で待っている。点数も見た目も友情も、三年間の答えとして並べられる日だ。",
    },
  ];
  const milestones = profileId === "gyaru" ? gyaruMilestones : banchoMilestones;
  return milestones[Math.min(milestoneIndex, milestones.length - 1)];
}

function applyTargetSchoolPressure() {
  const school = getTargetSchool();
  if (!school) {
    return [];
  }

  const isMonthlyCheck = state.turn > 0 && state.turn % 4 === 0;
  if (!isMonthlyCheck && !isLateStage()) {
    return [];
  }

  const stress = school.weeklyStress + (isLateStage() ? school.lateStress : 0);
  const stamina = isLateStage() ? -school.staminaDrain : 0;
  if (!stress && !stamina) {
    return [];
  }

  const effects = { academics: 0, trust: 0, face: 0, looks: 0, stamina, stress };
  applyEffects(effects);
  return [`進路指導室の赤線が濃くなる。${school.name}の偏差値${school.deviation}は、今週の疲れにも容赦しない。${formatEffectSentence(effects)}`];
}

function applyAcademicMilestonePressure() {
  const school = getTargetSchool();
  const milestone = academicMilestones[school?.id]?.find((candidate) => candidate.turn === state.turn);
  if (!milestone || state.stats.academics >= milestone.requiredAcademics) {
    return [];
  }

  applyEffects(milestone.effects);
  return [`${milestone.message}${formatEffectSentence(milestone.effects)}`];
}

function applyEffects(effects) {
  for (const key of Object.keys(statLabels)) {
    state.stats[key] = clamp((state.stats[key] ?? 0) + (effects[key] ?? 0), 0, 100);
  }
}

function isLearningCard(card) {
  return card.tag === "study" || card.tag === "teacher" || card.tag === "exam";
}

function pickStudyQuestion(card) {
  const questions = isTargetExamCard(card) ? getTargetExamQuestions() : studyQuizQuestions;
  return getStudyQuestionFromPool(questions, randomInt(0, getStudyQuestionPoolSize(questions) - 1));
}

function isTargetExamCard(card) {
  return card.id === "mock_exam" || card.id === "final_sprint";
}

function getTargetExamQuestions() {
  return targetExamQuestions[state.targetSchool?.id] ?? studyQuizQuestions;
}

function applyStudyQuizResult(effects, card, correct) {
  const nextEffects = { ...effects };
  const academics = effects.academics ?? 0;
  if ((card.effects.academics ?? 0) <= 0) {
    return nextEffects;
  }

  nextEffects.academics = correct ? clamp(academics + 1, 0, 100) : academics;
  return nextEffects;
}

function buildStudyQuizResultText(outcome, effects, card) {
  const { question, correct, skipped } = outcome;
  if (skipped) {
    return `\n\n五科目チェックは見送った。\n通常どおり予定を進めたが、復習帳には何も増えない。`;
  }

  const result = correct ? "正解" : "不正解";
  const bonusText = correct ? "学力の伸びに火がついた。" : "理解が浅い部分は復習帳に残した。予定の学力上昇はそのまま進む。";
  const reactionText = buildStudyQuizReaction(outcome, card);
  return `\n\n五科目チェック: ${question.subject} / ${question.area}\n${result}。${bonusText}${reactionText}\n解説: ${question.explanation}\n今回の学力変動: ${effects.academics > 0 ? `+${effects.academics}` : effects.academics}`;
}

function buildStudyQuizReaction(outcome, card) {
  if (!outcome.correct) {
    return getProfile().id === "gyaru"
      ? "\n鬼塚先生「外した問題ほど、次に点へ化ける。復習帳に残せ」"
      : "\n鬼塚先生「間違いを隠すな。次に拾えば、それも番長の点になる」";
  }

  const profileId = getProfile().id;
  const streakLine =
    outcome.streak >= 3
      ? profileId === "gyaru"
        ? "\n集中コンボ: 3連続正解。黒羽レンが一瞬だけ黙った。"
        : "\n集中コンボ: 3連続正解。徹平が小さく拍手して、黒羽レンが目をそらした。"
      : "";
  const examLine = isTargetExamCard(card)
    ? profileId === "gyaru"
      ? "\n黒羽レン「その点、偶然じゃないな」"
      : "\n黒羽レン「……今の解き方は、まぐれじゃねえな」"
    : profileId === "gyaru"
      ? "\n鬼塚先生「今の解き方、入試で使えるぞ」"
      : "\n鬼塚先生「その一問を拾えるなら、答案はまだ伸びる」";

  return `${examLine}${streakLine}`;
}

function buildStudyQuizVoiceText(outcome, card) {
  if (!outcome) {
    return "";
  }
  if (outcome.skipped) {
    if (outcome.skipCount % 3 !== 0) {
      return "";
    }
    return getProfile().id === "gyaru"
      ? "黒羽レン「解かない選択も、点数には残る」"
      : "鬼塚先生「逃げたな。まあ、今日は予定を進めろ」";
  }

  return buildStudyQuizReaction(outcome, card)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^([^「」:：]{1,24})「(.+)」$/.test(line) || line.startsWith("集中コンボ"))
    .map((line) => {
      if (!line.startsWith("集中コンボ")) {
        return line;
      }
      return getProfile().id === "gyaru" ? "黒羽レン「……今のは偶然じゃないな」" : "徹平「三連続っす。今の番長、強いっす」";
    })
    .join("\n");
}

function rollEffects(effects, variance = EFFECT_VARIANCE) {
  const rolled = {};
  for (const key of Object.keys(statLabels)) {
    const base = effects[key] ?? 0;
    if (!base) {
      rolled[key] = 0;
      continue;
    }

    const delta = randomInt(-variance, variance);
    const value = base + delta;
    rolled[key] = base > 0 ? Math.max(0, value) : Math.min(0, value);
  }
  return rolled;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resolveEnding() {
  const s = state.stats;
  const school = getTargetSchool();
  const profile = getProfile();
  const passAcademic = school?.passAcademic ?? 82;
  const passTrust = school?.passTrust ?? 48;
  const passFace = school?.passFace ?? 48;
  const waitlistAcademic = school?.waitlistAcademic ?? passAcademic - 10;
  const waitlistTrust = school?.waitlistTrust ?? 70;
  const waitlistFace = school?.waitlistFace ?? 70;
  const schoolLine = school ? `${school.name}、偏差値${school.deviation}。` : "志望校の門。";
  const route = profile.id;

  if (s.academics >= passAcademic && s.trust >= passTrust && s.face >= passFace) {
    return {
      id: route === "gyaru" ? "passed_gyaru" : "passed_bancho",
      title: route === "gyaru" ? "優等生ギャル" : "合格番長",
      voiceText:
        route === "gyaru"
          ? "優等生ギャル「合格した。ミナの声まで、校門に残ってる」"
          : "受験番長「合格した。徹平が泣いてるなら、これで勝ちだ」",
      body:
        route === "gyaru"
          ? `${schoolLine}\n合格発表の日、友だちは泣きながらハイタッチしてきた。\n友情も偏差値も盛り切った、あんたこそ優等生ギャルだ。`
          : `${schoolLine}\n合格発表の日、仲間たちは胴上げの準備をしていた。\n学力も仁義も守り抜いた、お前こそ受験番長だ。`,
    };
  }

  if (s.academics >= passAcademic) {
    return {
      id: route === "gyaru" ? "lonely_gyaru" : "lonely_pass",
      title: route === "gyaru" ? "孤独な合格ギャル" : "孤独な合格",
      voiceText:
        route === "gyaru"
          ? "優等生ギャル「合格した。でも、ミナに見せる画面がない」"
          : "受験番長「合格通知は軽い。誰にも見せられねえと、こんなに軽い」",
      body:
        route === "gyaru"
          ? `${schoolLine}\n合格はした。けど、スマホの通知は思ったより静かだった。\n盛ったノートの厚さだけが、この三年間を知っている。`
          : `${schoolLine}\n合格はした。だが校門前に仲間の姿は少ない。\n机に向かった時間の重さを、お前だけが知っている。`,
    };
  }

  if (s.academics >= waitlistAcademic && s.trust >= waitlistTrust && s.face >= waitlistFace) {
    return {
      id: route === "gyaru" ? "waitlist_gyaru" : "waitlist_legend",
      title: route === "gyaru" ? "補欠のギャル伝説" : "補欠の伝説",
      voiceText:
        route === "gyaru"
          ? "ミナ「点数は足りない。でも、次は隣で盛り返そ」"
          : "徹平「点数は足りねえ。でも、俺はもう逃げないっす」",
      body:
        route === "gyaru"
          ? `${schoolLine}\n点数は少し足りない。けど友だちは、誰も責めない。\n来年リベンジ、ちゃんと盛り返す。`
          : `${schoolLine}\n点数は少し足りない。だが仲間たちは誰も責めない。\n来年、伝説の第二章が始まる。`,
    };
  }

  if (s.trust >= 82 && s.face >= 82) {
    return {
      id: route === "gyaru" ? "legend_gyaru" : "bancho_legend",
      title: route === "gyaru" ? "ギャル伝説" : "番長伝説",
      voiceText:
        route === "gyaru"
          ? "優等生ギャル「落ちた。でも、ミナが顔を上げたなら、全部は負けじゃない」"
          : "受験番長「落ちた。だが、徹平が逃げねえなら、番長は終わらねえ」",
      body:
        route === "gyaru"
          ? `${schoolLine}\n受験には敗れた。でも、あんたに救われた友だちは数えきれない。\n情に厚いギャルの名前は、卒業後も廊下に残った。`
          : `${schoolLine}\n受験には敗れた。しかし校内でお前の名を知らぬ者はいない。\n問題集より厚い武勇伝が残った。`,
    };
  }

  return {
    id: route === "gyaru" ? "failed_gyaru" : "failed",
    title: route === "gyaru" ? "不合格ギャル" : "不合格",
    voiceText:
      route === "gyaru"
        ? "優等生ギャル「泣くのは今日だけ。明日、ミナにだけはちゃんと話す」"
        : "受験番長「答案用紙は逃げねえ。次は俺が逃げねえ」",
    body:
      route === "gyaru"
        ? `${schoolLine}\n勉強も友情も、ちょっとずつ空回りした。\nでも泣いて終わりじゃない。次は予定から盛り直せ。`
        : `${schoolLine}\n勉強も仁義も中途半端だった。\nだが答案用紙は逃げない。次は予定から締め直せ。`,
  };
}

function render() {
  const isLibraryScreen = state.screen === "endingBook" || state.screen === "eventGallery" || state.screen === "studyReview";
  const isArtworkViewer = state.screen === "artworkViewer";
  const isFullPageScreen = isLibraryScreen || isArtworkViewer;
  elements.novelStage.dataset.screen = state.screen;
  elements.novelStage.classList.toggle("novel-stage--profile", state.screen === "profile");
  elements.novelStage.classList.toggle("novel-stage--playing", state.screen === "choices" || state.screen === "result" || state.screen === "studyQuiz");
  elements.novelStage.classList.toggle("novel-stage--ending", state.screen === "ending");
  elements.novelStage.classList.toggle("novel-stage--collection", isFullPageScreen);
  elements.novelStage.classList.toggle(
    "novel-stage--route-centered",
    state.characterCentered && state.screen !== "profile" && state.screen !== "ending" && !isFullPageScreen,
  );
  elements.statsHud.hidden =
    isFullPageScreen || state.screen === "profile" || state.screen === "intro" || state.screen === "target" || state.screen === "targetConfirm";
  elements.dialogueBox.hidden = isFullPageScreen;
  if (state.screen !== "profile") {
    clearProfileSelectionAnimation();
  }
  elements.turnText.textContent = buildTurnText();
  if (state.screen !== "ending" && !isFullPageScreen) {
    setBgmTrack(getSceneBgm());
  }
  renderStats();
  renderEndingBook();
  renderEventGallery();
  renderStudyReview();
  renderArtworkViewer();
  renderSkipIntroButton();
  renderHudControls();

  if (isFullPageScreen) {
    hideEndingArtwork();
    resetDialogueScroll();
    return;
  }

  if (state.screen === "profile") {
    renderProfileSelect();
    return;
  }

  if (state.screen === "intro") {
    renderIntro();
    return;
  }

  if (state.screen === "opening") {
    renderOpeningIncident();
    return;
  }

  if (state.screen === "target") {
    renderTargetSchoolSelect();
    return;
  }

  if (state.screen === "ending") {
    renderEnding();
    return;
  }

  if (state.screen === "studyQuiz" && state.pendingStudyQuiz) {
    renderStudyQuiz();
    return;
  }

  if ((state.screen === "result" || state.screen === "openingResult" || state.screen === "targetConfirm") && state.pendingResult) {
    renderResult();
    return;
  }

  renderChoices();
}

function renderProfileSelect() {
  hideEndingArtwork();
  showProfileSelectSprites();
  resetDialogueScroll();
  elements.speakerName.textContent = "主人公選択";
  elements.sceneTag.textContent = "入学式";
  setDialogueText("三年間をどっちの受験生で走り抜ける？\n仁義の番長か、友情も偏差値も上げる優等生ギャルか。卒業式まで、毎週の予定を選び続けろ。");
  elements.choiceList.replaceChildren(...protagonistProfiles.map(createProfileButton));
  elements.advanceButton.hidden = true;
}

function renderIntro() {
  hideEndingArtwork();
  resetDialogueScroll();
  const introScenes = getProfile().intro;
  const scene = introScenes[state.introIndex];
  elements.speakerName.textContent = scene.speaker;
  elements.sceneTag.textContent = scene.sceneTag;
  setDialogueText(scene.text, scene.voiceText);
  elements.choiceList.replaceChildren();
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent = state.introIndex === introScenes.length - 1 ? "最初の選択へ" : "次へ";
  elements.advanceButton.onclick = advanceScene;
  queueCurrentDialogueVoice();
}

function renderOpeningIncident() {
  hideEndingArtwork();
  resetDialogueScroll();
  const profile = getProfile();
  const scene = profile.intro[0];
  elements.speakerName.textContent = scene.speaker;
  elements.sceneTag.textContent = scene.sceneTag;
  setDialogueText(`${scene.text}\n\n最初の一手で、何を優先する？`, scene.voiceText);
  elements.choiceList.replaceChildren(...getOpeningIncidentChoices().map(createOpeningIncidentChoiceButton));
  elements.advanceButton.hidden = true;
  queueCurrentDialogueVoice();
}

function renderTargetSchoolSelect() {
  hideEndingArtwork();
  resetDialogueScroll();
  const selectedSchool = getPendingTargetSchool();
  elements.speakerName.textContent = "進路指導室";
  elements.sceneTag.textContent = "志望校選択";
  setDialogueText(
    "志望校を決める。上の札で候補を選び、下の勝ち筋を見て覚悟を決めろ。",
  );
  elements.choiceList.replaceChildren(...targetSchools.map(createTargetSchoolButton), createTargetSchoolDetail(selectedSchool));
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent = `${selectedSchool.name}で三年間を始める`;
  elements.advanceButton.onclick = confirmTargetSchool;
}

function renderChoices() {
  hideEndingArtwork();
  resetDialogueScroll();
  elements.speakerName.textContent = getProfile().title;
  elements.sceneTag.textContent = sceneNameForTurn();
  setDialogueText(buildChoicePrompt());
  elements.advanceButton.hidden = true;

  const availableCards = cards.filter(isCardAvailable);
  elements.choiceList.replaceChildren(...availableCards.map(createChoiceButton));
}

function renderStudyQuiz() {
  hideEndingArtwork();
  resetDialogueScroll();
  const { card, cardEffects, question } = state.pendingStudyQuiz;
  const cardCopy = getRouteCardCopy(card);
  elements.speakerName.textContent = "五科目チェック";
  elements.sceneTag.textContent = `${question.subject}・${question.area}`;
  setDialogueText(
    `${cardCopy.title}の前に一問だけ上乗せを狙える。\n${question.prompt}\n\n正解なら学力+1。不正解でも通常の予定効果は残る。急ぐなら見送って進める。`,
  );
  elements.choiceList.replaceChildren(
    ...question.choices.map((choice, index) => createStudyQuizChoiceButton(choice, index, cardEffects)),
    createStudyQuizSkipButton(),
  );
  elements.advanceButton.hidden = true;
}

function renderResult() {
  if (state.pendingResult.artwork) {
    showArtwork(state.pendingResult.artwork, state.pendingResult.artworkAlt);
  } else {
    hideEndingArtwork();
  }
  const shouldScrollToBranch = state.pendingResult.shouldScrollToBranch;
  if (!shouldScrollToBranch) {
    resetDialogueScroll();
  }
  elements.speakerName.textContent = state.pendingResult.speaker;
  elements.sceneTag.textContent = state.pendingResult.sceneTag;
  setDialogueText(state.pendingResult.text, state.pendingResult.voiceText);
  queueCurrentDialogueVoice();
  if (state.pendingResult.eventChoices?.length) {
    elements.choiceList.replaceChildren(...state.pendingResult.eventChoices.map(createSeasonalEventChoiceButton));
    elements.advanceButton.hidden = true;
    return;
  }

  elements.choiceList.replaceChildren();
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent =
    state.screen === "openingResult" ? "志望校を決める" : state.screen === "targetConfirm" ? "最初の12週へ" : state.complete ? "合格発表へ" : "次の週へ";
  elements.advanceButton.onclick = advanceScene;
  if (shouldScrollToBranch) {
    state.pendingResult.shouldScrollToBranch = false;
    window.requestAnimationFrame(() => {
      elements.dialogueBox.scrollTop = elements.dialogueBox.scrollHeight;
      elements.advanceButton.focus({ preventScroll: true });
    });
  }
}

function renderEnding() {
  const ending = attachEndingAssets(resolveEnding());
  unlockEnding(ending.id);
  clearCurrentRun();
  renderEndingBook();
  renderEventGallery();
  showArtwork(ending.artwork, ending.artworkAlt);
  setBgmTrack(ending.bgm);
  resetDialogueScroll();
  elements.speakerName.textContent = "合格発表";
  elements.sceneTag.textContent = "ENDING";
  setDialogueText(`${ending.title}\n\n${ending.body}`, ending.voiceText);
  elements.choiceList.replaceChildren();
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent = "もう一周する";
  elements.advanceButton.onclick = startNewGame;
  queueCurrentDialogueVoice();
}

function attachEndingAssets(ending) {
  const catalogEntry = endingCatalog.find((entry) => entry.id === ending.id);
  return { ...catalogEntry, ...ending };
}

function showArtwork(src, alt) {
  elements.endingArtwork.src = src;
  elements.endingArtwork.alt = alt;
  elements.endingArtwork.hidden = false;
}

function hideEndingArtwork() {
  elements.endingArtwork.hidden = true;
  elements.endingArtwork.removeAttribute("src");
  elements.endingArtwork.alt = "";
}

function resetDialogueScroll() {
  elements.dialogueBox.scrollTop = 0;
}

function openEndingBookPage() {
  state.returnScreen = getReturnableScreen();
  setScreen("endingBook");
  state.menuOpen = false;
  render();
}

function clearEndingBook() {
  const shouldClear = window.confirm("結末帳の記録を消しますか？");
  if (!shouldClear) {
    return;
  }

  state.unlockedEndingIds = new Set();
  saveUnlockedEndings();
  renderEndingBook();
  renderEventGallery();
}

function renderEndingBook() {
  const isPage = state.screen === "endingBook";
  const unlockedCount = state.unlockedEndingIds.size;
  elements.endingBookButton.textContent =
    state.screen === "profile" && unlockedCount === 0 ? "結末帳" : `結末帳 ${unlockedCount}/${endingCatalog.length}`;
  if (isPage) {
    elements.endingBookButton.setAttribute("aria-current", "page");
  } else {
    elements.endingBookButton.removeAttribute("aria-current");
  }
  elements.endingBookCount.textContent = `${unlockedCount}/${endingCatalog.length} 解放`;
  elements.endingBookPanel.hidden = !isPage;
  if (!isPage) {
    if (state.endingBookRenderKey) {
      elements.endingBookList.replaceChildren();
      state.endingBookRenderKey = "";
    }
    return;
  }

  const renderKey = `${[...state.unlockedEndingIds].sort().join("|")}:${endingCatalog.length}`;
  if (renderKey !== state.endingBookRenderKey) {
    elements.endingBookList.replaceChildren(...endingCatalog.map(createEndingRecord));
    state.endingBookRenderKey = renderKey;
  }
}

function openEventGalleryPage() {
  if (!hasEventGalleryAccess()) {
    return;
  }

  state.returnScreen = getReturnableScreen();
  setScreen("eventGallery");
  state.menuOpen = false;
  render();
}

function clearEventGallery() {
  const shouldClear = window.confirm("回想帳の記録を消しますか？");
  if (!shouldClear) {
    return;
  }

  state.unlockedEventCgIds = new Set();
  saveUnlockedEventCgs();
  renderEventGallery();
}

function openStudyReviewPage() {
  state.returnScreen = getReturnableScreen();
  setScreen("studyReview");
  state.menuOpen = false;
  render();
}

function clearStudyReview() {
  const shouldClear = window.confirm("復習帳の記録を消しますか？");
  if (!shouldClear) {
    return;
  }

  state.studyReviewRecords = new Map();
  saveStudyReviewRecords();
  renderStudyReview();
}

function renderEventGallery() {
  const galleryCatalog = getEventGalleryCatalog();
  const isPage = state.screen === "eventGallery";
  const unlockedCount = state.unlockedEventCgIds.size;
  const hasAccess = hasEventGalleryAccess();
  elements.eventGalleryButton.hidden = !hasAccess;
  elements.eventGalleryButton.textContent = `回想帳 ${unlockedCount}/${galleryCatalog.length}`;
  if (isPage) {
    elements.eventGalleryButton.setAttribute("aria-current", "page");
  } else {
    elements.eventGalleryButton.removeAttribute("aria-current");
  }
  elements.eventGalleryCount.textContent = `${unlockedCount}/${galleryCatalog.length} 回収`;
  elements.eventGalleryPanel.hidden = !hasAccess || !isPage;
  if (!hasAccess || !isPage) {
    if (state.eventGalleryRenderKey) {
      elements.eventGalleryList.replaceChildren();
      state.eventGalleryRenderKey = "";
    }
    return;
  }

  const renderKey = `${[...state.unlockedEventCgIds].sort().join("|")}:${galleryCatalog.length}`;
  if (renderKey !== state.eventGalleryRenderKey) {
    elements.eventGalleryList.replaceChildren(...galleryCatalog.map(createEventGalleryRecord));
    state.eventGalleryRenderKey = renderKey;
  }
}

function renderStudyReview() {
  const isPage = state.screen === "studyReview";
  const records = getStudyReviewRecords();
  const totalQuestions = studyQuizTotalQuestionCount;
  elements.studyReviewButton.textContent = records.length ? `復習帳 ${records.length}問` : "復習帳";
  if (isPage) {
    elements.studyReviewButton.setAttribute("aria-current", "page");
  } else {
    elements.studyReviewButton.removeAttribute("aria-current");
  }
  elements.studyReviewCount.textContent = `${records.length}/${totalQuestions} 問`;
  elements.studyReviewPanel.hidden = !isPage;
  if (!isPage) {
    if (state.studyReviewRenderKey) {
      elements.studyReviewList.replaceChildren();
      state.studyReviewRenderKey = "";
    }
    return;
  }

  const renderKey = records.map((record) => `${record.id}:${record.attempts}:${record.correct}:${record.lastAnswerIndex}`).join("|");
  if (renderKey !== state.studyReviewRenderKey) {
    elements.studyReviewList.replaceChildren(...(records.length ? records.map(createStudyReviewRecord) : [createEmptyStudyReviewRecord()]));
    state.studyReviewRenderKey = renderKey;
  }
}

function returnFromLibraryPage() {
  setScreen(state.returnScreen || "choices");
  state.menuOpen = false;
  render();
}

function getReturnableScreen() {
  if (state.screen === "artworkViewer") {
    return state.artworkReturnScreen || "endingBook";
  }

  if (state.screen === "endingBook" || state.screen === "eventGallery" || state.screen === "studyReview") {
    return state.returnScreen || "choices";
  }

  return state.screen;
}

function openArtworkViewer(item, returnScreen) {
  state.artworkViewer = item;
  state.artworkReturnScreen = returnScreen;
  setScreen("artworkViewer");
  state.menuOpen = false;
  render();
}

function returnFromArtworkViewer() {
  setScreen(state.artworkReturnScreen || "endingBook");
  state.artworkViewer = null;
  render();
}

function renderArtworkViewer() {
  const item = state.artworkViewer;
  const isVisible = state.screen === "artworkViewer" && item;
  elements.artworkViewer.hidden = !isVisible;
  if (!isVisible) {
    elements.artworkViewerImage.removeAttribute("src");
    elements.artworkViewerImage.alt = "";
    elements.artworkViewerTitle.textContent = "";
    elements.artworkViewerBody.textContent = "";
    return;
  }

  elements.artworkViewerLabel.textContent = item.label;
  elements.artworkViewerTitle.textContent = item.title;
  elements.artworkViewerImage.src = item.src;
  elements.artworkViewerImage.alt = item.alt;
  elements.artworkViewerBody.textContent = item.body;
}

function hasEventGalleryAccess() {
  return state.unlockedEndingIds.size > 0;
}

function canUseSecondRunSkip() {
  const hasClearedOnce = state.unlockedEndingIds.size > 0;
  const canSkipProfileAnimation = state.screen === "profile" && state.profileSelectionLocked && state.pendingProfile;
  const canSkipIntroScenes = state.screen === "intro" && state.profile;
  const canSkipOpeningIncident = state.screen === "opening" && state.profile;
  return hasClearedOnce && (canSkipProfileAnimation || canSkipIntroScenes || canSkipOpeningIncident);
}

function renderSkipIntroButton() {
  elements.skipIntroButton.hidden = !canUseSecondRunSkip();
  elements.skipIntroButton.textContent = state.screen === "profile" ? "演出スキップ" : "導入スキップ";
}

function renderHudControls() {
  const summary = state.savedRunSummary;
  const isFirstScreen = state.screen === "profile";
  elements.startTopButton.hidden = !isFirstScreen;
  elements.continueButton.hidden = !summary || state.screen !== "profile";
  elements.continueButton.textContent = summary ? `続きから ${summary.turn}/${summary.totalTurns}` : "続きから";
  elements.menuPanel.hidden = !state.menuOpen;
  elements.menuButton.setAttribute("aria-expanded", String(state.menuOpen));

  const hasStudyRecords = state.studyReviewRecords.size > 0;
  elements.studyReviewButton.hidden = isFirstScreen && !hasStudyRecords;
}

function createEventGalleryRecord(event, index) {
  const unlocked = state.unlockedEventCgIds.has(event.id);
  const record = document.createElement(unlocked ? "button" : "article");
  record.className = unlocked ? "ending-record cg-record" : "ending-record cg-record cg-record--locked";
  if (unlocked) {
    record.type = "button";
    record.setAttribute("aria-label", `${event.title}の一枚絵を全画面表示`);
    record.addEventListener("click", () => {
      openArtworkViewer(
        {
          label: "回想帳",
          title: event.title,
          body: event.hint,
          src: event.artwork,
          alt: event.artworkAlt,
        },
        "eventGallery",
      );
    });
  }

  if (unlocked) {
    const image = document.createElement("img");
    image.className = "cg-record__image";
    image.src = event.artwork;
    image.alt = event.artworkAlt;
    image.loading = "lazy";
    image.decoding = "async";
    record.append(image);
  }

  const title = document.createElement("p");
  title.className = "ending-record__title";
  title.textContent = unlocked ? `${index + 1}. ${event.title}` : `${index + 1}. ？？？`;

  const body = document.createElement("p");
  body.className = "ending-record__body";
  body.textContent = unlocked ? event.hint : "まだ回収していない一枚絵。";

  record.append(title, body);
  return record;
}

function createSeasonalEventChoiceButton(choice) {
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.setAttribute("aria-label", `${choice.label}。効果目安: ${formatEffectSummary(choice.effects)}`);
  button.addEventListener("click", () => {
    chooseSeasonalEventChoice(choice);
  });

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = choice.label;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = "会話の返しで流れが変わる";

  const effects = document.createElement("span");
  effects.className = "choice-effects";
  effects.append(...createEffectPills(choice.effects));

  button.append(title, subtitle, effects);
  return button;
}

function createStudyReviewRecord(record, index) {
  const question = getStudyQuestionById(record.id);
  const article = document.createElement("article");
  article.className = "ending-record study-review-record";
  if (!question) {
    return article;
  }

  const title = document.createElement("p");
  title.className = "ending-record__title";
  title.textContent = `${index + 1}. ${question.subject} / ${question.area}`;

  const meta = document.createElement("p");
  meta.className = "quiz-review-meta";
  meta.textContent = `正解 ${record.correct}/${record.attempts} / 最後: ${record.lastCorrect ? "正解" : "不正解"}`;

  const prompt = document.createElement("p");
  prompt.className = "quiz-review-prompt";
  prompt.textContent = question.prompt;

  const answer = document.createElement("p");
  answer.className = "quiz-review-answer";
  answer.textContent = `正答: ${question.choices[question.answerIndex]}`;

  const lastAnswer = document.createElement("p");
  lastAnswer.className = "ending-record__body";
  lastAnswer.textContent = `最後の回答: ${question.choices[record.lastAnswerIndex] ?? "未記録"}`;

  const explanation = document.createElement("p");
  explanation.className = "ending-record__body";
  explanation.textContent = `解説: ${question.explanation}`;

  article.append(title, meta, prompt, answer, lastAnswer, explanation);
  return article;
}

function createEmptyStudyReviewRecord() {
  const article = document.createElement("article");
  article.className = "ending-record study-review-record";

  const title = document.createElement("p");
  title.className = "ending-record__title";
  title.textContent = "まだ出題された問題はない";

  const body = document.createElement("p");
  body.className = "ending-record__body";
  body.textContent = "学習系カードを選ぶと、五科目チェックの問題と解説がここに残る。";

  article.append(title, body);
  return article;
}

function createStudyQuizChoiceButton(choice, index, cardEffects) {
  const button = document.createElement("button");
  button.className = "choice-button choice-button--quiz";
  button.type = "button";
  button.setAttribute("aria-label", `${choice}を選ぶ。正解なら学力ボーナス。不正解でも通常効果は残る。現在の効果目安: ${formatEffectSummary(cardEffects)}`);
  button.addEventListener("click", () => {
    answerStudyQuiz(index);
  });

  const marker = document.createElement("span");
  marker.className = "quiz-choice-marker";
  marker.textContent = String.fromCharCode(65 + index);

  const text = document.createElement("span");
  text.className = "choice-title";
  text.textContent = choice;

  button.append(marker, text);
  return button;
}

function createStudyQuizSkipButton() {
  const button = document.createElement("button");
  button.className = "choice-button choice-button--quiz-skip";
  button.type = "button";
  button.setAttribute("aria-label", "五科目チェックを見送って通常効果で予定を進める");
  button.addEventListener("click", skipStudyQuiz);

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = "解かずに予定へ進む";

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = "通常効果のまま進行。復習帳には残らない";

  button.append(title, subtitle);
  return button;
}

function getOpeningIncidentChoices() {
  return openingIncidentChoices[getProfile().id] ?? openingIncidentChoices.bancho;
}

function getPlayableIntroStartIndex(profile = getProfile()) {
  return profile.intro.length > 1 ? 1 : 0;
}

function createOpeningIncidentChoiceButton(choice) {
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.setAttribute("aria-label", `${choice.title}。${choice.subtitle}。効果: ${formatEffectSummary(choice.effects)}`);
  button.addEventListener("click", () => {
    chooseOpeningIncidentChoice(choice);
  });

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = choice.title;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = choice.subtitle;

  const effects = document.createElement("span");
  effects.className = "choice-effects";
  effects.append(...createEffectPills(choice.effects));

  button.append(title, subtitle, effects);
  return button;
}

function createEndingRecord(ending, index) {
  const unlocked = state.unlockedEndingIds.has(ending.id);
  const record = document.createElement(unlocked ? "button" : "article");
  record.className = unlocked ? "ending-record ending-record--with-image" : "ending-record ending-record--locked";
  if (unlocked) {
    record.type = "button";
    record.setAttribute("aria-label", `${ending.title}の一枚絵を全画面表示`);
    record.addEventListener("click", () => {
      openArtworkViewer(
        {
          label: "結末帳",
          title: ending.title,
          body: ending.hint,
          src: ending.artwork,
          alt: ending.artworkAlt,
        },
        "endingBook",
      );
    });

    const image = document.createElement("img");
    image.className = "ending-record__image";
    image.src = ending.artwork;
    image.alt = ending.artworkAlt;
    image.loading = "lazy";
    image.decoding = "async";
    record.append(image);
  }

  const title = document.createElement("p");
  title.className = "ending-record__title";
  title.textContent = unlocked ? `${index + 1}. ${ending.title}` : `${index + 1}. ？？？`;

  const body = document.createElement("p");
  body.className = "ending-record__body";
  body.textContent = unlocked ? ending.hint : getLockedEndingHint(ending);

  record.append(title, body);
  return record;
}

function getLockedEndingHint(ending) {
  const hintByType = {
    passed: "学力も人望もメンツもそろえて校門へ。",
    lonely: "学力は届く。でも校門に誰がいる？",
    waitlist: "点数は少し足りない。仲間が残る道。",
    legend: "合格より校内の名を残す道。",
    failed: "全部が少しずつ噛み合わなかった道。",
  };
  const endingType = ending.id.split("-").pop();
  return hintByType[endingType] ?? "まだ見ていない結末。";
}

function createProfileButton(profile) {
  const button = document.createElement("button");
  button.className = "choice-button choice-button--school choice-button--profile";
  button.type = "button";
  button.setAttribute("aria-label", `${profile.title}。${profile.routeTitle}。${profile.subtitle}`);
  button.addEventListener("click", () => {
    startProfileSelection(profile);
  });

  const preview = document.createElement("span");
  preview.className = "profile-preview";

  const image = document.createElement("img");
  image.className = `profile-preview__image profile-preview__image--${profile.id}`;
  image.src = profile.sprite;
  image.alt = "";
  image.decoding = "async";

  preview.append(image);

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = profile.routeTitle;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = profile.subtitle;

  const line = document.createElement("span");
  line.className = "school-requirements";
  line.textContent = `学力${profile.initialStats.academics} / 人望${profile.initialStats.trust} / メンツ${profile.initialStats.face} / ルックス${profile.initialStats.looks} / 体力${profile.initialStats.stamina}`;

  button.append(preview, title, subtitle, line);
  return button;
}

function createTargetSchoolButton(school) {
  const selected = getPendingTargetSchool().id === school.id;
  const button = document.createElement("button");
  button.className = `choice-button choice-button--school choice-button--target-option${selected ? " choice-button--selected" : ""}`;
  button.type = "button";
  button.setAttribute("aria-pressed", String(selected));
  button.setAttribute(
    "aria-label",
    `${school.name}を候補にする。偏差値${school.deviation}。${school.subtitle}`,
  );
  button.addEventListener("click", () => {
    previewTargetSchool(school);
  });

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = school.name;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = school.subtitle;

  const line = document.createElement("span");
  line.className = "school-requirements";
  line.textContent = `偏差値${school.deviation} / ${selected ? "選択中" : "候補を見る"}`;

  button.append(title, subtitle, line);
  return button;
}

function createTargetSchoolDetail(school) {
  const detail = document.createElement("article");
  detail.className = "target-school-detail";

  const label = document.createElement("p");
  label.className = "target-school-detail__label";
  label.textContent = "選択中の勝ち筋";

  const title = document.createElement("p");
  title.className = "target-school-detail__title";
  title.textContent = `${school.name} / 偏差値${school.deviation}`;

  const body = document.createElement("p");
  body.className = "target-school-detail__body";
  body.textContent = `${school.subtitle}。合格ラインは学力${school.passAcademic}+、人望${school.passTrust}+、メンツ${school.passFace}+。`;

  const waitlist = document.createElement("p");
  waitlist.className = "target-school-detail__body";
  waitlist.textContent = `補欠は学力${school.waitlistAcademic}+を前提に、人望${school.waitlistTrust}+、メンツ${school.waitlistFace}+で校門前に残る道。`;

  detail.append(label, title, body, waitlist);
  return detail;
}

function getPendingTargetSchool() {
  return targetSchools.find((school) => school.id === state.pendingTargetSchoolId) ?? targetSchools[0];
}

function unlockEnding(endingId) {
  if (state.unlockedEndingIds.has(endingId)) {
    return;
  }

  state.unlockedEndingIds.add(endingId);
  saveUnlockedEndings();
}

function unlockEventCg(eventId) {
  if (state.unlockedEventCgIds.has(eventId)) {
    return;
  }

  state.unlockedEventCgIds.add(eventId);
  saveUnlockedEventCgs();
}

function loadUnlockedEndings() {
  try {
    const raw = window.localStorage.getItem(ENDING_STORAGE_KEY);
    const values = raw ? JSON.parse(raw) : [];
    const knownIds = new Set(endingCatalog.map((ending) => ending.id));
    return new Set(values.filter((id) => knownIds.has(id)));
  } catch {
    return new Set();
  }
}

function loadUnlockedEventCgs() {
  try {
    const raw = window.localStorage.getItem(EVENT_CG_STORAGE_KEY);
    const values = raw ? JSON.parse(raw) : [];
    const knownIds = new Set(getEventGalleryCatalog().map((event) => event.id));
    const legacyIds = new Set(seasonalEvents.map((event) => event.id));
    const normalized = values.flatMap((id) => {
      if (!legacyIds.has(id)) {
        return [id];
      }
      return protagonistProfiles.map((profile) => getEventGalleryId(id, profile.id));
    });
    return new Set(normalized.filter((id) => knownIds.has(id)));
  } catch {
    return new Set();
  }
}

function loadStudyReviewRecords() {
  try {
    const raw = window.localStorage.getItem(STUDY_REVIEW_STORAGE_KEY);
    const values = raw ? JSON.parse(raw) : [];
    const records = values
      .filter((record) => isStudyQuestionId(record.id))
      .map((record) => [
        record.id,
        {
          id: record.id,
          attempts: Math.max(1, Number(record.attempts) || 1),
          correct: clamp(Number(record.correct) || 0, 0, Math.max(1, Number(record.attempts) || 1)),
          lastAnswerIndex: Number.isInteger(record.lastAnswerIndex) ? record.lastAnswerIndex : 0,
          lastCorrect: Boolean(record.lastCorrect),
          lastAnsweredAt: typeof record.lastAnsweredAt === "string" ? record.lastAnsweredAt : "",
        },
      ]);
    return new Map(records);
  } catch {
    return new Map();
  }
}

function loadCurrentRunSummary() {
  const saved = loadCurrentRun();
  if (!saved) {
    return null;
  }

  return {
    turn: Math.min(saved.totalTurns, saved.turn + 1),
    totalTurns: saved.totalTurns,
    profileTitle: saved.profile?.title ?? "受験生",
    schoolName: saved.targetSchool?.name ?? "志望校未定",
    savedAt: saved.savedAt,
  };
}

function loadCurrentRun() {
  try {
    const raw = window.localStorage.getItem(CURRENT_RUN_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return hydrateCurrentRun(JSON.parse(raw));
  } catch {
    return null;
  }
}

function continueCurrentRun() {
  const saved = loadCurrentRun();
  if (!saved) {
    state.savedRunSummary = null;
    render();
    return;
  }

  cancelVoice();
  Object.assign(state, saved);
  setCharacterSprite(getProfile());
  render();
}

function saveCurrentRun() {
  if (!state.profile || state.screen === "profile" || state.screen === "ending") {
    return;
  }

  try {
    window.localStorage.setItem(CURRENT_RUN_STORAGE_KEY, JSON.stringify(serializeCurrentRun()));
    state.savedRunSummary = loadCurrentRunSummary();
  } catch {
    // Current-run save is a convenience feature; the turn should continue even when storage is unavailable.
  }
}

function clearCurrentRun() {
  try {
    window.localStorage.removeItem(CURRENT_RUN_STORAGE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
  state.savedRunSummary = null;
}

function serializeCurrentRun() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    turn: state.turn,
    totalTurns: state.totalTurns,
    stats: state.stats,
    usedCardIds: [...state.usedCardIds],
    log: state.log.slice(-40),
    complete: state.complete,
    screen: getSavableScreen(),
    introIndex: state.introIndex,
    openingChoiceId: state.openingChoiceId,
    pendingResult: state.pendingResult,
    pendingStudyQuiz: state.pendingStudyQuiz
      ? {
          cardId: state.pendingStudyQuiz.card.id,
          cardEffects: state.pendingStudyQuiz.cardEffects,
          question: state.pendingStudyQuiz.question,
        }
      : null,
    studyQuizStreak: state.studyQuizStreak,
    studyQuizSkipCount: state.studyQuizSkipCount,
    profileId: state.profile?.id ?? null,
    targetSchoolId: state.targetSchool?.id ?? null,
    characterCentered: state.characterCentered,
    looksContextIntroduced: state.looksContextIntroduced,
    shortGoalPlan: state.shortGoalPlan,
  };
}

function hydrateCurrentRun(saved) {
  if (!saved || saved.version !== 1) {
    return null;
  }

  const profile = protagonistProfiles.find((candidate) => candidate.id === saved.profileId);
  if (!profile) {
    return null;
  }

  const targetSchool = targetSchools.find((candidate) => candidate.id === saved.targetSchoolId) ?? null;
  const pendingCard = cards.find((card) => card.id === saved.pendingStudyQuiz?.cardId);
  const pendingQuestion = getStudyQuestionById(saved.pendingStudyQuiz?.question?.id);
  const pendingResult = sanitizeSavedPendingResult(saved.pendingResult);
  const screen = getValidSavedScreen(saved.screen, targetSchool, {
    hasPendingResult: Boolean(pendingResult),
    hasPendingStudyQuiz: Boolean(pendingCard && pendingQuestion),
  });

  return {
    turn: clamp(Number(saved.turn) || 0, 0, Number(saved.totalTurns) || TOTAL_TURNS),
    totalTurns: Number(saved.totalTurns) || targetSchool?.totalTurns || TOTAL_TURNS,
    stats: sanitizeSavedStats(saved.stats, profile),
    usedCardIds: new Set(Array.isArray(saved.usedCardIds) ? saved.usedCardIds.filter((id) => cards.some((card) => card.id === id)) : []),
    log: Array.isArray(saved.log) ? saved.log.filter((entry) => typeof entry === "string").slice(-40) : [],
    complete: Boolean(saved.complete),
    screen,
    introIndex: clamp(Number(saved.introIndex) || getPlayableIntroStartIndex(profile), 0, Math.max(0, profile.intro.length - 1)),
    pendingResult: (screen === "result" || screen === "openingResult" || screen === "targetConfirm") && pendingResult ? pendingResult : null,
    pendingStudyQuiz:
      screen === "studyQuiz" && pendingCard && pendingQuestion
        ? {
            card: pendingCard,
            cardEffects: sanitizeSavedEffects(saved.pendingStudyQuiz.cardEffects),
            question: pendingQuestion,
          }
        : null,
    studyQuizStreak: clamp(Number(saved.studyQuizStreak) || 0, 0, 999),
    studyQuizSkipCount: clamp(Number(saved.studyQuizSkipCount) || 0, 0, 999),
    profile,
    pendingProfile: null,
    targetSchool,
    pendingTargetSchoolId: null,
    openingChoiceId: typeof saved.openingChoiceId === "string" ? saved.openingChoiceId : null,
    returnScreen: screen,
    artworkViewer: null,
    artworkReturnScreen: "endingBook",
    characterCentered: Boolean(saved.characterCentered),
    profileSelectionLocked: false,
    profileSelectionToken: 0,
    endingBookRenderKey: "",
    eventGalleryRenderKey: "",
    studyReviewRenderKey: "",
    menuOpen: false,
    looksContextIntroduced: Boolean(saved.looksContextIntroduced),
    shortGoalPlan: sanitizeSavedShortGoalPlan(saved.shortGoalPlan, targetSchool),
    savedRunSummary: null,
  };
}

function sanitizeSavedShortGoalPlan(plan, targetSchool) {
  if (!targetSchool || !plan || typeof plan !== "object") {
    return null;
  }

  const startTurn = clamp(Number(plan.startTurn) || 0, 0, targetSchool.totalTurns);
  const dueTurn = clamp(Number(plan.dueTurn) || Math.min(targetSchool.totalTurns, startTurn + 12), 0, targetSchool.totalTurns);
  const academicTarget = clamp(Number(plan.academicTarget) || 0, 0, 100);
  if (!academicTarget || dueTurn <= startTurn) {
    return null;
  }

  return {
    startTurn,
    dueTurn,
    academicTarget,
    startStats: sanitizeShortGoalStartStats(plan.startStats),
  };
}

function sanitizeShortGoalStartStats(stats) {
  if (!stats || typeof stats !== "object") {
    return null;
  }

  return {
    academics: clamp(Number(stats?.academics) || 0, 0, 100),
    trust: clamp(Number(stats?.trust) || 0, 0, 100),
    stamina: clamp(Number(stats?.stamina) || 0, 0, 100),
    stress: clamp(Number(stats?.stress) || 0, 0, 100),
  };
}

function getSavableScreen() {
  if (state.screen === "endingBook" || state.screen === "eventGallery" || state.screen === "studyReview" || state.screen === "artworkViewer") {
    return state.returnScreen || "choices";
  }

  return state.screen;
}

function getValidSavedScreen(screen, targetSchool, guards = {}) {
  const allowed = new Set(["opening", "openingResult", "intro", "target", "targetConfirm", "choices", "result", "studyQuiz"]);
  if (!allowed.has(screen)) {
    return targetSchool ? "choices" : "target";
  }

  if (screen === "openingResult" && !guards.hasPendingResult) {
    return "target";
  }

  if (screen === "targetConfirm" && (!targetSchool || !guards.hasPendingResult)) {
    return targetSchool ? "choices" : "target";
  }

  if ((screen === "choices" || screen === "result" || screen === "studyQuiz") && !targetSchool) {
    return "target";
  }

  if (screen === "result" && !guards.hasPendingResult) {
    return targetSchool ? "choices" : "target";
  }

  if (screen === "studyQuiz" && !guards.hasPendingStudyQuiz) {
    return targetSchool ? "choices" : "target";
  }

  return screen;
}

function sanitizeSavedStats(stats, profile) {
  const base = { ...profile.initialStats };
  for (const key of Object.keys(statLabels)) {
    base[key] = clamp(Number(stats?.[key]) || 0, 0, 100);
  }
  return base;
}

function sanitizeSavedEffects(effects) {
  const sanitized = {};
  for (const key of Object.keys(statLabels)) {
    sanitized[key] = Number(effects?.[key]) || 0;
  }
  return sanitized;
}

function sanitizeSavedPendingResult(result) {
  if (!result || typeof result !== "object") {
    return null;
  }

  const seasonalRoute = findSeasonalRouteByArtwork(result.artwork);
  const canRestoreEventChoices = seasonalRoute && Array.isArray(result.eventChoices) && result.eventChoices.length > 0;

  return {
    speaker: typeof result.speaker === "string" ? result.speaker.slice(0, 80) : getProfile().title,
    sceneTag: typeof result.sceneTag === "string" ? result.sceneTag.slice(0, 80) : sceneNameForTurn(),
    text: typeof result.text === "string" ? result.text.slice(0, 4000) : "",
    artwork: seasonalRoute ? seasonalRoute.artwork : null,
    artworkAlt: seasonalRoute ? seasonalRoute.artworkAlt : "",
    eventChoices: canRestoreEventChoices ? seasonalRoute.choices : null,
    shouldScrollToBranch: false,
  };
}

function findSeasonalRouteByArtwork(artwork) {
  if (typeof artwork !== "string") {
    return null;
  }

  for (const event of seasonalEvents) {
    for (const profile of protagonistProfiles) {
      const route = getSeasonalEventRoute(event, profile.id);
      if (route.artwork === artwork) {
        return route;
      }
    }
  }

  return null;
}

function saveUnlockedEndings() {
  try {
    window.localStorage.setItem(ENDING_STORAGE_KEY, JSON.stringify([...state.unlockedEndingIds]));
  } catch {
    // Ending completion is optional local progress; gameplay should continue even if storage is unavailable.
  }
}

function saveUnlockedEventCgs() {
  try {
    window.localStorage.setItem(EVENT_CG_STORAGE_KEY, JSON.stringify([...state.unlockedEventCgIds]));
  } catch {
    // Event CG collection is optional local progress; gameplay should continue even if storage is unavailable.
  }
}

function saveStudyReviewRecords() {
  try {
    window.localStorage.setItem(STUDY_REVIEW_STORAGE_KEY, JSON.stringify(getStudyReviewRecords()));
  } catch {
    // Study review is optional local progress; gameplay should continue even if storage is unavailable.
  }
}

function getStudyReviewRecords() {
  return [...state.studyReviewRecords.values()].sort((a, b) => {
    if (!a.lastAnsweredAt && !b.lastAnsweredAt) {
      return a.id.localeCompare(b.id);
    }
    return String(b.lastAnsweredAt).localeCompare(String(a.lastAnsweredAt));
  });
}

function recordStudyQuestion(question, answerIndex, correct) {
  const previous = state.studyReviewRecords.get(question.id);
  const attempts = (previous?.attempts ?? 0) + 1;
  const nextRecord = {
    id: question.id,
    attempts,
    correct: (previous?.correct ?? 0) + (correct ? 1 : 0),
    lastAnswerIndex: answerIndex,
    lastCorrect: correct,
    lastAnsweredAt: new Date().toISOString(),
  };
  state.studyReviewRecords.set(question.id, nextRecord);
  saveStudyReviewRecords();
  state.studyReviewRenderKey = "";
}

function createChoiceButton(card) {
  const cardCopy = getRouteCardCopy(card);
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.setAttribute("aria-label", `${cardCopy.title}。${cardCopy.subtitle}。効果: ${formatEffectSummary(card.effects)}`);
  button.addEventListener("click", () => {
    chooseCard(card);
  });

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = cardCopy.title;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = cardCopy.subtitle;

  const effects = document.createElement("span");
  effects.className = "choice-effects";
  effects.append(...createEffectPills(card.effects));

  button.append(title, subtitle, effects);
  return button;
}

function getRouteCardCopy(card) {
  if (card.id === "ramen_meeting" && getProfile().id === "gyaru") {
    return {
      title: "仲間とマクド会議",
      subtitle: "ポテトより厚い友情",
      flavor: "ポテトの塩気で進路相談と恋バナを聞く。参考書は、今日はちょっと薄味だ。",
      resultLead: "紙袋の底に、熱い団結が残った。",
    };
  }

  return {
    title: card.title,
    subtitle: card.subtitle,
    flavor: card.flavor,
    resultLead: card.resultLead,
  };
}

function renderStats() {
  const forecast = getOutcomeForecast();
  elements.statsHud.setAttribute(
    "aria-label",
    `現在のステータス。${formatStatsForSpeech()}。${buildTargetSchoolSpeech()}。${forecast?.speech ?? ""}。${elements.turnText.textContent}`,
  );
  elements.statsGrid.replaceChildren(
    ...Object.entries(statLabels).map(([key, label]) => {
      const row = document.createElement("div");
      row.className = "stat-row";
      const helpText = statHelpText[key];
      row.setAttribute("aria-label", helpText ? `${label} ${state.stats[key]}。${helpText}` : `${label} ${state.stats[key]}`);
      if (helpText) {
        row.title = helpText;
      }

      const name = document.createElement("span");
      name.className = "stat-name";
      name.textContent = label;

      const meter = document.createElement("span");
      meter.className = "meter";
      meter.setAttribute("aria-hidden", "true");

      const fill = document.createElement("span");
      fill.className = key === "stress" ? "meter__fill meter__fill--danger" : "meter__fill";
      fill.style.setProperty("--value", `${state.stats[key]}%`);
      meter.append(fill);

      const value = document.createElement("span");
      value.className = "stat-value";
      value.textContent = String(state.stats[key]).padStart(2, "0");

      row.append(name, meter, value);
      return row;
    }),
  );

  renderForecastPanel(forecast);
}

function renderForecastPanel(forecast) {
  elements.forecastPanel.replaceChildren();
  elements.forecastPanel.hidden = !forecast;
  if (!forecast) {
    return;
  }

  const badge = document.createElement("p");
  badge.className = `forecast-badge forecast-badge--${forecast.tone}`;
  badge.textContent = forecast.label;

  const body = document.createElement("p");
  body.className = "forecast-body";
  body.textContent = forecast.body;

  const detail = document.createElement("p");
  detail.className = "forecast-detail";
  detail.textContent = forecast.detail;

  elements.forecastPanel.append(badge, body, detail);
}

function getOutcomeForecast() {
  const school = getTargetSchool();
  if (!school || state.screen === "profile" || state.screen === "intro" || state.screen === "target") {
    return null;
  }

  const s = state.stats;
  const profile = getProfile();
  const isGyaru = profile.id === "gyaru";
  const academicGap = Math.max(0, school.passAcademic - s.academics);
  const trustGap = Math.max(0, school.passTrust - s.trust);
  const faceGap = Math.max(0, school.passFace - s.face);
  const waitlistAcademicGap = Math.max(0, school.waitlistAcademic - s.academics);
  const waitlistTrustGap = Math.max(0, school.waitlistTrust - s.trust);
  const waitlistFaceGap = Math.max(0, school.waitlistFace - s.face);
  const risks = getImmediateRiskLabels();
  const weeksLeft = Math.max(0, state.totalTurns - state.turn);

  let label = isGyaru ? "優等生ギャル合格圏" : "合格番長圏";
  let tone = "success";
  let body = "学力、人望、メンツは志望校の主ルート条件を満たしている。";

  if (academicGap === 0 && (trustGap > 0 || faceGap > 0)) {
    label = "孤独な合格圏";
    tone = "warning";
    body = `学力は届いているが、仲間との条件が不足。人望あと${trustGap}、メンツあと${faceGap}。`;
  } else if (academicGap > 0 && waitlistAcademicGap === 0 && waitlistTrustGap === 0 && waitlistFaceGap === 0) {
    label = isGyaru ? "補欠ギャル伝説圏" : "補欠の伝説圏";
    tone = "warning";
    body = "補欠ラインと仲間条件は見えている。主ルートには学力の積み増しが必要。";
  } else if (academicGap > 0 || trustGap > 0 || faceGap > 0) {
    const stillEarly = weeksLeft > 72;
    label = stillEarly ? "準備圏" : "危険圏";
    tone = stillEarly ? "warning" : "danger";
    body = `主ルート不足: 学力あと${academicGap}、人望あと${trustGap}、メンツあと${faceGap}。`;
  }

  if (risks.length) {
    tone = tone === "success" ? "warning" : tone;
    body = `${body} 直近リスク: ${risks.join("、")}。`;
  }

  const detail = `${school.name} 偏差値${school.deviation} / 残り${weeksLeft}週 / 補欠不足: 学力${waitlistAcademicGap}, 人望${waitlistTrustGap}, メンツ${waitlistFaceGap}`;

  return {
    label,
    tone,
    body,
    detail,
    speech: `${label}。${body}。${detail}`,
  };
}

function getImmediateRiskLabels() {
  const risks = [];
  if (state.stats.stress >= 72) {
    risks.push("ストレス過多");
  }
  if (state.stats.stamina <= 12) {
    risks.push("体力不足");
  }
  if (state.stats.looks <= 35) {
    risks.push("ルックス低下");
  }
  return risks;
}

function createEffectPills(effects) {
  return Object.entries(statLabels)
    .filter(([key]) => effects[key])
    .map(([key, label]) => {
      const value = effects[key];
      const pill = document.createElement("span");
      pill.className = value < 0 ? "effect-pill effect-pill--risk" : "effect-pill";
      pill.textContent = `${label}${value > 0 ? "+" : ""}${value}`;
      return pill;
    });
}

function buildChoicePrompt() {
  const profile = getProfile();
  const entry = getCalendarEntry();
  if (state.turn === 0) {
    const school = getTargetSchool();
    const shortGoal = buildInitialShortGoal(profile.id);
    return profile.id === "gyaru"
      ? `${school.name}を目指す三年間が始まる。\n${shortGoal}\n友情も偏差値も、ここから盛ってく。`
      : `${school.name}を目指す三年間が始まる。\n${shortGoal}\n番長としての義理も、志望校への道も、ここから選び取るしかねえ。`;
  }

  if (isLateStage()) {
    return profile.id === "gyaru"
      ? `${getTargetSchool().name}の本番が近い。\n友だちの通知も赤本の重みも、ぜんぶ背中に乗ってる。今週どう盛る？`
      : `${getTargetSchool().name}の本番が近い。\n仲間の視線も、赤本の重みも、背中に乗っている。今週をどう使う？`;
  }

  return profile.id === "gyaru"
    ? `${entry.label}。\n教室には友だちの声、鞄には参考書。ギャルとして、受験生として、今週の予定を選べ。`
    : `${entry.label}。\n廊下には仲間の声、鞄には参考書。番長として、受験生として、今週の予定を選べ。`;
}

function sceneNameForTurn() {
  const entry = getCalendarEntry();
  return isLateStage() ? `${entry.label}・受験直前` : entry.label;
}

function buildInitialShortGoal(profileId) {
  if (!state.shortGoalPlan) {
    state.shortGoalPlan = createShortGoalPlan(0);
  }

  const targetAcademic = state.shortGoalPlan.academicTarget;
  if (profileId === "gyaru") {
    return `12週目標: まずは学力${targetAcademic}。ミナを放っておかず、でも自分の机も空けすぎない。`;
  }

  return `12週目標: まずは学力${targetAcademic}。徹平への借りも、体力も、全部は抱えるな。`;
}

function getShortGoalAcademicStep(school, cycleIndex = 0) {
  if (cycleIndex >= 8) {
    return school.deviation >= 68 ? 8 : 7;
  }
  if (cycleIndex >= 4) {
    return school.deviation >= 68 ? 10 : 8;
  }
  if (school.deviation >= 70) {
    return 14;
  }
  if (school.deviation >= 64) {
    return 12;
  }
  return 10;
}

function formatEffectSentence(effects, options = {}) {
  const parts = Object.entries(statLabels)
    .filter(([key]) => effects[key])
    .map(([key, label]) => `${label}${effects[key] > 0 ? "+" : ""}${effects[key]}`);
  const looksContext = options.explainLooks ? consumeLooksEffectContext(effects) : "";
  return parts.length ? `${looksContext}\n[${parts.join(" / ")}]` : "";
}

function consumeLooksEffectContext(effects) {
  const looks = Number(effects.looks) || 0;
  if (!looks) {
    return "";
  }

  const isFirstContext = !state.looksContextIntroduced;
  state.looksContextIntroduced = true;
  if (isFirstContext) {
    return looks > 0
      ? "\n髪、制服、表情、声の余裕。全部そろうと、教室の見られ方まで変わる。顔立ちだけの話じゃない。"
      : "\n顔立ちは変わらない。けれど寝不足、乱れた制服、余裕のない声を、教室は先に見る。";
  }

  return looks > 0 ? `\n${pickLooksContextLine(positiveLooksContextLines())}` : `\n${pickLooksContextLine(negativeLooksContextLines())}`;
}

function pickLooksContextLine(lines) {
  const index = Math.abs((state.turn || 0) + state.stats.looks + state.stats.stress) % lines.length;
  return lines[index];
}

function positiveLooksContextLines() {
  return [
    "髪も制服も整った。声に余裕が戻ると、廊下の反応まで少し変わる。",
    "顔が強いだけじゃない。今日は声も姿勢も崩れていない。視線が、味方寄りに変わる。",
    "表情が整った。話しかける前の距離が、少しだけ近くなる。",
  ];
}

function negativeLooksContextLines() {
  return [
    "目元の疲れは隠れない。今日は、話しかけられる前に距離を置かれた。",
    "顔立ちは変わらない。でも疲れた声と乱れた制服を、教室は先に見る。",
    "焦りが表情に出た。教室の視線は、事情より先に見た目を拾う。",
  ];
}

function formatEffectSummary(effects) {
  return Object.entries(statLabels)
    .filter(([key]) => effects[key])
    .map(([key, label]) => `${label}${effects[key] > 0 ? "プラス" : "マイナス"}${Math.abs(effects[key])}`)
    .join("、");
}

function formatStatsForSpeech() {
  return Object.entries(statLabels)
    .map(([key, label]) => `${label}${state.stats[key]}`)
    .join("、");
}

function buildTurnText() {
  if (state.screen === "endingBook") {
    return `結末帳 / ${state.unlockedEndingIds.size}/${endingCatalog.length}`;
  }

  if (state.screen === "eventGallery") {
    return `回想帳 / ${state.unlockedEventCgIds.size}/${getEventGalleryCatalog().length}`;
  }

  if (state.screen === "studyReview") {
    return `復習帳 / ${state.studyReviewRecords.size}/${studyQuizTotalQuestionCount}`;
  }

  if (state.screen === "artworkViewer") {
    return `一枚絵 / ${state.artworkViewer?.title ?? ""}`;
  }

  if (state.screen === "profile") {
    return "主人公選択 / 入学式";
  }

  if (state.screen === "intro") {
    return "1年春 / 入学式";
  }

  if (state.screen === "opening" || state.screen === "openingResult") {
    return `${getProfile().title} / 最初の選択`;
  }

  if (state.screen === "target" || !state.targetSchool) {
    return `${getProfile().title} / 志望校選択`;
  }

  if (state.screen === "studyQuiz") {
    const question = state.pendingStudyQuiz?.question;
    return `五科目チェック / ${question?.subject ?? "学習"} / ${state.targetSchool.name}`;
  }

  const entry = getCalendarEntry();
  return `${entry.label} / ${Math.min(state.turn + 1, state.totalTurns)}/${state.totalTurns} / ${state.targetSchool.name} 偏差値${state.targetSchool.deviation}`;
}

function buildTargetSchoolSpeech() {
  const school = getTargetSchool();
  if (!school) {
    return "志望校は未選択";
  }

  return `志望校${school.name}、偏差値${school.deviation}、必要学力${school.passAcademic}、必要な人望${school.passTrust}、必要なメンツ${school.passFace}`;
}

function getTargetSchool() {
  return state.targetSchool;
}

function getProfile() {
  return state.profile ?? protagonistProfiles[0];
}

function getSeasonalEventRoute(event, profileId = getProfile().id) {
  return event.routes?.[profileId] ?? {
    speaker: event.speaker,
    text: event.text,
    artwork: event.artwork,
    artworkAlt: event.artworkAlt,
    choices: [],
  };
}

function getEventGalleryId(eventId, profileId) {
  return `${eventId}:${profileId}`;
}

function getEventGalleryCatalog() {
  return seasonalEvents.flatMap((event) =>
    protagonistProfiles.map((profile) => {
      const route = getSeasonalEventRoute(event, profile.id);
      return {
        id: getEventGalleryId(event.id, profile.id),
        title: `${event.title} / ${profile.title}`,
        hint: `${profile.title}ルート: ${event.hint}`,
        artwork: route.artwork,
        artworkAlt: route.artworkAlt,
      };
    }),
  );
}

function isLateStage() {
  return state.targetSchool && state.turn >= state.totalTurns - 24;
}

function buildCardReaction(card) {
  const profile = getProfile();
  if (profile.id === "gyaru") {
    const reactions = {
      study_library:
        "\nミナ「そのノート、色だけじゃなくて中身も強いね。私、受験ってまだ遠いと思ってた」\n優等生ギャル「遠くても、見てるなら近づくし。うちは今日の課題を進める。」",
      cram_school:
        "\n鬼塚先生「説教は3分。進路資料は本気で見る」\n優等生ギャル「その爪で国立志望？って言われるなら、答案で黙らせます。」",
      ramen_meeting:
        "\nミナ「置いていかれるの、ちょっと怖い。でも、見てるだけの自分も嫌かも」\n優等生ギャル「じゃあ最初は見てて。やりたくなったら横あける。」",
      rescue_fight:
        "\n黒羽レン「口だけで止められると思ってんの？」\n優等生ギャル「口で止まるなら、そっちの方が強いじゃん。友だちの前で荒れた顔は見せない。」",
      sleep_early:
        "\nミナ「今日は寝な。声がもう余裕ない。私の不安まで背負って潰れないで」\n優等生ギャル「明日の答案も、顔も、雑にしたくないし寝る。」",
      mock_exam:
        "\n黒羽レン「その志望校、その見た目で本気なんだ」\n優等生ギャル「見た目込みで本気。点数表にもそう書かせる。」\n黒羽レンは笑ったが、答案の見直しだけはいつもより長かった。",
      final_sprint:
        "\n鬼塚先生「最後の夜ほど、顔に焦りが出る。雑な返事で友だちまで削るな」\nミナ「終わったら、私の過去問も見て。私も逃げないから。今度は待つだけにしない。」",
    };
    return reactions[card.id] ?? "";
  }

  const reactions = {
    study_library:
      "\n徹平「番長、俺、名前だけ普通科で中身は補習科っす。でも暗記カードだけは作れるっす」\n受験番長「なら隣で作れ。逃げる手じゃなく、覚える手にしろ。」",
    cram_school:
      "\n鬼塚先生「説教は3分。進路指導は本気でやる」\n徹平「番長が頭下げるなら、俺も数学9点から逃げないっす。補習、明日は自分で行くっす。」",
    ramen_meeting:
      "\n徹平「親に進路希望票を見せるの、まだ怖いっす」\n受験番長「ラーメン伸びる前に作戦立てるぞ。逃げ癖まで替え玉するな。」",
    rescue_fight:
      "\n黒羽レン「拳を出さずに済ませる気か。番長の看板、軽いな」\n受験番長「殴らず収める方が重い日もある。今日はそっちで通す。」",
    sleep_early:
      "\n徹平「番長、俺の通知スルーっすか」\n受験番長「朝イチで返す。寝不足の返事で、お前の進路まで雑に扱いたくねえ。」\n徹平は不満そうだが、補習プリントだけは鞄に入れた。",
    mock_exam:
      "\n黒羽レン「番長の点数表、校門に貼ったら伝説になるかもな」\n受験番長「貼るなら合格点にしてから貼れ。俺がそこまで上げる。」\n黒羽レンは煽ったあと、こちらの解き直しを黙って見ていた。",
    final_sprint:
      "\n鬼塚先生「最後の夜に義理を全部拾うな。落とした約束は、合格後に拾え」\n徹平「番長、俺も赤点から逃げないっす。補習は自分で行くんで、今日は赤本行ってください。」",
  };
  return reactions[card.id] ?? "";
}

function getCardSpeaker(card) {
  if (getProfile().id !== "gyaru") {
    return card.speaker;
  }

  if (card.tag === "teacher") {
    return "生活指導の先生";
  }

  if (card.tag === "social") {
    return "友だち";
  }

  if (card.tag === "exam") {
    return card.id === "mock_exam" ? "模試監督" : "優等生ギャル";
  }

  return "優等生ギャル";
}

function createSchoolCalendar() {
  const months = [
    { month: 4, term: "1学期", bgm: termBgm.first },
    { month: 5, term: "1学期", bgm: termBgm.first },
    { month: 6, term: "1学期", bgm: termBgm.first },
    { month: 7, term: "1学期", bgm: termBgm.first },
    { month: 8, term: "夏休み", bgm: termBgm.summerBreak },
    { month: 9, term: "2学期", bgm: termBgm.second },
    { month: 10, term: "2学期", bgm: termBgm.second },
    { month: 11, term: "2学期", bgm: termBgm.second },
    { month: 12, term: "2学期", bgm: termBgm.second },
    { month: 1, term: "3学期", bgm: termBgm.third },
    { month: 2, term: "3学期", bgm: termBgm.third },
    { month: 3, term: "3学期", bgm: termBgm.third },
  ];
  const eventsByMonthWeek = {
    "4-1": "始業式",
    "4-2": "新歓",
    "5-3": "中間テスト",
    "6-2": "体育祭",
    "7-4": "期末テスト",
    "8-1": "夏休み",
    "9-3": "文化祭",
    "10-2": "模試",
    "11-2": "進路面談",
    "12-4": "冬休み",
    "2-2": "学年末テスト",
    "3-4": "春休み前",
  };

  const entries = [];
  for (let year = 1; year <= 3; year += 1) {
    for (const item of months) {
      for (let week = 1; week <= 4; week += 1) {
        const event =
          year === 1 && item.month === 4 && week === 1
            ? "入学式"
            : eventsByMonthWeek[`${item.month}-${week}`] ?? "";
        const labelParts = [`${year}年${item.term}`, `${item.month}月第${week}週`];
        if (event) {
          labelParts.push(event);
        }
        entries.push({
          ...item,
          week,
          event,
          label: labelParts.join("・"),
        });
      }
    }
  }

  entries[entries.length - 1] = {
    year: 3,
    month: 3,
    week: 4,
    term: "3学期",
    event: "卒業式",
    bgm: termBgm.third,
    label: "3年3学期・3月第4週・卒業式",
  };
  return entries;
}

function getCalendarEntry(offset = 0) {
  const index = clamp(state.turn + offset, 0, schoolCalendar.length - 1);
  return schoolCalendar[index];
}

function getSceneBgm() {
  if (state.screen === "profile" || state.screen === "intro" || state.screen === "target") {
    return termBgm.first;
  }

  return getCalendarEntry().bgm ?? GAMEPLAY_BGM_SRC;
}

function showProfileSelectSprites() {
  const [bancho, gyaru] = protagonistProfiles;
  elements.characterSprite.src = bancho.sprite;
  elements.characterSprite.className = `${bancho.spriteClass} character-sprite--profile-bancho`;
  elements.characterSprite.alt = bancho.spriteAlt;
  elements.profileCompareSprite.src = gyaru.sprite;
  elements.profileCompareSprite.className = "character-sprite character-sprite--profile-gyaru";
  elements.profileCompareSprite.alt = gyaru.spriteAlt;
  elements.profileCompareSprite.hidden = false;
}

function clearProfileSelectionAnimation() {
  state.profileSelectionLocked = false;
  state.pendingProfile = null;
  elements.novelStage.classList.remove(
    "novel-stage--profile-selecting",
    "novel-stage--selected-bancho",
    "novel-stage--selected-gyaru",
  );
  delete elements.novelStage.dataset.selectedProfile;
  elements.choiceList.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });
}

function setCharacterSprite(profile) {
  elements.profileCompareSprite.hidden = true;
  elements.profileCompareSprite.removeAttribute("src");
  elements.profileCompareSprite.alt = "";
  elements.characterSprite.src = profile.sprite;
  elements.characterSprite.className = profile.spriteClass;
  elements.characterSprite.alt = profile.spriteAlt;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function toggleBgm() {
  if (!state.bgmEnabled) {
    state.bgmEnabled = true;
    await playBgm();
    return;
  }

  state.bgmEnabled = false;
  elements.bgmAudio.pause();
  updateBgmButton();
}

function toggleSfx() {
  state.sfxEnabled = !state.sfxEnabled;
  updateSfxButton();
}

function updateSfxButton() {
  elements.sfxButton.textContent = state.sfxEnabled ? "効果音ON" : "効果音OFF";
  elements.sfxButton.setAttribute("aria-pressed", state.sfxEnabled ? "true" : "false");
}

function toggleVoice() {
  if (!voiceSupported()) {
    updateVoiceButton();
    return;
  }

  state.voiceEnabled = !state.voiceEnabled;
  state.voicePrimed = state.voiceEnabled;
  localStorage.setItem(VOICE_STORAGE_KEY, String(state.voiceEnabled));
  if (!state.voiceEnabled) {
    cancelVoice();
  } else {
    state.voicevoxAvailable = null;
    state.voicevoxSpeakersPromise = null;
    state.voiceRenderKey = "";
    queueCurrentDialogueVoice();
  }
  updateVoiceButton();
}

function primeVoiceFromUserGesture() {
  if (!state.voiceEnabled || state.voicePrimed) {
    return;
  }

  state.voicePrimed = true;
  queueCurrentDialogueVoice();
  updateVoiceButton();
}

function voiceSupported() {
  return voicevoxSupported() || speechVoiceSupported();
}

function voicevoxSupported() {
  return typeof fetch === "function" && typeof Audio === "function" && typeof URL === "function" && typeof URL.createObjectURL === "function";
}

function speechVoiceSupported() {
  return typeof window.speechSynthesis === "object" && typeof window.SpeechSynthesisUtterance === "function";
}

function updateVoiceButton() {
  if (!voiceSupported()) {
    elements.voiceButton.textContent = "VOICE 未対応";
    elements.voiceButton.disabled = true;
    elements.voiceButton.setAttribute("aria-pressed", "false");
    elements.voiceButton.title = "この環境では音声読み上げに対応していません";
    return;
  }

  elements.voiceButton.disabled = false;
  elements.voiceButton.textContent = `VOICE: ${voiceStatusLabel()}`;
  elements.voiceButton.setAttribute("aria-pressed", state.voiceEnabled ? "true" : "false");
  elements.voiceButton.title = "代替音声は動作確認用。キャラ声はVOICEVOX接続時に優先";
}

function voiceStatusLabel() {
  if (!state.voiceEnabled) {
    return "OFF";
  }
  if (state.voiceSpeaking && state.voiceBackend === "voicevox") {
    return "VOICEVOX";
  }
  if (state.voiceSpeaking && state.voiceBackend === "fallback") {
    return "代替音声（動作確認用）";
  }
  if (state.voicevoxAvailable === true) {
    return "VOICEVOX";
  }
  if (state.voicevoxAvailable === false) {
    return "代替音声（動作確認用）";
  }
  return state.voicePrimed ? "待機中" : "ON";
}

function queueCurrentDialogueVoice() {
  if (!state.voiceEnabled || !state.voicePrimed || !voiceSupported()) {
    return;
  }

  const speaker = elements.speakerName.textContent.trim();
  const text = (elements.dialogueText.dataset.voiceText || elements.dialogueText.textContent).trim();
  const voiceKey = `${state.screen}:${speaker}:${hashText(text)}`;
  if (!text || state.voiceRenderKey === voiceKey) {
    return;
  }

  state.voiceRenderKey = voiceKey;
  const lines = buildVoiceLines(speaker, text);
  if (!lines.length) {
    cancelVoice();
    return;
  }

  scheduleVoiceLines(lines);
}

function buildVoiceLines(currentSpeaker, text) {
  const lines = [];
  const sourceLines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  for (const sourceLine of sourceLines) {
    const quote = sourceLine.match(/^([^「」:：]{1,24})「(.+)」$/);
    if (quote) {
      addVoiceLine(lines, quote[1].trim(), quote[2].trim());
      continue;
    }

    if (shouldReadAsCurrentSpeaker(currentSpeaker, sourceLine)) {
      addVoiceLine(lines, currentSpeaker, sourceLine);
    }
  }
  return lines.slice(0, 8);
}

function shouldReadAsCurrentSpeaker(speaker, line) {
  if (!resolveCastId(speaker) || resolveCastId(speaker) === "narrator") {
    return false;
  }
  if (/^(得たもの|取りこぼしたもの|選択|短期目標|関係レポート|残り|第\d+章|学力|人望|メンツ|ルックス|体力|ストレス)[:：]/.test(line)) {
    return false;
  }
  if (/^[+-]?\d+$/.test(line) || /[+-]\d/.test(line)) {
    return false;
  }
  return line.length <= 90;
}

function addVoiceLine(lines, speaker, text) {
  const spokenText = normalizeSpokenText(text);
  if (!spokenText) {
    return;
  }

  const castId = resolveCastId(speaker);
  const cast = voiceCast[castId] ?? voiceCast.narrator;
  const chunks = splitSpokenText(spokenText);
  const pausePolicy = cast.pausePolicy ?? voiceCast.narrator.pausePolicy;
  chunks.forEach((chunk, index) => {
    lines.push({
      speaker,
      castId,
      text: chunk,
      phraseIndex: index,
      phraseCount: chunks.length,
      pauseAfter: index === chunks.length - 1 ? pausePolicy.final : pausePolicy.intra,
      profile: cast.fallback ?? voiceCast.narrator.fallback,
    });
  });
}

function normalizeSpokenText(text) {
  const stripped = text
    .replace(/<[^>]*>/g, "")
    .replace(/[「」]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return voicePronunciationLexicon
    .reduce((result, [displayText, voiceText]) => result.replace(new RegExp(escapeRegExp(displayText), "g"), voiceText), stripped)
    .trim();
}

function splitSpokenText(text) {
  if (text.length <= 48) {
    return [text];
  }
  const chunks = text.match(/[^。！？!?]+[。！？!?]?/g)?.map((chunk) => chunk.trim()).filter(Boolean) ?? [text];
  return chunks.flatMap((chunk) => (chunk.length <= 70 ? [chunk] : chunk.match(/.{1,60}/g) ?? [chunk]));
}

function resolveCastId(speaker = "") {
  const normalized = String(speaker).trim();
  const alias = speakerCastAliases.find((entry) => entry.pattern.test(normalized));
  return alias?.castId ?? "narrator";
}

function scheduleVoiceLines(lines) {
  cancelVoice();
  const token = state.voiceToken + 1;
  state.voiceToken = token;
  state.voiceAbortController = new AbortController();
  state.voiceTimer = window.setTimeout(() => {
    state.voiceTimer = 0;
    void speakVoiceLines(lines, token);
  }, VOICE_START_DELAY_MS);
}

async function speakVoiceLines(lines, token) {
  if (token !== state.voiceToken || !state.voiceEnabled || !state.voicePrimed) {
    return;
  }

  state.voiceSpeaking = true;
  updateBgmVolume();
  updateVoiceButton();
  if (voicevoxSupported() && state.voicevoxAvailable !== false) {
    const spokeWithVoicevox = await trySpeakVoicevoxLines(lines, token);
    if (spokeWithVoicevox) {
      state.voiceSpeaking = false;
      updateBgmVolume();
      updateVoiceButton();
      return;
    }
  }

  if (token !== state.voiceToken || !state.voiceEnabled) {
    state.voiceSpeaking = false;
    updateBgmVolume();
    updateVoiceButton();
    return;
  }
  state.voicevoxAvailable = false;
  await speakFallbackLines(lines, token);
  state.voiceSpeaking = false;
  updateBgmVolume();
  updateVoiceButton();
}

async function trySpeakVoicevoxLines(lines, token) {
  try {
    const ready = [];
    for (const line of lines) {
      const voiceStyle = await resolveVoicevoxStyle(line);
      const synthesized = await synthesizeVoicevoxLine(line, voiceStyle);
      ready.push({ line, voiceStyle, synthesized });
    }
    state.voicevoxAvailable = true;
    state.voiceBackend = "voicevox";
    updateVoiceButton();
    for (const item of ready) {
      if (token !== state.voiceToken || !state.voiceEnabled) {
        return true;
      }
      rememberVoiceDebug({ backend: "voicevox", castId: item.line.castId, speakerName: item.voiceStyle.speakerName, styleId: item.voiceStyle.id, text: item.line.text });
      await playVoicevoxAudio(item.synthesized.audioUrl, token, item.line.profile.volume);
      await delay(item.line.pauseAfter);
    }
    return true;
  } catch (error) {
    state.voicevoxAvailable = false;
    rememberVoiceDebug({ backend: "voicevox-error", message: error?.message ?? String(error) });
    return false;
  }
}

async function resolveVoicevoxStyle(line) {
  const speakers = await voicevoxSpeakers();
  const cast = voiceCast[line.castId] ?? voiceCast.narrator;
  for (const name of cast.speakerPreferences ?? []) {
    const speaker = speakers.find((candidate) => normalizedVoiceText(candidate.name).includes(normalizedVoiceText(name)));
    const style = pickVoicevoxStyle(speaker);
    if (style) {
      return { ...style, speakerName: speaker.name, speakerUuid: speaker.speaker_uuid };
    }
  }
  if (cast.strictSpeakerPreference) {
    throw new Error(`Preferred VOICEVOX speaker is unavailable for ${line.castId}`);
  }
  for (const speaker of speakers) {
    const style = pickVoicevoxStyle(speaker);
    if (style) {
      return { ...style, speakerName: speaker.name, speakerUuid: speaker.speaker_uuid };
    }
  }
  throw new Error("VOICEVOX speaker styles are unavailable");
}

function pickVoicevoxStyle(speaker) {
  const styles = (speaker?.styles ?? []).filter((style) => Number.isFinite(style.id));
  return styles.find((style) => /ノーマル|ふつう|normal/i.test(style.name ?? "")) ?? styles[0] ?? null;
}

async function synthesizeVoicevoxLine(line, voiceStyle) {
  const cacheKey = voiceCacheKey(line, voiceStyle);
  const cachedAudioUrl = state.voicevoxAudioCache.get(cacheKey);
  if (cachedAudioUrl) {
    return { audioUrl: cachedAudioUrl, cached: true };
  }
  if (state.voicevoxSynthesisPromises.has(cacheKey)) {
    return state.voicevoxSynthesisPromises.get(cacheKey);
  }

  const synthesisPromise = (async () => {
    const query = await voicevoxJson("audio_query", {
      method: "POST",
      params: { text: line.text, speaker: voiceStyle.id },
    });
    applyVoicePlanToQuery(query, line);
    const audioBlob = await voicevoxBlob("synthesis", {
      method: "POST",
      params: { speaker: voiceStyle.id },
      body: JSON.stringify(query),
    });
    const audioUrl = URL.createObjectURL(audioBlob);
    rememberVoicevoxAudio(cacheKey, audioUrl);
    return { audioUrl, cached: false };
  })();
  state.voicevoxSynthesisPromises.set(cacheKey, synthesisPromise);
  try {
    return await synthesisPromise;
  } finally {
    state.voicevoxSynthesisPromises.delete(cacheKey);
  }
}

function applyVoicePlanToQuery(query, line) {
  const cast = voiceCast[line.castId] ?? voiceCast.narrator;
  const defaults = cast.defaults ?? voiceCast.narrator.defaults;
  const isQuestion = /[？?]$/.test(line.text);
  query.speedScale = clamp(defaults.speed + (isQuestion ? 0.01 : 0), 0.82, defaults.maxRate ?? 1.12);
  query.pitchScale = clamp(defaults.pitch + (isQuestion ? 0.01 : 0), -0.06, 0.08);
  query.intonationScale = clamp(defaults.intonation + (isQuestion ? 0.08 : 0), 0.86, 1.38);
  query.volumeScale = clamp(defaults.volume, 0.72, 1);
  query.prePhonemeLength = clamp(defaults.pre + (line.phraseIndex > 0 ? 0.02 : 0), 0.02, 0.18);
  query.postPhonemeLength = clamp(defaults.post + line.pauseAfter / 2200, 0.04, 0.24);
}

async function voicevoxSpeakers() {
  state.voicevoxSpeakersPromise ??= voicevoxJson("speakers", { method: "GET" });
  return state.voicevoxSpeakersPromise;
}

async function voicevoxJson(path, options = {}) {
  const response = await voicevoxFetch(path, options);
  return response.json();
}

async function voicevoxBlob(path, options = {}) {
  const response = await voicevoxFetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  return response.blob();
}

async function voicevoxFetch(path, options = {}) {
  let lastError = null;
  for (const url of voicevoxCandidateUrls(path, options.params ?? {})) {
    try {
      const response = await fetch(url, {
        method: options.method ?? "GET",
        headers: options.headers,
        body: options.body,
        signal: state.voiceAbortController?.signal,
      });
      if (response.ok) {
        return response;
      }
      lastError = new Error(`VOICEVOX request failed: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("VOICEVOX request failed");
}

function voicevoxCandidateUrls(path, params = {}) {
  const candidates = [
    ...VOICEVOX_DIRECT_URLS.map((baseUrl) => new URL(path, `${baseUrl.replace(/\/$/, "")}/`)),
    new URL(`${VOICEVOX_PROXY_PATH}/${path}`, window.location.origin),
  ];
  for (const url of candidates) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return candidates;
}

function playVoicevoxAudio(audioUrl, token, volume) {
  return new Promise((resolve) => {
    if (token !== state.voiceToken || !state.voiceEnabled) {
      resolve();
      return;
    }
    const audio = new Audio(audioUrl);
    state.activeVoiceAudio = audio;
    audio.volume = clamp(volume, 0.2, 1);
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    void audio.play().catch(() => resolve());
  });
}

async function speakFallbackLines(lines, token) {
  if (!speechVoiceSupported()) {
    return;
  }
  state.voiceBackend = "fallback";
  updateVoiceButton();
  for (const line of lines) {
    if (token !== state.voiceToken || !state.voiceEnabled) {
      return;
    }
    rememberVoiceDebug({ backend: "fallback", castId: line.castId, speaker: line.speaker, text: line.text });
    await speakFallbackLine(line);
    await delay(line.pauseAfter);
  }
}

function speakFallbackLine(line) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = "ja-JP";
    utterance.pitch = line.profile.pitch;
    utterance.rate = line.profile.rate;
    utterance.volume = line.profile.volume;
    utterance.voice = pickSpeechVoice(line.profile);
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function pickSpeechVoice(profile) {
  const voices = window.speechSynthesis
    .getVoices()
    .filter((voice) => /^ja([-_]|$)/i.test(voice.lang) || /Japanese|日本|Kyoko|Otoya|Haruka|Ichiro/i.test(voice.name));
  if (!voices.length) {
    return null;
  }
  if (profile.gender === "male") {
    return voices.find((voice) => /Otoya|Ichiro|\bMale\b|男性/i.test(voice.name)) ?? voices[0];
  }
  if (profile.gender === "female") {
    return voices.find((voice) => /Kyoko|Haruka|Sayaka|\bFemale\b|女性/i.test(voice.name)) ?? voices[0];
  }
  return voices[0];
}

function cancelVoice() {
  state.voiceToken += 1;
  state.voiceSpeaking = false;
  state.voiceBackend = "idle";
  updateBgmVolume();
  if (state.voiceAbortController) {
    state.voiceAbortController.abort();
    state.voiceAbortController = null;
  }
  if (state.voiceTimer) {
    window.clearTimeout(state.voiceTimer);
    state.voiceTimer = 0;
  }
  if (speechVoiceSupported()) {
    window.speechSynthesis.cancel();
  }
  if (state.activeVoiceAudio) {
    state.activeVoiceAudio.pause();
    state.activeVoiceAudio.removeAttribute?.("src");
    state.activeVoiceAudio = null;
  }
  updateVoiceButton();
}

function rememberVoicevoxAudio(cacheKey, audioUrl) {
  state.voicevoxAudioCache.set(cacheKey, audioUrl);
  if (state.voicevoxAudioCache.size <= 80) {
    return;
  }
  const [oldestKey, oldestUrl] = state.voicevoxAudioCache.entries().next().value;
  URL.revokeObjectURL(oldestUrl);
  state.voicevoxAudioCache.delete(oldestKey);
}

function rememberVoiceDebug(entry) {
  state.voiceDebugLog.push({ at: Date.now(), ...entry });
  if (state.voiceDebugLog.length > 80) {
    state.voiceDebugLog.shift();
  }
}

function voiceCacheKey(line, voiceStyle) {
  return [VOICE_ACTING_VERSION, line.castId, voiceStyle.speakerUuid, voiceStyle.id, hashText(line.text)].join("|");
}

function normalizedVoiceText(value = "") {
  return String(value).normalize("NFKC").toLowerCase();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function hashText(text = "") {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function playButtonClickSound(event) {
  if (!state.sfxEnabled || !(event.target instanceof Element) || !event.target.closest("button")) {
    return;
  }

  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.045);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.08);
}

function getAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    return null;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContextConstructor();
  }

  if (state.audioContext.state === "suspended") {
    void state.audioContext.resume();
  }

  return state.audioContext;
}

function setBgmTrack(src) {
  if (state.pendingBgmSrc === src) {
    return;
  }

  state.pendingBgmSrc = src;
  if (state.bgmEnabled) {
    activateBgmTrack();
    void playBgm();
  }
}

async function playBgm() {
  activateBgmTrack();
  if (!elements.bgmAudio.getAttribute("src")) {
    updateBgmButton();
    return;
  }

  try {
    await elements.bgmAudio.play();
  } catch {
    state.bgmEnabled = false;
  }
  updateBgmButton();
}

function activateBgmTrack() {
  const src = state.pendingBgmSrc || getSceneBgm();
  if (elements.bgmAudio.getAttribute("src") === src) {
    return;
  }

  elements.bgmAudio.src = src;
  elements.bgmAudio.load();
}

function updateBgmButton() {
  elements.bgmButton.textContent = state.bgmEnabled ? "BGM ON" : "BGM OFF";
  elements.bgmButton.setAttribute("aria-pressed", state.bgmEnabled ? "true" : "false");
}

function updateBgmVolume() {
  const duckingScale = state.voiceSpeaking ? 0.65 : 1;
  elements.bgmAudio.volume = (Number(elements.volumeSlider.value) / 100) * duckingScale;
}

function scheduleLightAssetWarmup() {
  const preload = () => {
    for (const profile of protagonistProfiles) {
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "low";
      image.src = profile.sprite;
    }
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preload, { timeout: 4000 });
    return;
  }

  window.setTimeout(preload, 1200);
}
