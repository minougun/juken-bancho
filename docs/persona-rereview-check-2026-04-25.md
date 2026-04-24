# Persona Re-Review Check

Date: 2026-04-25
Review source: `/mnt/c/Users/minou/juken-bancho/docs/persona-rereview-2026-04-25.md`
Project path: `/mnt/c/Users/minou/juken-bancho/`

## Read Summary

Cursor's second persona review raised the prototype average to `77 / 100`. The review says the prior follow-up improved tone, event impact, result text, and accessibility. Remaining high-value issues are:

- add sub-character faces or icons
- document and tune random event draw rules
- reduce Web/C# content duplication
- audit remaining rough delinquent metaphors
- avoid noisy accessibility labels

## Applied In This Pass

- Removed the direct out-of-world disclaimer from the opening monologue.
- Replaced visible test/meta UI text:
  - the header now uses an in-world after-school label
  - instructional scene tags now use in-world labels such as `作戦確認`
  - run-time expectation text was removed from story text
  - the HUD now counts remaining weeks instead of abstract turns
- Softened remaining metaphor wording:
  - the study-room card title now avoids attack-language phrasing
  - the mock-exam subtitle now focuses on facing the score sheet
- Synced the text changes to Unity-facing default content.

## Event Draw Rule Note

Current Web event logic checks `events` from top to bottom and fires the first eligible event whose random check succeeds. This means:

- at most one random event can fire per week
- earlier events get the first chance
- late rare events can feel rarer than their listed chance if earlier events fire first

This is acceptable for the current prototype because it keeps each result scene readable. If event count grows, split the event pool into tiers:

- normal event slot: common school/life events
- rare event slot: late-game big incidents
- story-chain slot: explicit multi-week arcs

## Deferred

- Named sub-character icons/portraits
- Shared JSON content master for Web and Unity
- Full `web/app.js` module split
- Automated ending reachability simulation
- Professional cleanup of protagonist cutout

## Issue / Commit / PR

- Issue: `not_applicable` because this remains a local prototype.
- Commit: `not_applicable`; local changes are uncommitted.
- PR: `not_applicable`; not published.
