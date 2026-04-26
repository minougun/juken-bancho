# Public URL Improvements

Date: 2026-04-27

## Scope

This local-only implementation addresses the harsh review items for the public Web build:

- OGP, meta description, canonical URL, and a concise in-game brand lead.
- Cleaner first-run HUD that avoids exposing developer-facing counts such as `復習帳 0/30000`.
- Browser `localStorage` current-run save for 144-week playthroughs.
- Status HUD forecast that shows current pass range, deficits, remaining weeks, and immediate risk flags.
- Target-school choice copy that exposes the practical win conditions before the run starts.

## Data And Security Notes

- No external API, auth, DB, analytics, payment, or deployment path was added.
- Current-run save uses `localStorage` key `jukenBancho.currentRun.v1`.
- Saved data is gameplay-only: turn, stats, selected profile, selected school, current screen, pending quiz/result state, and recent log text.
- Personal information and secrets are not stored.

## Deployment Note

Deployment should be performed by committing the relevant local changes to `main` and pushing to:

```text
https://github.com/minougun/juken-bancho
```

GitHub Pages production URL:

```text
https://minougun.github.io/juken-bancho/
```
