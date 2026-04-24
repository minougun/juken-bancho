import {
  cards,
  endingCatalog,
  events,
  protagonistProfiles,
  seasonalEvents,
  statLabels,
  targetSchools,
} from "../web/data/game-data.js";

const statKeys = Object.keys(statLabels);

function fail(message) {
  throw new Error(message);
}

function assertUniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item.id) {
      fail(`${label} has an item without id`);
    }
    if (seen.has(item.id)) {
      fail(`${label} has duplicate id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function assertEffectShape(effects, label) {
  for (const key of Object.keys(effects)) {
    if (!statKeys.includes(key)) {
      fail(`${label} has unknown stat key: ${key}`);
    }
    if (!Number.isInteger(effects[key])) {
      fail(`${label}.${key} must be an integer`);
    }
  }
}

assertUniqueIds(protagonistProfiles, "protagonistProfiles");
assertUniqueIds(targetSchools, "targetSchools");
assertUniqueIds(endingCatalog, "endingCatalog");
assertUniqueIds(seasonalEvents, "seasonalEvents");
assertUniqueIds(cards, "cards");
assertUniqueIds(events, "events");

for (const profile of protagonistProfiles) {
  for (const key of statKeys) {
    if (!Number.isInteger(profile.initialStats[key])) {
      fail(`${profile.id}.initialStats.${key} must be an integer`);
    }
  }
  if (!Array.isArray(profile.intro) || profile.intro.length === 0) {
    fail(`${profile.id} must have intro scenes`);
  }
}

for (const school of targetSchools) {
  for (const key of ["totalTurns", "passAcademic", "passTrust", "passFace", "waitlistAcademic", "waitlistTrust", "waitlistFace"]) {
    if (!Number.isInteger(school[key])) {
      fail(`${school.id}.${key} must be an integer`);
    }
  }
  if (school.waitlistAcademic > school.passAcademic) {
    fail(`${school.id}.waitlistAcademic must not exceed passAcademic`);
  }
}

for (const card of cards) {
  assertEffectShape(card.effects, `card ${card.id}`);
  if (!Number.isInteger(card.minStamina) || card.minStamina < 0) {
    fail(`${card.id}.minStamina must be a non-negative integer`);
  }
  if (!Number.isInteger(card.unlockTurn) || card.unlockTurn < 0) {
    fail(`${card.id}.unlockTurn must be a non-negative integer`);
  }
}

for (const event of seasonalEvents) {
  assertEffectShape(event.effects, `seasonal event ${event.id}`);
  if (!Number.isInteger(event.triggerTurn) || event.triggerTurn <= 0) {
    fail(`${event.id}.triggerTurn must be a positive integer`);
  }
  if (!event.artwork || !event.artworkAlt) {
    fail(`${event.id} must have artwork and artworkAlt`);
  }
}

for (const event of events) {
  assertEffectShape(event.effects, `event ${event.id}`);
  if (typeof event.chance !== "number" || event.chance < 0 || event.chance > 1) {
    fail(`${event.id}.chance must be between 0 and 1`);
  }
  if (event.gateStat && !statKeys.includes(event.gateStat)) {
    fail(`${event.id}.gateStat is unknown: ${event.gateStat}`);
  }
}

console.log(
  `Data integrity ok: ${protagonistProfiles.length} profiles, ${targetSchools.length} schools, ${cards.length} cards, ${seasonalEvents.length} seasonal events, ${events.length} random events.`,
);
