const TOTAL_TURNS = 144;
const PROFILE_SELECT_ANIMATION_MS = 1700;

const statLabels = {
  academics: "学力",
  trust: "人望",
  face: "メンツ",
  looks: "ルックス",
  stamina: "体力",
  stress: "ストレス",
};

const ENDING_STORAGE_KEY = "jukenBancho.unlockedEndings.v1";
const GAMEPLAY_BGM_SRC = "./assets/audio/flesh-and-blood.mp3";

const termBgm = {
  first: "./assets/audio/seasons/springtechno.ogg",
  summerBreak: "./assets/audio/seasons/summer-park.mp3",
  second: "./assets/audio/seasons/autumn.ogg",
  third: "./assets/audio/seasons/wintery-loop.mp3",
};

const protagonistProfiles = [
  {
    id: "bancho",
    title: "受験番長",
    routeTitle: "目指せ合格番長",
    subtitle: "仁義とメンツを背負う硬派ルート",
    sprite: "./assets/images/protagonist-bancho-transparent.png",
    spriteClass: "character-sprite character-sprite--bancho",
    spriteAlt: "白い鉢巻きを巻き、学ラン姿で参考書とシャープペンを構える受験番長",
    initialStats: { academics: 14, trust: 60, face: 58, looks: 50, stamina: 72, stress: 20 },
    intro: [
      {
        speaker: "受験番長",
        sceneTag: "1年春・入学式",
        text: "俺の名は、受験番長。\n入学式の日から少しばかり顔が利く。仲間が困ってりゃ放っておけねえし、メンツをなくせば番長の看板も泣く。",
      },
      {
        speaker: "受験番長",
        sceneTag: "新しい教室",
        text: "だが高校三年間は長い。\n行事も、仲間との付き合いも、模試も赤本も、全部まとめて押し寄せてくる。",
      },
      {
        speaker: "受験番長",
        sceneTag: "三年計画",
        text: "毎週、俺は一つの予定を選ぶ。\n机に向かえば学力は積める。仲間と向き合えば人望やメンツは守れる。無理を重ねれば体力とルックスが削れ、焦りも腹にたまる。",
      },
      {
        speaker: "受験番長",
        sceneTag: "卒業まで三年",
        text: "卒業式の日、どんな顔で校門を出るか。\n全部まとめて背負ってこそ、番長ってもんだろ。",
      },
    ],
  },
  {
    id: "gyaru",
    title: "優等生ギャル",
    routeTitle: "目指せ優等生ギャル",
    subtitle: "マヂ情に厚い、友情も偏差値も盛るルート",
    sprite: "./assets/images/protagonists/gyaru-protagonist-transparent.png",
    spriteClass: "character-sprite character-sprite--gyaru",
    spriteAlt: "参考書とシャープペンを持ち、カーディガン姿で笑う優等生ギャル",
    initialStats: { academics: 16, trust: 66, face: 55, looks: 72, stamina: 66, stress: 22 },
    intro: [
      {
        speaker: "優等生ギャル",
        sceneTag: "1年春・入学式",
        text: "ゥチの名前は、優等生ギャル。\n見た目でナメられがちだけど、友だち泣かすヤツは見過ごせない。マヂ情に厚いって、そーゆーこと。",
      },
      {
        speaker: "優等生ギャル",
        sceneTag: "新しい教室",
        text: "高校生活、行事も恋バナも友情もぜんぶ盛りたい。\nでも志望校だって諦めたくない。偏差値もメンタルも、ちゃんと上げてく。",
      },
      {
        speaker: "優等生ギャル",
        sceneTag: "三年計画",
        text: "毎週、選べる予定は一つだけ。\n勉強すれば学力は上がる。友だちと向き合えば人望とメンツは守れる。でも無理しすぎたら、肌も心も荒れてルックスも落ちるってワケ。",
      },
      {
        speaker: "優等生ギャル",
        sceneTag: "卒業まで三年",
        text: "卒業式の日、最高に盛れた顔で笑いたい。\n目指せ優等生ギャル。友情も合格も、両方取るし。",
      },
    ],
  },
];

