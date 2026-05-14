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
- Web版は進行中プレイを `localStorage` の `jukenBancho.currentRun.v1` に保存し、初回画面の `続きから` で再開できる。保存対象はターン、ステータス、主人公、志望校、現在画面、進行中の結果/問題などのゲーム進行データのみで、個人情報や秘密情報は保存しない。復元時は既知の問題IDと既知の季節イベント画像だけを採用し、localStorage の任意オブジェクトをそのまま状態に戻さない。
- Web版のゲームデータは `/mnt/c/Users/minou/juken-bancho/web/data/game-data.js` に分離し、`web/app.js` と検証スクリプトから共通利用する。
- データ整合性は `npm run check` で確認する。カード/イベント/志望校/主人公のID重複、効果値、ステータスキーを検証する。
- バランス検証は `npm run simulate:balance -- --runs 1000 --out docs/balance-simulation-latest.csv` で実行する。説明は `/mnt/c/Users/minou/juken-bancho/docs/balance-simulation.md`。
- レスポンシブ検証は `npm run test:responsive` で実行する。390x844、360x800、844x390、1280x800で主人公選択、導入、志望校、週次選択、五科目チェック、復習帳、最初の季節イベント分岐、結末帳、回想帳、全画面一枚絵まで確認し、スクリーンショットを `/mnt/c/Users/minou/juken-bancho/test-results/responsive-matrix/` に出力する。BGM OFF のまま初期フローを進めても `.mp3` / `.ogg` を読まないことも検出する。
- Web版はプロローグ後に志望校を選ぶ。志望校ごとに偏差値、合格学力、人望/メンツ条件、月末と終盤の受験圧が変わる。
- Web版は `ルックス` ステータスを持つ。内部キーは `looks`。ルックスは、顔立ち、睡眠、清潔感、表情、声の張り、肌や髪の調子を含めた対人コンディションとして扱う。高校生活で見た目が評価される現実から逃げず、顔立ちへの自信のなさ、寝不足や焦り、返事の短さ、表情の硬さ、制服や髪の荒れが重なると、人望/メンツにも追加ペナルティが入る。
- Web版は8週ごとに `ルックス` と `メンツ` の高低を見て、学校内での見られ方イベントを出す。高ルックス/高メンツは存在感で場を制し、高ルックス/低メンツは「見た目だけ」と見られ、低ルックス/高メンツは泥臭く信用され、低ルックス/低メンツは説明しない不調まで印象として数えられる。
- Web版の週次カードは、`自習室に乗り込む` が高学力・高負荷でメンツも立つ攻めの学習、`鬼塚の補習に頭を下げる` が低負荷の信頼寄り学習という役割で差別化している。主要7カードはタグ共通ではなくカード固有のキャラ反応を持ち、鉄平、ミナ、鬼塚先生、黒羽レンの欲や不安が少しずつ見えるようにする。
- Web版の学習系カード（`study` / `teacher` / `exam`）を選ぶと、ターン消費前に任意の五科目チェックが入る。問題は国語・数学・英語・理科・社会からランダムに1問出題し、正解ならその予定の学力上昇に `+1`、不正解でも通常の予定効果は残る。`解かずに予定へ進む` で見送ることもできる。正解/不正解には鬼塚先生や黒羽レンの反応を出し、3連続正解で集中コンボを表示する。問題範囲は文科省の高等学校学習指導要領・解説ページ（`https://www.mext.go.jp/a_menu/shotou/new-cs/1407074.htm`）を基準にした高校基礎内容として扱う。
- Web版の五科目チェック問題は、元の30問を各1000バリアントへ展開可能な合計30,000問の出題プールとして扱う。初回ロードでは30,000件を実体化せず、`web/data/game-data.js` の `baseId + variantIndex` 生成で出題時と復習帳表示時に必要分だけ作る。英語/国語/理科/社会のテンプレートは15前後以上の論点へ拡張し、`scripts/check-data-integrity.mjs` で prompt 重複、選択肢重複、同一正答/選択肢セットの過剰再利用を検出する。既存の元問題IDは variant 0 として残すため、復習帳の旧記録は維持される。
- Web版の `模試を正面突破` と `赤本最終作戦` は、選択中の志望校に応じて専用の五科目チェック問題プールを使う。`城北実学大学` は基礎実戦型、`東都学院大学` はMARCH相当の中堅上位私大型、`帝王義塾大学` は早慶相当の難関私大型、`国立天嶺大学` は東大相当の最難関国立型として出題傾向を分ける。実在大学の過去問本文は権利確認なしにそのまま収録せず、高校学習範囲に基づくオリジナル問題として管理する。
- Web版の `国立天嶺大学` は学力マイルストーンを持つ。1年終了時に学力70未満ならストレス+8、2年終了時に学力92未満ならストレス+10とメンツ-3、3年秋に学力96未満ならストレス+12。最高難易度で丸い立ち回りだけが強くなりすぎることを抑えつつ、balanced 戦略も主ルートとして残るように調整する。
- Web版の五科目チェックで出題された問題は、上部HUDの `復習帳` から独立ページとして確認できる。復習帳は `localStorage` の `jukenBancho.studyReview.v1` に問題ID、回答回数、正解数、最後の回答を保存し、正答・最後の回答・解説を表示する。個人情報は保存しない。
- Web版は最初に `受験番長` / `優等生ギャル` の主人公を選ぶ。ギャルルートは別立ち絵、別導入、別リアクション、別エンディングCGを使う。
- 初回導入は、キャラ選択後に主人公の短い一人語りを挟み、三年間の予定選択、学力/人望/メンツ/ルックス管理、卒業式までの目標を説明する。その後、番長ルートでは舎弟の鉄平、ギャルルートでは親友のミナの進路相談から始まる事件三択へ入る。ミナは最初から受験勉強の相棒ではなく、主人公が頑張る姿に触発され、高2後半から大学受験を自分の目標として口にし、高3で「置いていかれるだけ」と決めつけられることへ反発してから並走へ変わる。サブキャラとして鉄平、ミナ、鬼塚先生、黒羽レンをカード結果やランダムイベントに出し、`人望` を抽象数値だけにしない。
- 初回三択の結果には、得たもの、取りこぼしたもの、キャラ反応、ステータス変化を表示する。鉄平/ミナを助ける、自分の点で返す、今日は寝る、のどれを選んでも未選択側の損失が残る。
- 初回HUDは `はじめる` / `続きから` / `メニュー` を基本にし、結末帳、回想帳、復習帳、BGM、効果音、音量、記録消去はメニュー側へ入れる。長い説明文は置かず、`メンツ` / `ルックス` / `VOICE` は `title` や `aria-label` の短い補助説明で誤読を抑える。
- Web版は12週ごとに固定事件を出す。番長ルートは鉄平の赤点/補習/受験票、黒羽レンの点数表挑発、鬼塚先生の面談を軸にし、ギャルルートはミナの進路未定、主人公への触発、大学受験への転向、ミナの反発、黒羽レンの見た目と点数への挑発、願書写真を軸にする。固定事件は章タイトル、短期目標、関係レポート付きで表示する。
- 主人公選択後は選んだキャラが中央へ寄り、もう一方がフェードアウトしてからプロローグへ入る。選択後の立ち絵は、プロローグ終了後の志望校選択・週次選択でも中央配置を維持する。`prefers-reduced-motion` では即時遷移する。
- Web版は高校1年春の入学式から3年冬の卒業式まで、全144週で進行する。
- Web版は週ごとの学校行事名を表示するが、BGMは1学期、夏休み、2学期、3学期の区切りだけで切り替える。学期BGMは `/mnt/c/Users/minou/juken-bancho/web/assets/audio/seasons/`。
- 季節BGMは、春/1学期が `Springtechno`、夏休みが `Summer Park - 8bit tune (loop)`、秋/2学期が `Autumn - mp3 Free music`、冬/3学期が `Wintery loop`。埋め込みBGMはすべてOpenGameArt.org上でCC0として扱える素材に統一している。
- Web版は1学期、夏休み、2学期、3学期に固定イベントを持つ。各イベントは主人公別の専用一枚絵を表示し、回収済みCG IDを `localStorage` の `jukenBancho.unlockedEventCgs.v1` に `eventId:profileId` 形式で保存する。
- Web版の `結末帳` と `回想帳` はポップアップではなく、ステージ内の独立ページとして遷移する。回収済みの結末/イベント一枚絵はサムネイルを選ぶと全画面ビューアで表示する。
- Web版は初回クリア後に `回想帳` を表示する。回想帳では回収済みの季節イベント一枚絵を一覧し、未回収イベントは伏せ字で表示する。
- Web版の季節イベントはキャラ別の会話と二択を持つ。イベントの二択を選ぶまで次週へ進まず、選択した返答によって追加のパラメータ変動と会話文が入る。
- Web版の週次カード、ランダムイベント、季節イベント、季節イベント二択は、基本効果から各非ゼロ項目に `±1` のランダム幅を持つ。結果画面には実際に適用された増減値を表示する。
- Web版のイベント二択後は、追記された返答文までダイアログを自動スクロールし、次へ進むボタンへフォーカスを移す。
- Web版はエンディングごとに一枚絵と専用BGMへ切り替える。BGMがOFFの場合は、エンディング到達時も自動再生しない。BGMボタンは効果音ボタンと同じく `BGM ON/OFF` の状態表示にする。
- Web版はBGM OFF中に音声ファイルを `load()` しない。`audio` は `preload="none"` で、ONにした時点の学期/エンディング曲だけを読み込む。初回アイドル時の重いCG/BGM一括先読みも行わず、主人公立ち絵だけを軽くウォームアップする。
- Web版はメニュー内に `VOICE` トグルを持つ。デフォルトはOFFで、ONにした後だけ会話を読む。ローカルの VOICEVOX Engine が `127.0.0.1:50021` で起動中なら `/voicevox/*` proxy または direct URL 経由で合成し、未起動ならブラウザ/OSの日本語音声へフォールバックする。受験番長、優等生ギャル、鉄平、ミナ、鬼塚先生、黒羽レンは別castに割り当て、主人公は strict speaker preference にして危険な若声fallbackを避ける。重要イベントは表示文とは別に `voiceText` を持つ。音響差はspeaker名だけでなく速度、ピッチ、抑揚、音量、pause policy、fallback rate/pitchで固定する。VOICE再生中はBGMを65%へduckingする。VOICEVOX proxyは `http://127.0.0.1:50021` 固定、許可endpoint限定、speaker numeric、text 500字以下、body 512KB以下、JSON body限定、8秒timeoutで閉じる。外部公開しない。
- 実聴確認は `/mnt/c/Users/minou/juken-bancho/docs/voice-listening-test-2026-05-14.md` を使う。合格基準は12本中9本以上を画面なしで識別でき、受験番長/鉄平、優等生ギャル/ミナ、鬼塚先生/narrator、黒羽レン/受験番長の混線がないこと。
- Web版は2周目以降、主人公選択演出中に `演出スキップ`、プロローグ中に `導入スキップ` を表示する。解放条件は `localStorage` の結末帳に1件以上のエンディングIDがあること。
- Web版は全ボタンクリック時に Web Audio で短い効果音を合成する。外部効果音素材は追加していない。`効果音ON/OFF` ボタンで切り替える。
- Web版のスマホ表示は、上部3ボタン、2列ステータスHUD、下部スクロール式ダイアログを基本にする。通常の画面遷移時はダイアログ枠内スクロールを先頭へ戻し、イベント二択後だけ追記結果へスクロールする。
- Web版のスマホ初期画面は、主人公選択カードを2列のコンパクト表示にし、390x844、360x800、375x667、320x568、844x390でスクロールなしに読めることを確認する。`npm run test:responsive` でも初期画面の縦あふれを検出する。
- Unity 側へ BGM を移す場合は、`flesh-and-blood.mp3` を AudioClip として取り込み、音量初期値を Web 版同様に控えめにする。
- Unity 側へ主人公立ち絵を移す場合は、`protagonist-bancho-transparent.png` を Sprite として取り込む。
- ノベルゲーム方向を強めるなら、立ち絵/顔アイコンとカード選択後の会話リアクションを優先する。
- 立ち絵・背景を追加する場合は、生成画像または手描き素材の方針を決める。
- Android 実機配布を行う前に package name、署名、アイコン、ビルド設定を確定する。
