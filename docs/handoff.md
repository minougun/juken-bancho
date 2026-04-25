# 受験番長 Handoff

## Status

Unity プロジェクトの骨格、実行時自動生成 UI、カード選択ゲームロジック、EditMode テストを追加済み。
テスト用の静的 Web 版も `/mnt/c/Users/minou/juken-bancho/web/` に追加済み。

## Local Paths

- Project: `/mnt/c/Users/minou/juken-bancho/`
- Scene: `/mnt/c/Users/minou/juken-bancho/Assets/Scenes/Game.unity`
- Core logic: `/mnt/c/Users/minou/juken-bancho/Assets/Scripts/Runtime/Core/`
- UI runtime: `/mnt/c/Users/minou/juken-bancho/Assets/Scripts/Runtime/UI/`
- Tests: `/mnt/c/Users/minou/juken-bancho/Assets/Tests/EditMode/`
- Web test build: `/mnt/c/Users/minou/juken-bancho/web/`
- Web BGM: `/mnt/c/Users/minou/juken-bancho/web/assets/audio/flesh-and-blood.mp3`
- Web ending BGM: `/mnt/c/Users/minou/juken-bancho/web/assets/audio/endings/`
- Web protagonist source sprite: `/mnt/c/Users/minou/juken-bancho/web/assets/images/protagonist-bancho.png`
- Web protagonist transparent sprite: `/mnt/c/Users/minou/juken-bancho/web/assets/images/protagonist-bancho-transparent.png`
- Web ending CGs: `/mnt/c/Users/minou/juken-bancho/web/assets/images/endings/`
- Web seasonal event CGs: `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/`
- Third-party notices: `/mnt/c/Users/minou/juken-bancho/docs/third-party-notices.md`
- Persona review: `/mnt/c/Users/minou/juken-bancho/docs/persona-review-2026-04-25.md`
- Cursor review request: `/mnt/c/Users/minou/juken-bancho/docs/cursor-review-request-2026-04-25.md`
- Cursor review response: `/mnt/c/Users/minou/juken-bancho/docs/cursor-review-response-2026-04-25.md`
- Cursor re-review request: `/mnt/c/Users/minou/juken-bancho/docs/cursor-rereview-request-2026-04-25.md`
- Persona re-review check: `/mnt/c/Users/minou/juken-bancho/docs/persona-rereview-check-2026-04-25.md`
- Ending CG prompts: `/mnt/c/Users/minou/juken-bancho/docs/ending-cg-prompts-2026-04-25.md`
- Event CG prompts: `/mnt/c/Users/minou/juken-bancho/docs/event-cg-prompts-2026-04-25.md`

## GitHub / Issue / PR

- Issue/PR: not_applicable
- Reason: 新規ローカルプロトタイプで、外部投稿・公開・リポジトリ作成の明示確認がまだ無いため。

## Follow-up