const targetSchools = [
  {
    id: "johoku",
    name: "城北実学大学",
    deviation: 52,
    subtitle: "基礎を固めれば届く現実路線",
    totalTurns: 144,
    passAcademic: 74,
    passTrust: 42,
    passFace: 42,
    waitlistAcademic: 64,
    waitlistTrust: 68,
    waitlistFace: 68,
    weeklyStress: 0,
    lateStress: 1,
    staminaDrain: 0,
  },
  {
    id: "toto",
    name: "東都学院大学",
    deviation: 60,
    subtitle: "番長業との両立に綻びが出る中堅上位",
    totalTurns: 144,
    passAcademic: 82,
    passTrust: 48,
    passFace: 48,
    waitlistAcademic: 72,
    waitlistTrust: 70,
    waitlistFace: 70,
    weeklyStress: 1,
    lateStress: 1,
    staminaDrain: 0,
  },
  {
    id: "teio",
    name: "帝王義塾大学",
    deviation: 68,
    subtitle: "赤本も校内の視線も重くなる難関校",
    totalTurns: 144,
    passAcademic: 90,
    passTrust: 54,
    passFace: 54,
    waitlistAcademic: 80,
    waitlistTrust: 73,
    waitlistFace: 73,
    weeklyStress: 1,
    lateStress: 2,
    staminaDrain: 1,
  },
  {
    id: "tenrei",
    name: "国立天嶺大学",
    deviation: 74,
    subtitle: "半端な仁義も半端な勉強も通らない最難関",
    totalTurns: 144,
    passAcademic: 96,
    passTrust: 60,
    passFace: 60,
    waitlistAcademic: 88,
    waitlistTrust: 76,
    waitlistFace: 76,
    weeklyStress: 2,
    lateStress: 2,
    staminaDrain: 1,
  },
];

const endingCatalog = [
  {
    id: "passed_bancho",
    title: "合格番長",
    hint: "学力も仁義も守り抜いた結末。",
    artwork: "./assets/images/endings/passed-bancho.png",
    artworkAlt: "校門前で合格通知を掲げ、仲間たちに囲まれる受験番長",
    bgm: "./assets/audio/endings/passed-bancho-victory.mp3",
    bgmTitle: "Victory",
  },
  {
    id: "lonely_pass",
    title: "孤独な合格",
    hint: "合格はしたが、校門前の仲間は少ない。",
    artwork: "./assets/images/endings/lonely-pass.png",
    artworkAlt: "夕暮れの校門前で合格通知を見つめる受験番長",
    bgm: "./assets/audio/endings/lonely-pass-sad-theme.mp3",
    bgmTitle: "Sad Theme",
  },
  {
    id: "waitlist_legend",
    title: "補欠の伝説",
    hint: "点数は少し届かないが、仲間は誰も責めない。",
    artwork: "./assets/images/endings/waitlist-legend.png",
    artworkAlt: "夕方の教室で通知を手にし、仲間に見守られる受験番長",
    bgm: "./assets/audio/endings/waitlist-forgotten-victory.ogg",
    bgmTitle: "Forgotten Victory",
  },
  {
    id: "bancho_legend",
    title: "番長伝説",
    hint: "受験には敗れても、校内に名は残る。",
    artwork: "./assets/images/endings/bancho-legend.png",
    artworkAlt: "夕焼けの屋上で仲間を背に立つ受験番長",
    bgm: "./assets/audio/endings/bancho-legend-determination.mp3",
    bgmTitle: "Determination",
  },
  {
    id: "failed",
    title: "不合格",
    hint: "予定から締め直すことになる結末。",
    artwork: "./assets/images/endings/failed.png",
    artworkAlt: "雨の教室で机に向かい、閉じた参考書を見つめる受験番長",
    bgm: "./assets/audio/endings/failed-game-over.ogg",
    bgmTitle: "Game Over",
  },
  {
    id: "passed_gyaru",
    title: "優等生ギャル",
    hint: "友情も合格も盛り切った結末。",
    artwork: "./assets/images/endings/gyaru/passed-gyaru.png",
    artworkAlt: "校門前で合格通知を掲げ、友人たちに祝福される優等生ギャル",
    bgm: "./assets/audio/endings/passed-bancho-victory.mp3",
    bgmTitle: "Victory",
  },
  {
    id: "lonely_gyaru",
    title: "孤独な合格ギャル",
    hint: "合格はしたが、友情の通知は少し既読スルー。",
    artwork: "./assets/images/endings/gyaru/lonely-gyaru.png",
    artworkAlt: "夕暮れの校門前で合格通知を見つめる優等生ギャル",
    bgm: "./assets/audio/endings/lonely-pass-sad-theme.mp3",
    bgmTitle: "Sad Theme",
  },
  {
    id: "waitlist_gyaru",
    title: "補欠のギャル伝説",
    hint: "点数は少し足りないが、友だちは誰も離れない。",
    artwork: "./assets/images/endings/gyaru/waitlist-gyaru.png",
    artworkAlt: "夕方の教室で通知を手にし、友人たちに励まされる優等生ギャル",
    bgm: "./assets/audio/endings/waitlist-forgotten-victory.ogg",
    bgmTitle: "Forgotten Victory",
  },
  {
    id: "legend_gyaru",
    title: "ギャル伝説",
    hint: "受験には敗れても、情の厚さは校内に残る。",
    artwork: "./assets/images/endings/gyaru/legend-gyaru.png",
    artworkAlt: "夕焼けの屋上で友人たちを背に立つ優等生ギャル",
    bgm: "./assets/audio/endings/bancho-legend-determination.mp3",
    bgmTitle: "Determination",
  },
  {
    id: "failed_gyaru",
    title: "不合格ギャル",
    hint: "予定から盛り直すことになる結末。",
    artwork: "./assets/images/endings/gyaru/failed-gyaru.png",
    artworkAlt: "雨の教室で机に向かい、参考書を見つめる優等生ギャル",
    bgm: "./assets/audio/endings/failed-game-over.ogg",
    bgmTitle: "Game Over",
  },
];

