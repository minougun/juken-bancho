# 受験番長

Unity 向けのスマホ縦画面スケジュール管理ゲーム MVP です。

プレイヤーは高校の番長として、仲間からの人望と番長としてのメンツを守りながら、受験合格に必要な勉強時間を確保します。初版は 1 周 10 分以内で遊べるカード選択式プロトタイプです。

## Project

- Local path: `/mnt/c/Users/minou/juken-bancho/`
- Engine target: Unity 2022.3 LTS 系を想定
- Orientation: Portrait
- External services: none
- Runtime data: local only

## How to Open

1. Unity Hub で `/mnt/c/Users/minou/juken-bancho/` を開く。
2. `Assets/Scenes/Game.unity` を開く。
3. Play を押す。

`JukenBanchoBootstrap` が起動時に UI を自動生成するため、シーンに手動で Canvas を配置しなくてもプレイできます。

## Web Test Build

Unity が無い環境でも確認できる静的 Web 版があります。

```bash
cd /mnt/c/Users/minou/juken-bancho
node web/server.mjs
```

Open: `http://127.0.0.1:4173/`

If that port is already in use:

```bash
PORT=43361 node web/server.mjs
```

The Web test build includes local BGM:

- File: `/mnt/c/Users/minou/juken-bancho/web/assets/audio/flesh-and-blood.mp3`
- Source: `https://opengameart.org/content/punk-hardcore`
- License: CC0

Generated protagonist sprite:

- Source generated image: `/home/minougun/.codex-wsl/generated_images/019dc099-3099-7753-9c28-0b7765b5c4f6/ig_006224a6bc4aed830169ebb4f16384819189dc7d98f15400b9.png`
- Project copy: `/mnt/c/Users/minou/juken-bancho/web/assets/images/protagonist-bancho.png`
- Transparent project sprite: `/mnt/c/Users/minou/juken-bancho/web/assets/images/protagonist-bancho-transparent.png`

Ending presentation:

- Web版はエンディングごとに一枚絵と専用BGMへ切り替えます。
- Ending CG directory: `/mnt/c/Users/minou/juken-bancho/web/assets/images/endings/`
- Ending BGM directory: `/mnt/c/Users/minou/juken-bancho/web/assets/audio/endings/`
- Asset notices: `/mnt/c/Users/minou/juken-bancho/docs/third-party-notices.md`
- Ending CG prompts: `/mnt/c/Users/minou/juken-bancho/docs/ending-cg-prompts-2026-04-25.md`

Persona review:

- `/mnt/c/Users/minou/juken-bancho/docs/persona-review-2026-04-25.md`

Cursor review request:

- `/mnt/c/Users/minou/juken-bancho/docs/cursor-review-request-2026-04-25.md`
- `/mnt/c/Users/minou/juken-bancho/docs/cursor-review-response-2026-04-25.md`
- `/mnt/c/Users/minou/juken-bancho/docs/cursor-rereview-request-2026-04-25.md`
- `/mnt/c/Users/minou/juken-bancho/docs/persona-rereview-check-2026-04-25.md`

Ending completion:

- Web版は `結末帳` に到達済みエンディングを記録します。
- 保存先はブラウザの `localStorage` で、保存内容はエンディングIDのみです。

Target school difficulty:

- Web版はプロローグ後に志望校を選びます。
- 志望校の偏差値が高いほど、合格に必要な学力、人望/メンツ条件、毎週の受験圧が上がります。
- 志望校選択はプレイ中の条件であり、ブラウザ保存はしません。

## Verification

Unity Editor が利用できる環境では EditMode tests を実行してください。

- Test assembly: `Assets/Tests/EditMode/JukenBancho.EditModeTests.asmdef`
- Core tests: `Assets/Tests/EditMode/JukenBanchoCoreTests.cs`

この環境では Unity / Unity Hub / C# compiler が検出できなかったため、ローカルではファイル生成と静的確認までを行います。
