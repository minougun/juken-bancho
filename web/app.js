const TOTAL_TURNS = 18;

const statLabels = {
  academics: "学力",
  trust: "人望",
  face: "メンツ",
  stamina: "体力",
  stress: "ストレス",
};

const ENDING_STORAGE_KEY = "jukenBancho.unlockedEndings.v1";
const GAMEPLAY_BGM_SRC = "./assets/audio/flesh-and-blood.mp3";

const targetSchools = [
  {
    id: "johoku",
    name: "城北実学大学",
    deviation: 52,
    subtitle: "基礎を固めれば届く現実路線",
    totalTurns: 18,
    passAcademic: 74,
    passTrust: 42,
    passFace: 42,
    waitlistAcademic: 64,
    waitlistTrust: 68,
    waitlistFace: 68,
    weeklyStress: 0,
    lateStress: 2,
    staminaDrain: 0,
  },
  {
    id: "toto",
    name: "東都学院大学",
    deviation: 60,
    subtitle: "番長業との両立に綻びが出る中堅上位",
    totalTurns: 18,
    passAcademic: 82,
    passTrust: 48,
    passFace: 48,
    waitlistAcademic: 72,
    waitlistTrust: 70,
    waitlistFace: 70,
    weeklyStress: 1,
    lateStress: 3,
    staminaDrain: 0,
  },
  {
    id: "teio",
    name: "帝王義塾大学",
    deviation: 68,
    subtitle: "赤本も校内の視線も重くなる難関校",
    totalTurns: 17,
    passAcademic: 90,
    passTrust: 54,
    passFace: 54,
    waitlistAcademic: 80,
    waitlistTrust: 73,
    waitlistFace: 73,
    weeklyStress: 2,
    lateStress: 4,
    staminaDrain: 1,
  },
  {
    id: "tenrei",
    name: "国立天嶺大学",
    deviation: 74,
    subtitle: "半端な仁義も半端な勉強も通らない最難関",
    totalTurns: 16,
    passAcademic: 96,
    passTrust: 60,
    passFace: 60,
    waitlistAcademic: 88,
    waitlistTrust: 76,
    waitlistFace: 76,
    weeklyStress: 3,
    lateStress: 5,
    staminaDrain: 2,
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
];

const introScenes = [
  {
    speaker: "受験番長",
    sceneTag: "春の校門",
    text: "俺の名は、受験番長。\nこの高校じゃ少しばかり顔が利く。仲間が困ってりゃ放っておけねえし、メンツをなくせば番長の看板も泣く。",
  },
  {
    speaker: "受験番長",
    sceneTag: "進路指導室前",
    text: "だが今年だけは事情が違う。\n俺は受験生だ。志望校の門は、気合いだけじゃ開かねえ。学力も、体力も、時間もいる。",
  },
  {
    speaker: "受験番長",
    sceneTag: "作戦確認",
    text: "放課後ごとに、俺は一つしか選べねえ。\n机に向かえば学力は積める。仲間と向き合えば人望やメンツは守れる。無理を重ねれば体力が削れ、焦りも腹にたまる。",
  },
  {
    speaker: "受験番長",
    sceneTag: "受験まで残り18週",
    text: "合格だけを取るか、仲間もメンツも守り抜くか。\n全部まとめて背負ってこそ、番長ってもんだろ。",
  },
];

const cards = [
  {
    id: "study_library",
    title: "自習室に乗り込む",
    subtitle: "静寂を制する者が受験を制す",
    flavor: "参考書を机に叩きつける。今日はシャーペンが相棒だ。",
    effects: { academics: 10, trust: -2, face: -1, stamina: -10, stress: 8 },
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
    effects: { academics: 8, trust: 3, face: -5, stamina: -8, stress: 5 },
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
    effects: { academics: -2, trust: 9, face: 2, stamina: 4, stress: -4 },
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
    effects: { academics: -3, trust: 8, face: 9, stamina: -16, stress: 7 },
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
    effects: { academics: 0, trust: -1, face: -1, stamina: 26, stress: -17 },
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
    effects: { academics: 14, trust: 0, face: 3, stamina: -14, stress: 12 },
    minStamina: 20,
    unlockTurn: 5,
    oneShot: true,
    tag: "exam",
    speaker: "模試監督",
    resultLead: "答案用紙は、喧嘩より正直だった。",
  },
  {
    id: "final_sprint",
    title: "赤本ラストスパート",
    subtitle: "本番直前の詰め込み仁義",
    flavor: "眠気も弱音も廊下に立たせる。最後は過去問だ。",
    effects: { academics: 18, trust: -3, face: 0, stamina: -20, stress: 16 },
    minStamina: 28,
    unlockTurn: 12,
    oneShot: true,
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
    effects: { academics: 0, trust: 2, face: 4, stamina: -5, stress: 3 },
    minTurn: 2,
    chance: 0.12,
  },
  {
    id: "friend_panic",
    title: "仲間の進路相談",
    speaker: "舎弟",
    message: "話を聞いたら、自分の焦りも少し言葉になった。",
    effects: { academics: 2, trust: 6, face: 0, stamina: -4, stress: -3 },
    minTurn: 3,
    chance: 0.1,
  },
  {
    id: "teacher_warning",
    title: "生活指導の呼び出し",
    speaker: "生活指導の先生",
    message: "廊下の説教は長い。だが願書の締切も教えてもらった。",
    effects: { academics: 4, trust: 0, face: -6, stamina: -3, stress: 5 },
    minTurn: 4,
    chance: 0.1,
    gateStat: "face",
    gateBelowOrEqual: 45,
  },
  {
    id: "burnout_hint",
    title: "深夜の集中切れ",
    speaker: "受験番長",
    message: "目が滑る。今日は単語帳を閉じる勇気も必要だ。",
    effects: { academics: -3, trust: 0, face: 0, stamina: 8, stress: -10 },
    minTurn: 6,
    chance: 0.15,
    gateStat: "stress",
    gateBelowOrEqual: 100,
  },
  {
    id: "exam_ticket_panic",
    title: "受験票が消えた夜",
    speaker: "舎弟",
    message: "受験票がないと大騒ぎになった。机も鞄も総ざらいして、最後は単語帳の間から見つかった。",
    effects: { academics: 5, trust: 8, face: -4, stamina: -12, stress: 14 },
    minTurn: 10,
    chance: 0.06,
  },
  {
    id: "principal_truce",
    title: "校長室の休戦協定",
    speaker: "校長",
    message: "番長の顔で揉め事を収め、受験生として自習室の鍵も預かった。なぜか校内が静かになった。",
    effects: { academics: 8, trust: 4, face: 6, stamina: -6, stress: -4 },
    minTurn: 12,
    chance: 0.05,
    gateStat: "trust",
    gateBelowOrEqual: 100,
  },
];

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
  targetSchool: null,
  endingBookOpen: false,
  unlockedEndingIds: loadUnlockedEndings(),
  bgmEnabled: false,
};