const cards = [
  {
    id: "study_library",
    title: "自習室に乗り込む",
    subtitle: "静寂を制する者が受験を制す",
    flavor: "参考書を机に叩きつける。今日はシャーペンが相棒だ。",
    effects: { academics: 1, trust: -1, face: 0, looks: -1, stamina: -3, stress: 2 },
    minStamina: 12,
    unlockTurn: 0,
    oneShot: false,
    tag: "study",
    speaker: "受験番長",
    resultLead: "自習室の空気が一瞬で締まった。",
  },
  {
    id: "cram_school",
    title: "補習を受ける",
    subtitle: "先生に頭を下げるのも器量",
    flavor: "番長のメンツは少し削れるが、赤点回避の技術は身につく。",
    effects: { academics: 1, trust: 1, face: -1, looks: 0, stamina: -3, stress: 2 },
    minStamina: 10,
    unlockTurn: 0,
    oneShot: false,
    tag: "teacher",
    speaker: "生活指導の先生",
    resultLead: "職員室の時計だけがやけに大きく鳴った。",
  },
  {
    id: "ramen_meeting",
    title: "仲間とラーメン会議",
    subtitle: "替え玉より厚い信頼",
    flavor: "湯気の向こうで進路相談と近況報告を聞く。",
    effects: { academics: 0, trust: 2, face: 1, looks: 1, stamina: 2, stress: -2 },
    minStamina: 0,
    unlockTurn: 0,
    oneShot: false,
    tag: "social",
    speaker: "舎弟たち",
    resultLead: "どんぶりの底に、妙な団結が残った。",
  },
  {
    id: "rescue_fight",
    title: "仲裁に走る",
    subtitle: "仲間が絡まれたら、まず止めに入る",
    flavor: "参考書を閉じ、校門へ走る。拳より先に声を張るのが、今日の答案だ。",
    effects: { academics: 0, trust: 2, face: 2, looks: -1, stamina: -5, stress: 3 },
    minStamina: 24,
    unlockTurn: 0,
    oneShot: false,
    tag: "fight",
    speaker: "受験番長",
    resultLead: "夕焼けの校門前に、番長の一喝が響いた。",
  },
  {
    id: "sleep_early",
    title: "今日は寝る",
    subtitle: "番長も睡眠で回復する",
    flavor: "布団に沈む。夢の中で英単語とタイマンを張る。",
    effects: { academics: 0, trust: -1, face: 0, looks: 2, stamina: 9, stress: -6 },
    minStamina: 0,
    unlockTurn: 0,
    oneShot: false,
    tag: "rest",
    speaker: "受験番長",
    resultLead: "不良の夜更かしにも、限界はある。",
  },
  {
    id: "mock_exam",
    title: "模試に特攻",
    subtitle: "点数表から逃げない",
    flavor: "結果から逃げない。点数表を見て次の一手を決める。",
    effects: { academics: 3, trust: 0, face: 1, looks: -1, stamina: -6, stress: 5 },
    minStamina: 20,
    unlockTurn: 48,
    oneShot: false,
    tag: "exam",
    speaker: "模試監督",
    resultLead: "答案用紙は、喧嘩より正直だった。",
  },
  {
    id: "final_sprint",
    title: "赤本ラストスパート",
    subtitle: "本番直前の詰め込み仁義",
    flavor: "眠気も弱音も廊下に立たせる。最後は過去問だ。",
    effects: { academics: 4, trust: -2, face: 0, looks: -2, stamina: -9, stress: 7 },
    minStamina: 28,
    unlockTurn: 120,
    oneShot: false,
    tag: "exam",
    speaker: "受験番長",
    resultLead: "赤本のページが、夜明けまで鳴り続けた。",
  },
];

