import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  cards,
  events,
  protagonistProfiles,
  seasonalEvents,
  statLabels,
  targetSchools,
} from "../web/data/game-data.js";

const statKeys = Object.keys(statLabels);
const strategies = ["balanced", "academic", "random", "social"];

const options = parseArgs(process.argv.slice(2));
const runs = Number(options.runs ?? 1000);
const outPath = resolve(options.out ?? "docs/balance-simulation-latest.csv");
const seedBase = Number(options.seed ?? 20260425);
const effectVariance = 1;

if (!Number.isInteger(runs) || runs <= 0) {
  throw new Error("--runs must be a positive integer");
}

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=");
    parsed[key] = inlineValue ?? args[index + 1];
    if (inlineValue === undefined) {
      index += 1;
    }
  }
  return parsed;
}

function createRng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function applyEffects(stats, effects) {
  for (const key of statKeys) {
    stats[key] = clamp((stats[key] ?? 0) + (effects[key] ?? 0), 0, 100);
  }
}

function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function rollEffects(effects, rng, variance = effectVariance) {
  const rolled = {};
  for (const key of statKeys) {
    const base = effects[key] ?? 0;
    if (!base) {
      rolled[key] = 0;
      continue;
    }
    const value = base + randomInt(rng, -variance, variance);
    rolled[key] = base > 0 ? Math.max(0, value) : Math.min(0, value);
  }
  return rolled;
}

function isLateStage(turn, totalTurns) {
  return turn >= totalTurns - 24;
}

function applyPressureRules(stats) {
  if (stats.stress >= 88) {
    applyEffects(stats, { academics: -6, trust: -3, face: -1, looks: -5, stamina: 0, stress: -10 });
  } else if (stats.stress >= 72) {
    applyEffects(stats, { academics: 0, trust: -1, face: 0, looks: -2, stamina: 0, stress: 0 });
  }

  if (stats.looks <= 35) {
    applyEffects(stats, { academics: 0, trust: -2, face: -2, looks: 0, stamina: 0, stress: 2 });
  }

  if (stats.stamina <= 6) {
    applyEffects(stats, { academics: 0, trust: 0, face: -4, looks: -1, stamina: 0, stress: 8 });
  }
}

function applyTargetSchoolPressure(stats, school, turn, totalTurns) {
  const isMonthlyCheck = turn > 0 && turn % 4 === 0;
  if (!isMonthlyCheck && !isLateStage(turn, totalTurns)) {
    return;
  }

  const stress = school.weeklyStress + (isLateStage(turn, totalTurns) ? school.lateStress : 0);
  const stamina = isLateStage(turn, totalTurns) ? -school.staminaDrain : 0;
  applyEffects(stats, { academics: 0, trust: 0, face: 0, looks: 0, stamina, stress });
}

function tryApplyRandomEvent(stats, turn, rng) {
  for (const event of events) {
    if (turn < event.minTurn) {
      continue;
    }
    if (event.gateStat && stats[event.gateStat] > event.gateBelowOrEqual) {
      continue;
    }
    if (rng() <= event.chance) {
      applyEffects(stats, rollEffects(event.effects, rng));
      return event.id;
    }
  }
  return null;
}

function scoreChoice(choice, stats, school, strategy) {
  const effects = choice.effects;
  if (strategy === "random") {
    return 0;
  }

  const academicNeed = stats.academics < school.passAcademic ? 1 : 0.35;
  const trustNeed = stats.trust < school.passTrust ? 1 : 0.45;
  const faceNeed = stats.face < school.passFace ? 1 : 0.45;
  const staminaNeed = stats.stamina < 32 ? 1 : 0.25;
  const stressNeed = stats.stress > 60 ? 1 : 0.35;

  if (strategy === "academic") {
    return (
      (effects.academics ?? 0) * 4 +
      (effects.trust ?? 0) * trustNeed +
      (effects.face ?? 0) * faceNeed +
      (effects.stamina ?? 0) * staminaNeed -
      (effects.stress ?? 0) * stressNeed
    );
  }

  if (strategy === "social") {
    return (
      (effects.trust ?? 0) * 3 +
      (effects.face ?? 0) * 3 +
      (effects.looks ?? 0) * 1.2 +
      (effects.academics ?? 0) * academicNeed +
      (effects.stamina ?? 0) * staminaNeed -
      (effects.stress ?? 0) * stressNeed
    );
  }

  return (
    (effects.academics ?? 0) * (2 * academicNeed) +
    (effects.trust ?? 0) * (1.5 * trustNeed) +
    (effects.face ?? 0) * (1.5 * faceNeed) +
    (effects.looks ?? 0) +
    (effects.stamina ?? 0) * staminaNeed -
    (effects.stress ?? 0) * stressNeed
  );
}