const elements = {
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
  state.stats = {
    academics: 18,
    trust: 60,
    face: 58,
    stamina: 68,
    stress: 24,
  };
  state.usedCardIds = new Set();
  state.log = ["新学期。受験番長の戦いが始まった。"];
  state.complete = false;
  state.screen = "intro";
  state.introIndex = 0;
  state.pendingResult = null;
  state.targetSchool = null;
  setBgmTrack(GAMEPLAY_BGM_SRC);
  elements.advanceButton.onclick = advanceScene;
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
    speaker: card.speaker,
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
    if (state.introIndex >= introScenes.length) {
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
    applyEffects({ academics: -6, trust: -2, face: 0, stamina: 0, stress: -10 });
    messages.push("受験番長「焦りで文字が暴れやがる。詰め込みだけじゃ押し切れねえ。」");
  }

  if (state.stats.stamina <= 6) {
    applyEffects({ academics: 0, trust: 0, face: -4, stamina: 0, stress: 8 });
    messages.push("受験番長「足が笑ってやがる。寝不足でメンツは張れねえな。」");
  }

  return messages;
}

function applyTargetSchoolPressure() {
  const school = getTargetSchool();
  if (!school) {
    return [];
  }

  const stress = school.weeklyStress + (isLateStage() ? school.lateStress : 0);
  const stamina = isLateStage() ? -school.staminaDrain : 0;
  if (!stress && !stamina) {
    return [];
  }

  const effects = { academics: 0, trust: 0, face: 0, stamina, stress };
  applyEffects(effects);
  return [`進路指導室の赤線が濃くなる。${school.name}の偏差値${school.deviation}は、今日の疲れにも容赦しない。${formatEffectSentence(effects)}`];
}