const events = [
  {
    id: "rival_school",
    title: "ライバル校の挑発",
    speaker: "ライバル校の不良",
    message: "売られた喧嘩を買わずに睨みだけで返した。余計な火種は消えた。",
    effects: { academics: 0, trust: 1, face: 2, looks: 0, stamina: -3, stress: 2 },
    minTurn: 16,
    chance: 0.08,
  },
  {
    id: "friend_panic",
    title: "仲間の進路相談",
    speaker: "舎弟",
    message: "話を聞いたら、自分の焦りも少し言葉になった。",
    effects: { academics: 1, trust: 3, face: 0, looks: 0, stamina: -2, stress: -2 },
    minTurn: 24,
    chance: 0.07,
  },
  {
    id: "teacher_warning",
    title: "生活指導の呼び出し",
    speaker: "生活指導の先生",
    message: "廊下の説教は長い。だが願書の締切も教えてもらった。",
    effects: { academics: 2, trust: 0, face: -3, looks: -1, stamina: -2, stress: 3 },
    minTurn: 32,
    chance: 0.07,
    gateStat: "face",
    gateBelowOrEqual: 45,
  },
  {
    id: "burnout_hint",
    title: "深夜の集中切れ",
    speaker: "受験番長",
    message: "目が滑る。今日は単語帳を閉じる勇気も必要だ。",
    effects: { academics: -2, trust: 0, face: 0, looks: 1, stamina: 5, stress: -7 },
    minTurn: 56,
    chance: 0.1,
    gateStat: "stress",
    gateBelowOrEqual: 100,
  },
  {
    id: "exam_ticket_panic",
    title: "受験票が消えた夜",
    speaker: "舎弟",
    message: "受験票がないと大騒ぎになった。机も鞄も総ざらいして、最後は単語帳の間から見つかった。",
    effects: { academics: 3, trust: 4, face: -2, looks: -2, stamina: -8, stress: 8 },
    minTurn: 120,
    chance: 0.04,
  },
  {
    id: "principal_truce",
    title: "校長室の休戦協定",
    speaker: "校長",
    message: "番長の顔で揉め事を収め、受験生として自習室の鍵も預かった。なぜか校内が静かになった。",
    effects: { academics: 3, trust: 2, face: 3, looks: 1, stamina: -4, stress: -3 },
    minTurn: 96,
    chance: 0.04,
    gateStat: "trust",
    gateBelowOrEqual: 100,
  },
];

const schoolCalendar = createSchoolCalendar();

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
  profile: null,
  targetSchool: null,
  endingBookOpen: false,
  unlockedEndingIds: loadUnlockedEndings(),
  bgmEnabled: false,
  profileSelectionLocked: false,
  profileSelectionToken: 0,
  characterCentered: false,
};

const elements = {
  novelStage: document.querySelector(".novel-stage"),
  statsHud: document.querySelector("#statsHud"),
  turnText: document.querySelector("#turnText"),
  statsGrid: document.querySelector("#statsGrid"),
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
  endingArtwork: document.querySelector("#endingArtwork"),
  characterSprite: document.querySelector("#characterSprite"),
  profileCompareSprite: document.querySelector("#profileCompareSprite"),
  restartTopButton: document.querySelector("#restartTopButton"),
  bgmAudio: document.querySelector("#bgmAudio"),
  bgmButton: document.querySelector("#bgmButton"),
  volumeSlider: document.querySelector("#volumeSlider"),
};

elements.endingBookButton.addEventListener("click", toggleEndingBook);
elements.endingBookClearButton.addEventListener("click", clearEndingBook);
elements.restartTopButton.addEventListener("click", startNewGame);
elements.bgmButton.addEventListener("click", toggleBgm);
elements.volumeSlider.addEventListener("input", updateBgmVolume);

startNewGame();
updateBgmVolume();
updateBgmButton();
scheduleEndingAssetPreload();

