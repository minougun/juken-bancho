# Cursor Review Request: 受験番長 Prototype

Date: 2026-04-25
Project path: `/mnt/c/Users/minou/juken-bancho/`
Local test URL: `http://127.0.0.1:43361/`

## Review Goal

「受験番長」というノベルゲーム風スケジュール管理ゲームのローカル試作をレビューしてください。

重点は、Webブラウザ版のプレイ体験、ノベルゲームUIとしての読みやすさ、ゲームループの分かりやすさ、今後Unity版へ移植しやすい構造になっているかです。

## Product Summary

主人公は高校の番長。仲間からの人望と番長としてのメンツを守りながら、受験合格に必要な勉強時間も確保する。

現在のWeb版は以下の流れです。

1. 導入モノローグで世界観とルールを説明
2. 放課後ごとに予定を1つ選択
3. `学力 / 人望 / メンツ / 体力 / ストレス` が変動
4. ランダムイベントが起きることがある
5. 18ターン後にエンディング分岐

## Main Files To Review

### Web Prototype

- `/mnt/c/Users/minou/juken-bancho/web/index.html`
- `/mnt/c/Users/minou/juken-bancho/web/styles.css`
- `/mnt/c/Users/minou/juken-bancho/web/app.js`
- `/mnt/c/Users/minou/juken-bancho/web/server.mjs`

### Assets

- `/mnt/c/Users/minou/juken-bancho/web/assets/images/protagonist-bancho-transparent.png`
- `/mnt/c/Users/minou/juken-bancho/web/assets/images/protagonist-bancho.png`
- `/mnt/c/Users/minou/juken-bancho/web/assets/audio/flesh-and-blood.mp3`

### Unity Prototype

- `/mnt/c/Users/minou/juken-bancho/Assets/Scripts/Runtime/Core/`
- `/mnt/c/Users/minou/juken-bancho/Assets/Scripts/Runtime/UI/`
- `/mnt/c/Users/minou/juken-bancho/Assets/Tests/EditMode/`
- `/mnt/c/Users/minou/juken-bancho/Assets/Scenes/Game.unity`

### Docs

- `/mnt/c/Users/minou/juken-bancho/docs/game-design.md`
- `/mnt/c/Users/minou/juken-bancho/docs/handoff.md`
- `/mnt/c/Users/minou/juken-bancho/docs/persona-review-2026-04-25.md`
- `/mnt/c/Users/minou/juken-bancho/docs/third-party-notices.md`

## How To Run

```bash
cd /mnt/c/Users/minou/juken-bancho
PORT=43361 node web/server.mjs
```

Open:

```text
http://127.0.0.1:43361/
```

If port `43361` is already in use, run with another port:

```bash
PORT=43362 node web/server.mjs
```

## Review Checklist

### UX / Game Feel

- Does the opening monologue explain the premise and rules without feeling too long?
- Does the visual novel UI make the game easier to understand than the previous card dashboard style?
- Are the choices understandable and satisfying?
- Does the player understand why stats change?
- Is the `次へ` / `予定を決める` flow natural?
- Is the BGM control discoverable and not annoying?

### Visual Design

- Does the protagonist sprite sit naturally in the stage layout?
- Does the transparent cutout have visible halo or leftover checkerboard artifacts?
- Does the dialogue box preserve readability over the background and sprite?
- Does mobile layout keep the sprite, HUD, choices, and text from overlapping?
- Does the design still feel like a game, not just a form UI?

### Code Quality

- Is `web/app.js` too large or should it be split into data, state, rendering, and audio modules?
- Are state transitions clear enough: `intro`, `choices`, `result`, `ending`?
- Are generated DOM nodes created safely? Current implementation avoids `innerHTML`.
- Are event listeners and button state changes robust?
- Is the stat/effect logic easy to port back to Unity?

### Balance / Content

- Are the initial stats and card effects reasonable?
- Is there a viable path for `合格番長`, `孤独な合格`, `補欠の伝説`, `番長伝説`, and `不合格`?
- Are the random event probabilities too subtle?
- Does the tone stay熱血コメディ without glorifying violence too much?
- What 3 content additions would most improve replayability?

### Security / Safety

- The current Web build is static/local only.
- No login, DB, external API calls, uploads, analytics, or persistence.
- Check that `server.mjs` path handling cannot serve files outside `/web/`.
- Check that no secrets or environment files are referenced.
- Check that third-party asset attribution/license notes are sufficient.

## Known Constraints

- This is a local prototype, not a production release.
- Unity Editor was not available in the current environment, so Unity compile/tests were not executed here.
- Web版 is the main playable target for current review.
- The protagonist image was generated and then mechanically background-removed with Pillow. It may still need professional cleanup.
- The current BGM is CC0 from OpenGameArt. See `/mnt/c/Users/minou/juken-bancho/docs/third-party-notices.md`.

## Requested Output From Cursor

Please return findings in this order:

1. Critical bugs or blockers
2. High-impact UX/design issues
3. Code structure issues
4. Game balance/content issues
5. Security/licensing concerns
6. Quick wins
7. Suggested next implementation plan

Use file paths and line numbers where possible.

## Current Status Notes

- Issue: `not_applicable` because this is a local prototype and no GitHub repo/PR has been created.
- Commit: `not_applicable`; local changes are uncommitted.
- PR: `not_applicable`; not published.
