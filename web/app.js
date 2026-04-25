import {
  ENDING_STORAGE_KEY,
  EVENT_CG_STORAGE_KEY,
  GAMEPLAY_BGM_SRC,
  PROFILE_SELECT_ANIMATION_MS,
  TOTAL_TURNS,
  cards,
  endingCatalog,
  events,
  protagonistProfiles,
  seasonalEvents,
  statLabels,
  targetSchools,
  termBgm,
} from "./data/game-data.js";

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
  pendingProfile: null,
  targetSchool: null,
  returnScreen: "choices",
  artworkViewer: null,
  artworkReturnScreen: "endingBook",
  unlockedEndingIds: loadUnlockedEndings(),
  unlockedEventCgIds: loadUnlockedEventCgs(),
  bgmEnabled: false,
  sfxEnabled: true,
  audioContext: null,
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
  endingBookBackButton: document.querySelector("#endingBookBackButton"),
  eventGalleryButton: document.querySelector("#eventGalleryButton"),
  eventGalleryPanel: document.querySelector("#eventGalleryPanel"),
  eventGalleryCount: document.querySelector("#eventGalleryCount"),
  eventGalleryList: document.querySelector("#eventGalleryList"),
  eventGalleryClearButton: document.querySelector("#eventGalleryClearButton"),
  eventGalleryBackButton: document.querySelector("#eventGalleryBackButton"),
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
  volumeSlider: document.querySelector("#volumeSlider"),
};

document.addEventListener("click", playButtonClickSound, true);
elements.skipIntroButton.addEventListener("click", skipIntro);
elements.endingBookButton.addEventListener("click", openEndingBookPage);
elements.endingBookClearButton.addEventListener("click", clearEndingBook);
elements.endingBookBackButton.addEventListener("click", returnFromLibraryPage);
elements.eventGalleryButton.addEventListener("click", openEventGalleryPage);
elements.eventGalleryClearButton.addEventListener("click", clearEventGallery);
elements.eventGalleryBackButton.addEventListener("click", returnFromLibraryPage);
elements.artworkBackButton.addEventListener("click", returnFromArtworkViewer);
elements.restartTopButton.addEventListener("click", startNewGame);
elements.bgmButton.addEventListener("click", toggleBgm);
elements.sfxButton.addEventListener("click", toggleSfx);
elements.volumeSlider.addEventListener("input", updateBgmVolume);