function startNewGame() {
  state.turn = 0;
  state.totalTurns = TOTAL_TURNS;
  state.stats = { ...protagonistProfiles[0].initialStats };
  state.usedCardIds = new Set();
  state.log = ["1年春。高校生活の三年間が始まった。"];
  state.complete = false;
  state.screen = "profile";
  state.introIndex = 0;
  state.pendingResult = null;
  state.profile = null;
  state.targetSchool = null;
  state.characterCentered = false;
  clearProfileSelectionAnimation();
  state.profileSelectionToken += 1;
  setCharacterSprite(protagonistProfiles[0]);
  setBgmTrack(getSceneBgm());
  elements.advanceButton.onclick = advanceScene;
  render();
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
  elements.novelStage.dataset.selectedProfile = profile.id;
  elements.novelStage.classList.add("novel-stage--profile-selecting", `novel-stage--selected-${profile.id}`);
  elements.dialogueText.textContent = `${profile.title}で走り抜ける。\n三年間の予定表が、静かに開く。`;
  elements.choiceList.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });

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
  state.stats = { ...profile.initialStats };
  state.log = [`1年春。${profile.title}の三年間が始まった。`];
  state.screen = "intro";
  state.introIndex = 0;
  state.characterCentered = true;
  setCharacterSprite(profile);
  render();
}

function selectTargetSchool(school) {
  state.targetSchool = school;
  state.totalTurns = school.totalTurns;
  state.log.push(`${school.name}を志望校に決めた。偏差値${school.deviation}の門が待っている。`);
  state.screen = "choices";
  render();
}

function chooseCard(card) {
  if (state.complete || !isCardAvailable(card)) {
    return;
  }

  state.turn += 1;
  applyEffects(card.effects);
  if (card.oneShot) {
    state.usedCardIds.add(card.id);
  }

  const event = tryApplyRandomEvent();
  const pressureMessages = [...applyTargetSchoolPressure(), ...applyPressureRules()];
  const effectText = formatEffectSentence(card.effects);
  const eventText = event ? `\n\n${event.speaker}「${event.message}」${formatEffectSentence(event.effects)}` : "";
  const pressureText = pressureMessages.length ? `\n\n${pressureMessages.join("\n")}` : "";

  if (state.turn >= state.totalTurns) {
    state.complete = true;
  }

  const reactionText = buildCardReaction(card);
  const resultText = `${card.resultLead}\n${card.flavor}${reactionText}${effectText}${eventText}${pressureText}`;
  state.pendingResult = {
    speaker: getCardSpeaker(card),
    sceneTag: event ? event.title : sceneNameForTurn(),
    text: resultText,
  };
  state.log.push(resultText);
  state.screen = "result";
  render();
}

function advanceScene() {
  if (state.screen === "intro") {
    state.introIndex += 1;
    if (state.introIndex >= getProfile().intro.length) {
      state.screen = "target";
    }
    render();
    return;
  }

  if (state.complete) {
    state.screen = "ending";
    render();
    return;
  }

  state.screen = "choices";
  state.pendingResult = null;
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
      applyEffects(event.effects);
      return event;
    }
  }

  return null;
}