function applyEffects(effects) {
  for (const key of Object.keys(statLabels)) {
    state.stats[key] = clamp((state.stats[key] ?? 0) + (effects[key] ?? 0), 0, 100);
  }
}

function resolveEnding() {
  const s = state.stats;
  const school = getTargetSchool();
  const passAcademic = school?.passAcademic ?? 82;
  const passTrust = school?.passTrust ?? 48;
  const passFace = school?.passFace ?? 48;
  const waitlistAcademic = school?.waitlistAcademic ?? passAcademic - 10;
  const waitlistTrust = school?.waitlistTrust ?? 70;
  const waitlistFace = school?.waitlistFace ?? 70;
  const schoolLine = school ? `${school.name}、偏差値${school.deviation}。` : "志望校の門。";

  if (s.academics >= passAcademic && s.trust >= passTrust && s.face >= passFace) {
    return {
      id: "passed_bancho",
      title: "合格番長",
      body: `${schoolLine}\n合格発表の日、仲間たちは胴上げの準備をしていた。\n学力も仁義も守り抜いた、お前こそ受験番長だ。`,
    };
  }

  if (s.academics >= passAcademic) {
    return {
      id: "lonely_pass",
      title: "孤独な合格",
      body: `${schoolLine}\n合格はした。だが校門前に仲間の姿は少ない。\n机に向かった時間の重さを、お前だけが知っている。`,
    };
  }

  if (s.academics >= waitlistAcademic && s.trust >= waitlistTrust && s.face >= waitlistFace) {
    return {
      id: "waitlist_legend",
      title: "補欠の伝説",
      body: `${schoolLine}\n点数は少し足りない。だが仲間たちは誰も責めない。\n来年、伝説の第二章が始まる。`,
    };
  }

  if (s.trust >= 82 && s.face >= 82) {
    return {
      id: "bancho_legend",
      title: "番長伝説",
      body: `${schoolLine}\n受験には敗れた。しかし校内でお前の名を知らぬ者はいない。\n問題集より厚い武勇伝が残った。`,
    };
  }

  return {
    id: "failed",
    title: "不合格",
    body: `${schoolLine}\n勉強も仁義も中途半端だった。\nだが答案用紙は逃げない。次は予定から締め直せ。`,
  };
}

function render() {
  elements.turnText.textContent = buildTurnText();
  renderStats();
  renderEndingBook();

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

function renderIntro() {
  hideEndingArtwork();
  resetDialogueScroll();
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
    "机の上に、四つの願書が並んだ。\n偏差値が上がるほど、必要な学力も、最後まで保つ胆力も跳ね上がる。どの門をこじ開ける？";
  elements.advanceButton.hidden = true;
  elements.choiceList.replaceChildren(...targetSchools.map(createTargetSchoolButton));
}

function renderChoices() {
  hideEndingArtwork();
  resetDialogueScroll();
  elements.speakerName.textContent = "受験番長";
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
  line.textContent = `偏差値${school.deviation} / 必要学力${school.passAcademic} / 仁義${school.passTrust}+ / メンツ${school.passFace}+ / ${school.totalTurns}週`;

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
  if (state.turn === 0) {
    return `${getTargetSchool().name}の願書が鞄で重い。\n受験まで残された放課後は少ない。番長としての義理も、志望校への道も、ここから選び取るしかねえ。`;
  }

  if (isLateStage()) {
    return `${getTargetSchool().name}の本番が近い。\n仲間の視線も、赤本の重みも、背中に乗っている。今日の放課後をどう使う？`;
  }

  return "放課後だ。\n廊下には仲間の声、鞄には参考書。番長として、受験生として、今日の一手を選べ。";
}

function sceneNameForTurn() {
  if (isLateStage()) {
    return "受験直前";
  }

  if (state.turn >= Math.floor(state.totalTurns / 3)) {
    return "二学期・放課後";
  }

  return "一学期・放課後";
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
  if (state.screen === "intro") {
    return `受験まで${TOTAL_TURNS}週`;
  }

  if (state.screen === "target" || !state.targetSchool) {
    return "志望校選択";
  }

  return `第${Math.min(state.turn + 1, state.totalTurns)}週 / 残り${Math.max(state.totalTurns - state.turn, 0)}週 / ${state.targetSchool.name} 偏差値${state.targetSchool.deviation}`;
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

function isLateStage() {
  return state.targetSchool && state.turn >= state.totalTurns - 6;
}

function buildCardReaction(card) {
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