function chooseSeasonalChoice(choices, stats, school, strategy, rng) {
  if (strategy === "random") {
    return choices[Math.floor(rng() * choices.length)];
  }

  return choices
    .map((choice) => ({ choice, score: scoreChoice(choice, stats, school, strategy) }))
    .sort((a, b) => b.score - a.score)[0].choice;
}

function tryApplySeasonalEvent(stats, turn, profile, school, strategy, rng) {
  const event = seasonalEvents.find((candidate) => candidate.triggerTurn === turn);
  if (!event) {
    return null;
  }

  applyEffects(stats, rollEffects(event.effects, rng));
  const choices = event.routes?.[profile.id]?.choices ?? [];
  if (choices.length) {
    const choice = chooseSeasonalChoice(choices, stats, school, strategy, rng);
    applyEffects(stats, rollEffects(choice.effects, rng));
  }
  return event.id;
}

function isCardAvailable(card, state) {
  return state.turn >= card.unlockTurn && state.stats.stamina >= card.minStamina && !(card.oneShot && state.usedCardIds.has(card.id));
}

function byId(available, id) {
  return available.find((card) => card.id === id);
}

function chooseCard(state, school, strategy, rng) {
  const available = cards.filter((card) => isCardAvailable(card, state));
  if (available.length === 0) {
    return cards.find((card) => card.id === "sleep_early");
  }

  const sleep = byId(available, "sleep_early");
  const study = byId(available, "study_library");
  const cram = byId(available, "cram_school");
  const ramen = byId(available, "ramen_meeting");
  const rescue = byId(available, "rescue_fight");
  const mock = byId(available, "mock_exam");
  const finalSprint = byId(available, "final_sprint");

  if (strategy === "random") {
    return available[Math.floor(rng() * available.length)];
  }

  if (state.stats.stamina <= 16 || state.stats.stress >= 78) {
    return sleep ?? available[0];
  }

  if (strategy === "academic") {
    if (state.stats.academics < school.passAcademic) {
      return finalSprint ?? mock ?? study ?? cram ?? available[0];
    }
    if (state.stats.trust < school.passTrust + 4) {
      return ramen ?? cram ?? available[0];
    }
    if (state.stats.face < school.passFace + 4) {
      return rescue ?? study ?? available[0];
    }
    return cram ?? ramen ?? available[0];
  }

  if (strategy === "social") {
    if (state.stats.trust < school.passTrust + 18) {
      return ramen ?? cram ?? available[0];
    }
    if (state.stats.face < school.passFace + 18 && state.stats.stamina >= 28) {
      return rescue ?? study ?? available[0];
    }
    if (state.stats.academics < school.passAcademic) {
      return cram ?? study ?? available[0];
    }
    return sleep ?? available[0];
  }

  if (state.stats.trust < school.passTrust + 8) {
    return ramen ?? cram ?? available[0];
  }
  if (state.stats.face < school.passFace + 6 && state.stats.stamina >= 28) {
    return rescue ?? study ?? available[0];
  }
  if (state.stats.academics < school.passAcademic) {
    if (state.stats.stamina >= 30 && state.stats.stress < 62) {
      return finalSprint ?? mock ?? study ?? cram ?? available[0];
    }
    return cram ?? study ?? available[0];
  }
  if (state.stats.stress >= 58 || state.stats.stamina < 32) {
    return sleep ?? available[0];
  }
  return ramen ?? cram ?? available[0];
}

function resolveEnding(stats, school, profile) {
  if (stats.academics >= school.passAcademic && stats.trust >= school.passTrust && stats.face >= school.passFace) {
    return profile.id === "gyaru" ? "passed_gyaru" : "passed_bancho";
  }
  if (stats.academics >= school.passAcademic) {
    return profile.id === "gyaru" ? "lonely_gyaru" : "lonely_pass";
  }
  if (stats.academics >= school.waitlistAcademic && stats.trust >= school.waitlistTrust && stats.face >= school.waitlistFace) {
    return profile.id === "gyaru" ? "waitlist_gyaru" : "waitlist_legend";
  }
  if (stats.trust >= 82 && stats.face >= 82) {
    return profile.id === "gyaru" ? "legend_gyaru" : "bancho_legend";
  }
  return profile.id === "gyaru" ? "failed_gyaru" : "failed";
}