function applyPressureRules() {
  const messages = [];
  if (state.stats.stress >= 88) {
    applyEffects({ academics: -6, trust: -3, face: -1, looks: -5, stamina: 0, stress: -10 });
    messages.push("鏡の前で顔色の悪さに気づく。焦りでルックスも人望も削れていく。");
  } else if (state.stats.stress >= 72) {
    applyEffects({ academics: 0, trust: -1, face: 0, looks: -2, stamina: 0, stress: 0 });
    messages.push("寝不足の顔が隠せない。妙な空気が流れて、人望も少し冷える。");
  }

  if (state.stats.looks <= 35) {
    applyEffects({ academics: 0, trust: -2, face: -2, looks: 0, stamina: 0, stress: 2 });
    messages.push("髪も肌も荒れている。異性の視線は遠のき、仲間にも少しナメられる。");
  }

  if (state.stats.stamina <= 6) {
    applyEffects({ academics: 0, trust: 0, face: -4, looks: -1, stamina: 0, stress: 8 });
    messages.push("受験番長「足が笑ってやがる。寝不足でメンツは張れねえな。」");
  }

  return messages;
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

function applyEffects(effects) {
  for (const key of Object.keys(statLabels)) {
    state.stats[key] = clamp((state.stats[key] ?? 0) + (effects[key] ?? 0), 0, 100);
  }
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
      body:
        route === "gyaru"
          ? `${schoolLine}\n点数は少し足りない。けど友だちは、誰も責めない。\n来年リベンジ、マヂで盛り返す。`
          : `${schoolLine}\n点数は少し足りない。だが仲間たちは誰も責めない。\n来年、伝説の第二章が始まる。`,
    };
  }

  if (s.trust >= 82 && s.face >= 82) {
    return {
      id: route === "gyaru" ? "legend_gyaru" : "bancho_legend",
      title: route === "gyaru" ? "ギャル伝説" : "番長伝説",
      body:
        route === "gyaru"
          ? `${schoolLine}\n受験には敗れた。でも、あんたに救われた友だちは数えきれない。\n情に厚いギャルの名前は、卒業後も廊下に残った。`
          : `${schoolLine}\n受験には敗れた。しかし校内でお前の名を知らぬ者はいない。\n問題集より厚い武勇伝が残った。`,
    };
  }

  return {
    id: route === "gyaru" ? "failed_gyaru" : "failed",
    title: route === "gyaru" ? "不合格ギャル" : "不合格",
    body:
      route === "gyaru"
        ? `${schoolLine}\n勉強も友情も、ちょっとずつ空回りした。\nでも泣いて終わりじゃない。次は予定から盛り直せ。`
        : `${schoolLine}\n勉強も仁義も中途半端だった。\nだが答案用紙は逃げない。次は予定から締め直せ。`,
  };
}