startNewGame();
updateBgmVolume();
updateBgmButton();
updateSfxButton();
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
  state.pendingProfile = null;
  state.targetSchool = null;
  state.returnScreen = "profile";
  state.artworkViewer = null;
  state.artworkReturnScreen = "endingBook";
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
  state.pendingProfile = profile;
  elements.novelStage.dataset.selectedProfile = profile.id;
  elements.novelStage.classList.add("novel-stage--profile-selecting", `novel-stage--selected-${profile.id}`);
  elements.dialogueText.textContent = `${profile.title}で走り抜ける。\n三年間の予定表が、静かに開く。`;
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
  const seasonalEvent = tryApplySeasonalEvent();
  const pressureMessages = [...applyTargetSchoolPressure(), ...applyPressureRules()];
  const effectText = formatEffectSentence(card.effects);
  const eventText = event ? `\n\n${event.speaker}「${event.message}」${formatEffectSentence(event.effects)}` : "";
  const seasonalText = seasonalEvent
    ? `\n\n${seasonalEvent.title}\n${seasonalEvent.text}${formatEffectSentence(seasonalEvent.effects)}`
    : "";
  const pressureText = pressureMessages.length ? `\n\n${pressureMessages.join("\n")}` : "";

  if (state.turn >= state.totalTurns) {
    state.complete = true;
  }

  const cardCopy = getRouteCardCopy(card);
  const reactionText = buildCardReaction(card);
  const resultText = `${cardCopy.resultLead}\n${cardCopy.flavor}${reactionText}${effectText}${eventText}${seasonalText}${pressureText}`;
  state.pendingResult = {
    speaker: seasonalEvent?.speaker ?? getCardSpeaker(card),
    sceneTag: seasonalEvent?.sceneTag ?? (event ? event.title : sceneNameForTurn()),
    text: resultText,
    artwork: seasonalEvent?.artwork,
    artworkAlt: seasonalEvent?.artworkAlt,
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

function skipIntro() {
  if (!canUseSecondRunSkip()) {
    return;
  }

  if (state.screen === "profile" && state.profileSelectionLocked && state.pendingProfile) {
    selectProfile(state.pendingProfile);
    return;
  }

  state.screen = "target";
  state.introIndex = getProfile().intro.length - 1;
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

function tryApplySeasonalEvent() {
  const event = seasonalEvents.find((candidate) => candidate.triggerTurn === state.turn);
  if (!event) {
    return null;
  }

  applyEffects(event.effects);
  unlockEventCg(event.id);
  return event;
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
  const isLibraryScreen = state.screen === "endingBook" || state.screen === "eventGallery";
  const isArtworkViewer = state.screen === "artworkViewer";
  const isFullPageScreen = isLibraryScreen || isArtworkViewer;
  elements.novelStage.dataset.screen = state.screen;
  elements.novelStage.classList.toggle("novel-stage--profile", state.screen === "profile");
  elements.novelStage.classList.toggle("novel-stage--playing", state.screen === "choices" || state.screen === "result");
  elements.novelStage.classList.toggle("novel-stage--ending", state.screen === "ending");
  elements.novelStage.classList.toggle("novel-stage--collection", isFullPageScreen);
  elements.novelStage.classList.toggle(
    "novel-stage--route-centered",
    state.characterCentered && state.screen !== "profile" && state.screen !== "ending" && !isFullPageScreen,
  );
  elements.statsHud.hidden = isFullPageScreen || state.screen === "profile" || state.screen === "intro" || state.screen === "target";
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
  renderArtworkViewer();
  renderSkipIntroButton();

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
  if (state.pendingResult.artwork) {
    showArtwork(state.pendingResult.artwork, state.pendingResult.artworkAlt);
  } else {
    hideEndingArtwork();
  }
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
  renderEventGallery();
  showArtwork(ending.artwork, ending.artworkAlt);
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
  state.screen = "endingBook";
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
  elements.endingBookButton.textContent = `結末帳 ${unlockedCount}/${endingCatalog.length}`;
  if (isPage) {
    elements.endingBookButton.setAttribute("aria-current", "page");
  } else {
    elements.endingBookButton.removeAttribute("aria-current");
  }
  elements.endingBookCount.textContent = `${unlockedCount}/${endingCatalog.length} 解放`;
  elements.endingBookPanel.hidden = !isPage;
  elements.endingBookList.replaceChildren(...endingCatalog.map(createEndingRecord));
}

function openEventGalleryPage() {
  if (!hasEventGalleryAccess()) {
    return;
  }

  state.returnScreen = getReturnableScreen();
  state.screen = "eventGallery";
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

function renderEventGallery() {
  const isPage = state.screen === "eventGallery";
  const unlockedCount = state.unlockedEventCgIds.size;
  const hasAccess = hasEventGalleryAccess();
  elements.eventGalleryButton.hidden = !hasAccess;
  elements.eventGalleryButton.textContent = `回想帳 ${unlockedCount}/${seasonalEvents.length}`;
  if (isPage) {
    elements.eventGalleryButton.setAttribute("aria-current", "page");
  } else {
    elements.eventGalleryButton.removeAttribute("aria-current");
  }
  elements.eventGalleryCount.textContent = `${unlockedCount}/${seasonalEvents.length} 回収`;
  elements.eventGalleryPanel.hidden = !hasAccess || !isPage;
  elements.eventGalleryList.replaceChildren(...seasonalEvents.map(createEventGalleryRecord));
}

function returnFromLibraryPage() {
  state.screen = state.returnScreen || "choices";
  render();
}

function getReturnableScreen() {
  if (state.screen === "artworkViewer") {
    return state.artworkReturnScreen || "endingBook";
  }

  if (state.screen === "endingBook" || state.screen === "eventGallery") {
    return state.returnScreen || "choices";
  }

  return state.screen;
}

function openArtworkViewer(item, returnScreen) {
  state.artworkViewer = item;
  state.artworkReturnScreen = returnScreen;
  state.screen = "artworkViewer";
  render();
}

function returnFromArtworkViewer() {
  state.screen = state.artworkReturnScreen || "endingBook";
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
  return hasClearedOnce && (canSkipProfileAnimation || canSkipIntroScenes);
}

function renderSkipIntroButton() {
  elements.skipIntroButton.hidden = !canUseSecondRunSkip();
  elements.skipIntroButton.textContent = state.screen === "profile" ? "演出スキップ" : "導入スキップ";
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
    const knownIds = new Set(seasonalEvents.map((event) => event.id));
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

function saveUnlockedEventCgs() {
  try {
    window.localStorage.setItem(EVENT_CG_STORAGE_KEY, JSON.stringify([...state.unlockedEventCgIds]));
  } catch {
    // Event CG collection is optional local progress; gameplay should continue even if storage is unavailable.
  }
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
      resultLead: "紙袋の底に、マヂで熱い団結が残った。",
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
  if (state.screen === "endingBook") {
    return `結末帳 / ${state.unlockedEndingIds.size}/${endingCatalog.length}`;
  }

  if (state.screen === "eventGallery") {
    return `回想帳 / ${state.unlockedEventCgIds.size}/${seasonalEvents.length}`;
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
  elements.bgmButton.textContent = state.bgmEnabled ? "BGM ON" : "BGM OFF";
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

    for (const event of seasonalEvents) {
      const image = new Image();
      image.decoding = "async";
      image.src = event.artwork;
    }
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preload, { timeout: 4000 });
    return;
  }

  window.setTimeout(preload, 1200);
}