function runSimulation(profile, school, strategy, seed) {
  const rng = createRng(seed);
  const state = {
    turn: 0,
    totalTurns: school.totalTurns,
    stats: { ...profile.initialStats },
    usedCardIds: new Set(),
    cardUse: new Map(),
  };

  while (state.turn < state.totalTurns) {
    const card = chooseCard(state, school, strategy, rng);
    state.turn += 1;
    applyEffects(state.stats, rollEffects(card.effects, rng));
    state.cardUse.set(card.id, (state.cardUse.get(card.id) ?? 0) + 1);
    if (card.oneShot) {
      state.usedCardIds.add(card.id);
    }
    tryApplyRandomEvent(state.stats, state.turn, rng);
    tryApplySeasonalEvent(state.stats, state.turn, profile, school, strategy, rng);
    applyTargetSchoolPressure(state.stats, school, state.turn, state.totalTurns);
    applyPressureRules(state.stats);
  }

  return {
    ending: resolveEnding(state.stats, school, profile),
    stats: state.stats,
    cardUse: state.cardUse,
  };
}

function classifyEnding(id) {
  if (id.startsWith("passed_")) return "fullPass";
  if (id.startsWith("lonely_") || id === "lonely_pass") return "accepted";
  if (id.startsWith("waitlist_") || id === "waitlist_legend") return "waitlist";
  if (id.includes("legend")) return "legend";
  return "failed";
}

function pct(value, total) {
  return (value / total).toFixed(3);
}

function average(total, count) {
  return (total / count).toFixed(1);
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const rows = [];
const consoleRows = [];

for (const profile of protagonistProfiles) {
  for (const school of targetSchools) {
    for (const strategy of strategies) {
      const counts = { fullPass: 0, accepted: 0, waitlist: 0, legend: 0, failed: 0 };
      const statTotals = Object.fromEntries(statKeys.map((key) => [key, 0]));
      const cardTotals = new Map();

      for (let run = 0; run < runs; run += 1) {
        const result = runSimulation(profile, school, strategy, seedBase + run + school.deviation * 101 + profile.id.length * 17 + strategy.length * 1009);
        counts[classifyEnding(result.ending)] += 1;
        for (const key of statKeys) {
          statTotals[key] += result.stats[key];
        }
        for (const [cardId, count] of result.cardUse) {
          cardTotals.set(cardId, (cardTotals.get(cardId) ?? 0) + count);
        }
      }

      const topCards = [...cardTotals.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([id, count]) => `${id}:${average(count, runs)}`)
        .join(" ");

      const acceptedTotal = counts.fullPass + counts.accepted;
      const row = {
        profile: profile.id,
        school: school.id,
        schoolName: school.name,
        deviation: school.deviation,
        strategy,
        runs,
        fullPassRate: pct(counts.fullPass, runs),
        acceptedRate: pct(acceptedTotal, runs),
        waitlistRate: pct(counts.waitlist, runs),
        legendRate: pct(counts.legend, runs),
        failedRate: pct(counts.failed, runs),
        avgAcademics: average(statTotals.academics, runs),
        avgTrust: average(statTotals.trust, runs),
        avgFace: average(statTotals.face, runs),
        avgLooks: average(statTotals.looks, runs),
        avgStamina: average(statTotals.stamina, runs),
        avgStress: average(statTotals.stress, runs),
        topCards,
      };
      rows.push(row);
      consoleRows.push({
        profile: row.profile,
        school: row.school,
        strategy: row.strategy,
        accepted: row.acceptedRate,
        full: row.fullPassRate,
        failed: row.failedRate,
        academic: row.avgAcademics,
        topCards: row.topCards,
      });
    }
  }
}

const headers = Object.keys(rows[0]);
const csv = [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
].join("\n");

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${csv}\n`, "utf8");

console.table(consoleRows);
console.log(`Balance simulation wrote ${rows.length} rows to ${outPath}`);