function render() {
  elements.novelStage.dataset.screen = state.screen;
  elements.novelStage.classList.toggle("novel-stage--profile", state.screen === "profile");
  elements.novelStage.classList.toggle("novel-stage--playing", state.screen === "choices" || state.screen === "result");
  elements.novelStage.classList.toggle("novel-stage--ending", state.screen === "ending");
  elements.novelStage.classList.toggle(
    "novel-stage--route-centered",
    state.characterCentered && state.screen !== "profile" && state.screen !== "ending",
  );
  elements.statsHud.hidden = state.screen === "profile" || state.screen === "intro" || state.screen === "target";
  if (state.screen !== "profile") {
    clearProfileSelectionAnimation();
  }
  elements.turnText.textContent = buildTurnText();
  if (state.screen !== "ending") {
    setBgmTrack(getSceneBgm());
  }
  renderStats();
  renderEndingBook();

  if (state.screen === "profile") {
    renderProfileSelect();
    return;
  }

  if (state.screen === "intro") {
    renderIntro();
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

  if (state.screen === "result" && state.pendingResult) {
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
  elements.dialogueText.textContent = "三年間をどっちの受験生で走り抜ける？\n仁義の番長か、マヂ情に厚い優等生ギャルか。卒業式まで、毎週の予定を選び続けろ。";
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
  elements.dialogueText.textContent = scene.text;
  elements.choiceList.replaceChildren();
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent = state.introIndex === introScenes.length - 1 ? "予定を決める" : "次へ";
  elements.advanceButton.onclick = advanceScene;
}

function renderTargetSchoolSelect() {
  hideEndingArtwork();
  resetDialogueScroll();
  elements.speakerName.textContent = "進路指導室";
  elements.sceneTag.textContent = "志望校選択";
  elements.dialogueText.textContent =
    "三年間の進路計画を決める。\n偏差値が上がるほど、必要な学力も、最後まで保つ胆力も跳ね上がる。どの門を目指す？";
  elements.advanceButton.hidden = true;
  elements.choiceList.replaceChildren(...targetSchools.map(createTargetSchoolButton));
}

function renderChoices() {
  hideEndingArtwork();
  resetDialogueScroll();
  elements.speakerName.textContent = getProfile().title;
  elements.sceneTag.textContent = sceneNameForTurn();
  elements.dialogueText.textContent = buildChoicePrompt();
  elements.advanceButton.hidden = true;

  const availableCards = cards.filter(isCardAvailable);
  elements.choiceList.replaceChildren(...availableCards.map(createChoiceButton));
}

function renderResult() {
  hideEndingArtwork();
  resetDialogueScroll();
  elements.speakerName.textContent = state.pendingResult.speaker;
  elements.sceneTag.textContent = state.pendingResult.sceneTag;
  elements.dialogueText.textContent = state.pendingResult.text;
  elements.choiceList.replaceChildren();
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent = state.complete ? "合格発表へ" : "次の週へ";
  elements.advanceButton.onclick = advanceScene;
}

function renderEnding() {
  const ending = attachEndingAssets(resolveEnding());
  unlockEnding(ending.id);
  renderEndingBook();
  showEndingArtwork(ending);
  setBgmTrack(ending.bgm);
  resetDialogueScroll();
  elements.speakerName.textContent = "合格発表";
  elements.sceneTag.textContent = "ENDING";
  elements.dialogueText.textContent = `${ending.title}\n\n${ending.body}`;
  elements.choiceList.replaceChildren();
  elements.advanceButton.hidden = false;
  elements.advanceButton.textContent = "もう一周する";
  elements.advanceButton.onclick = startNewGame;
}

function attachEndingAssets(ending) {
  const catalogEntry = endingCatalog.find((entry) => entry.id === ending.id);
  return { ...catalogEntry, ...ending };
}

function showEndingArtwork(ending) {
  elements.endingArtwork.src = ending.artwork;
  elements.endingArtwork.alt = ending.artworkAlt;
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

function toggleEndingBook() {
  state.endingBookOpen = !state.endingBookOpen;
  renderEndingBook();
}

function clearEndingBook() {
  const shouldClear = window.confirm("結末帳の記録を消しますか？");
  if (!shouldClear) {
    return;
  }

  state.unlockedEndingIds = new Set();
  saveUnlockedEndings();
  renderEndingBook();
}

function renderEndingBook() {
  const unlockedCount = state.unlockedEndingIds.size;
  elements.endingBookButton.textContent = `結末帳 ${unlockedCount}/${endingCatalog.length}`;
  elements.endingBookButton.setAttribute("aria-expanded", state.endingBookOpen ? "true" : "false");
  elements.endingBookCount.textContent = `${unlockedCount}/${endingCatalog.length} 解放`;
  elements.endingBookPanel.hidden = !state.endingBookOpen;
  elements.endingBookList.replaceChildren(...endingCatalog.map(createEndingRecord));
}

function createEndingRecord(ending, index) {
  const unlocked = state.unlockedEndingIds.has(ending.id);
  const record = document.createElement("article");
  record.className = "ending-record";

  const title = document.createElement("p");
  title.className = "ending-record__title";
  title.textContent = unlocked ? `${index + 1}. ${ending.title}` : `${index + 1}. ？？？`;

  const body = document.createElement("p");
  body.className = "ending-record__body";
  body.textContent = unlocked ? ending.hint : "まだ見ていない結末。";

  record.append(title, body);
  return record;
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
  const button = document.createElement("button");
  button.className = "choice-button choice-button--school";
  button.type = "button";
  button.setAttribute(
    "aria-label",
    `${school.name}。偏差値${school.deviation}。必要学力${school.passAcademic}。必要な人望${school.passTrust}、メンツ${school.passFace}。${school.subtitle}`,
  );
  button.addEventListener("click", () => {
    selectTargetSchool(school);
  });

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = school.name;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = school.subtitle;

  const line = document.createElement("span");
  line.className = "school-requirements";
  line.textContent = `偏差値${school.deviation} / 必要学力${school.passAcademic} / 仁義${school.passTrust}+ / メンツ${school.passFace}+ / 3年間144週`;

  button.append(title, subtitle, line);
  return button;
}

function unlockEnding(endingId) {
  if (state.unlockedEndingIds.has(endingId)) {
    return;
  }

  state.unlockedEndingIds.add(endingId);
  saveUnlockedEndings();
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

function saveUnlockedEndings() {
  try {
    window.localStorage.setItem(ENDING_STORAGE_KEY, JSON.stringify([...state.unlockedEndingIds]));
  } catch {
    // Ending completion is optional local progress; gameplay should continue even if storage is unavailable.
  }
}

function createChoiceButton(card) {
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.setAttribute("aria-label", `${card.title}。${card.subtitle}。効果: ${formatEffectSummary(card.effects)}`);
  button.addEventListener("click", () => {
    chooseCard(card);
  });

  const title = document.createElement("span");
  title.className = "choice-title";
  title.textContent = card.title;

  const subtitle = document.createElement("span");
  subtitle.className = "choice-subtitle";
  subtitle.textContent = card.subtitle;

  const effects = document.createElement("span");
  effects.className = "choice-effects";
  effects.append(...createEffectPills(card.effects));

  button.append(title, subtitle, effects);
  return button;
}

function renderStats() {
  elements.statsHud.setAttribute("aria-label", `現在のステータス。${formatStatsForSpeech()}。${buildTargetSchoolSpeech()}。${elements.turnText.textContent}`);
  elements.statsGrid.replaceChildren(
    ...Object.entries(statLabels).map(([key, label]) => {
      const row = document.createElement("div");
      row.className = "stat-row";
      row.setAttribute("aria-label", `${label} ${state.stats[key]}`);

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
    return profile.id === "gyaru"
      ? `${getTargetSchool().name}を目指す三年間が始まる。\n入学式のリップもノートもまだ新品。友情も偏差値も、ここから盛ってく。`
      : `${getTargetSchool().name}を目指す三年間が始まる。\n入学式の校門はまだ新しい。番長としての義理も、志望校への道も、ここから選び取るしかねえ。`;
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

function formatEffectSentence(effects) {
  const parts = Object.entries(statLabels)
    .filter(([key]) => effects[key])
    .map(([key, label]) => `${label}${effects[key] > 0 ? "+" : ""}${effects[key]}`);
  return parts.length ? `\n[${parts.join(" / ")}]` : "";
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
  if (state.screen === "profile") {
    return "主人公選択 / 入学式";
  }

  if (state.screen === "intro") {
    return "1年春 / 入学式";
  }

  if (state.screen === "target" || !state.targetSchool) {
    return `${getProfile().title} / 志望校選択`;
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

function isLateStage() {
  return state.targetSchool && state.turn >= state.totalTurns - 24;
}

function buildCardReaction(card) {
  const profile = getProfile();
  if (profile.id === "gyaru") {
    if (card.tag === "study") {
      return "\n優等生ギャル「今日のノート、マヂで盛れた。偏差値も盛る。」";
    }

    if (card.tag === "teacher") {
      return "\n生活指導の先生「その見た目でこの集中力か。いい意味で裏切るな。」";
    }

    if (card.tag === "social") {
      return "\n友だち「話聞いてくれるの、ほんと救われる。マヂありがと。」";
    }

    if (card.tag === "fight") {
      return "\n優等生ギャル「揉めたまま帰るとかナシ。ちゃんと話そ。」";
    }

    if (card.tag === "rest") {
      return "\n優等生ギャル「寝不足は盛れない。今日はちゃんと寝る。」";
    }

    if (card.tag === "exam") {
      return "\n優等生ギャル「点数、盛れてないなら盛り直すだけ。」";
    }
  }

  if (card.tag === "study") {
    return "\n受験番長「静かな部屋ほど、俺の闘志はうるさくなる。」";
  }

  if (card.tag === "teacher") {
    return "\n生活指導の先生「頭を下げられるなら、まだ伸びる。」";
  }

  if (card.tag === "social") {
    return "\n舎弟「番長、そういう話も聞いてくれるんすね。」";
  }

  if (card.tag === "fight") {
    return "\n受験番長「殴るより難しい喧嘩もある。今日はそれを片づける。」";
  }

  if (card.tag === "rest") {
    return "\n受験番長「寝るのも作戦だ。明日の俺にメンツを預ける。」";
  }

  if (card.tag === "exam") {
    return "\n受験番長「点数は逃げねえ。なら、俺も逃げねえ。」";
  }

  return "";
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

function setBgmTrack(src) {
  if (elements.bgmAudio.getAttribute("src") === src) {
    return;
  }

  elements.bgmAudio.src = src;
  elements.bgmAudio.load();
  if (state.bgmEnabled) {
    void playBgm();
  }
}

async function playBgm() {
  try {
    await elements.bgmAudio.play();
  } catch {
    state.bgmEnabled = false;
  }
  updateBgmButton();
}

function updateBgmButton() {
  elements.bgmButton.textContent = state.bgmEnabled ? "BGM停止" : "BGM再生";
  elements.bgmButton.setAttribute("aria-pressed", state.bgmEnabled ? "true" : "false");
}

function updateBgmVolume() {
  elements.bgmAudio.volume = Number(elements.volumeSlider.value) / 100;
}

function scheduleEndingAssetPreload() {
  const preload = () => {
    for (const src of Object.values(termBgm)) {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.src = src;
    }

    for (const ending of endingCatalog) {
      const image = new Image();
      image.decoding = "async";
      image.src = ending.artwork;

      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.src = ending.bgm;
    }
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preload, { timeout: 4000 });
    return;
  }

  window.setTimeout(preload, 1200);
}