- Unity Editor で開き、UI の実機解像度確認を行う。
- Web 版でルール調整を先に行い、固まった内容を Unity 側へ反映する。
- Web版の結末帳は `localStorage` にエンディングIDだけを保存する。秘密情報や個人情報は保存しない。
- Web版のゲームデータは `/mnt/c/Users/minou/juken-bancho/web/data/game-data.js` に分離し、`web/app.js` と検証スクリプトから共通利用する。
- データ整合性は `npm run check` で確認する。カード/イベント/志望校/主人公のID重複、効果値、ステータスキーを検証する。
- バランス検証は `npm run simulate:balance -- --runs 1000 --out docs/balance-simulation-latest.csv` で実行する。説明は `/mnt/c/Users/minou/juken-bancho/docs/balance-simulation.md`。
- レスポンシブ検証は `npm run test:responsive` で実行する。390x844、360x800、844x390、1280x800で主人公選択から週次選択まで確認し、スクリーンショットを `/mnt/c/Users/minou/juken-bancho/test-results/responsive-matrix/` に出力する。
- Web版はプロローグ後に志望校を選ぶ。志望校ごとに偏差値、合格学力、人望/メンツ条件、月末と終盤の受験圧が変わる。
- Web版は `ルックス` ステータスを持つ。ストレスが高いとルックスと人望が落ち、ルックスが低いと人望/メンツにも追加ペナルティが入る。
- Web版の週次カードは、`自習室に乗り込む` が高学力・高負荷でメンツも立つ攻めの学習、`補習を受ける` が低負荷の信頼寄り学習という役割で差別化している。
- Web版は最初に `受験番長` / `優等生ギャル` の主人公を選ぶ。ギャルルートは別立ち絵、別導入、別リアクション、別エンディングCGを使う。
- 主人公選択後は選んだキャラが中央へ寄り、もう一方がフェードアウトしてからプロローグへ入る。選択後の立ち絵は、プロローグ終了後の志望校選択・週次選択でも中央配置を維持する。`prefers-reduced-motion` では即時遷移する。
- Web版は高校1年春の入学式から3年冬の卒業式まで、全144週で進行する。
- Web版は週ごとの学校行事名を表示するが、BGMは1学期、夏休み、2学期、3学期の区切りだけで切り替える。学期BGMは `/mnt/c/Users/minou/juken-bancho/web/assets/audio/seasons/`。
- 季節BGMは、春/1学期が `Springtechno`、夏休みが `Summer Park - 8bit tune (loop)`、秋/2学期が `Autumn - mp3 Free music`、冬/3学期が `Wintery loop`。埋め込みBGMはすべてOpenGameArt.org上でCC0として扱える素材に統一している。
- Web版は1学期、夏休み、2学期、3学期に固定イベントを持つ。各イベントは専用一枚絵を表示し、回収済みCG IDを `localStorage` の `jukenBancho.unlockedEventCgs.v1` に保存する。
- Web版の `結末帳` と `回想帳` はポップアップではなく、ステージ内の独立ページとして遷移する。回収済みの結末/イベント一枚絵はサムネイルを選ぶと全画面ビューアで表示する。
- Web版は初回クリア後に `回想帳` を表示する。回想帳では回収済みの季節イベント一枚絵を一覧し、未回収イベントは伏せ字で表示する。
- Web版はエンディングごとに一枚絵と専用BGMへ切り替える。BGMがOFFの場合は、エンディング到達時も自動再生しない。BGMボタンは効果音ボタンと同じく `BGM ON/OFF` の状態表示にする。
- Web版は2周目以降、主人公選択演出中に `演出スキップ`、プロローグ中に `導入スキップ` を表示する。解放条件は `localStorage` の結末帳に1件以上のエンディングIDがあること。
- Web版は全ボタンクリック時に Web Audio で短い効果音を合成する。外部効果音素材は追加していない。`効果音ON/OFF` ボタンで切り替える。
- Web版のスマホ表示は、上部3ボタン、2列ステータスHUD、下部スクロール式ダイアログを基本にする。画面遷移時はダイアログ枠内スクロールを先頭へ戻す。
- Web版のスマホ初期画面は、主人公選択カードを2列のコンパクト表示にし、390x844、360x800、375x667、320x568、844x390でスクロールなしに読めることを確認する。`npm run test:responsive` でも初期画面の縦あふれを検出する。
- Unity 側へ BGM を移す場合は、`flesh-and-blood.mp3` を AudioClip として取り込み、音量初期値を Web 版同様に控えめにする。
- Unity 側へ主人公立ち絵を移す場合は、`protagonist-bancho-transparent.png` を Sprite として取り込む。
- ノベルゲーム方向を強めるなら、立ち絵/顔アイコンとカード選択後の会話リアクションを優先する。
- 立ち絵・背景を追加する場合は、生成画像または手描き素材の方針を決める。
- Android 実機配布を行う前に package name、署名、アイコン、ビルド設定を確定する。
