# 受験番長 Steamストア素材・説明文ドラフト

作成日: 2026-05-15

## 目的

Steamworksのストアページ入力とストア素材制作に渡すためのローカル準備メモ。ここにある文言は下書きであり、Steamworks上への入力、公開、審査提出は未実施。

## ストア説明文ドラフト

### Short Description / 日本語

受験番長は、学力だけでなく人望、メンツ、ルックス、体力まで削りながら、144週の高校生活を走り切る受験スケジュールゲームです。毎週の予定を選び、仲間との関係と志望校合格の両方を守れ。

### Short Description / English

Juken Bancho is a weekly exam-schedule game about surviving 144 weeks of high school while balancing grades, reputation, pride, looks, stamina, and friendships. Pick each week's plan and fight for both your dream school and your people.

### About This Game / 日本語

受験番長は、受験と学校コミュニティをテーマにしたカード選択式スケジュールゲームです。

プレイヤーは、仁義を背負う受験番長、または友情も偏差値も上げたい優等生ギャルとして、高校1年春から卒業式までの144週を進みます。毎週の予定カードを選び、学力、人望、メンツ、ルックス、体力を管理しながら、志望校合格を目指します。

ただ勉強するだけでは届きません。仲間の赤点、親友からの通知、先生の面談、ライバルの挑発、季節ごとの事件が、あなたの予定を崩してきます。誰を助け、何を捨て、どこで机へ戻るか。その選択が、12週ごとのレポートと卒業式の結末に返ってきます。

#### 主な特徴

- 144週を毎週の予定選択で進める受験スケジュールゲーム
- 番長ルートと優等生ギャルルートの2主人公
- 学力、人望、メンツ、ルックス、体力を同時に管理
- 志望校ごとに変わる勝ち筋と短期目標
- 12週ごとのレポートで、成績、生活、関係の変化を確認
- 到達した結末を記録する結末帳
- デフォルトOFFのVOICE機能とローカルBGM

### About This Game / English

Juken Bancho is a card-driven weekly scheduling game about exams, reputation, and school-community pressure.

Play as either a hard-boiled exam delinquent or an honor-student gyaru, and survive 144 weeks from the first spring of high school to graduation. Each week, choose a plan, manage grades, reputation, pride, looks, and stamina, and keep pushing toward your target university.

Studying alone is not enough. A friend's failing grade, unanswered messages, teacher meetings, rival taunts, and seasonal incidents will keep breaking your schedule. Who do you help, what do you sacrifice, and when do you return to the desk? Your choices come back through 12-week reports and multiple graduation outcomes.

#### Key Features

- Weekly card-based scheduling across 144 weeks
- Two protagonist routes: Bancho and honor-student gyaru
- Manage grades, reputation, pride, looks, and stamina
- Target-school goals with different routes to success
- 12-week reports that reflect academic progress, health, and relationships
- Ending book that records reached outcomes
- Local BGM and optional VOICE feature, off by default

## ストア素材チェックリスト

Steamworks公式ドキュメント上の必須サイズに合わせる。2026-05-15確認時点では、古い小さいカプセルサイズは受け付けられないとされているため、必ず最新テンプレートで作る。

| 種別 | 必須 | サイズ / 形式 | 制作メモ |
| --- | --- | --- | --- |
| Header Capsule | 必須 | 920 x 430 | ゲーム名と主役アート。余計な宣伝文は入れない。 |
| Small Capsule | 必須 | 462 x 174 | 小さくても `受験番長` が読める構図。 |
| Main Capsule | 必須 | 1232 x 706 | ストア主表示向け。番長/ギャルのどちらを主役にするか決める。 |
| Vertical Capsule | 必須 | 748 x 896 | 縦長。ライブラリカプセルと混同しない。 |
| Screenshots | 必須 | 1920 x 1080 以上、16:9 | UIが読める実ゲーム画面。最低5枚を用意する。 |
| Shortcut Icon | 必須 | 256 x 256、ico または png | Steamクライアント用。 |
| App Icon | 必須 | 184 x 184、jpg | 小さい代表アイコン。 |
| Library Capsule | 必須 | 600 x 900 | ゲームロゴ必須。余計な文言なし。 |
| Library Hero | 必須 | 3840 x 1240、png | 文字なしのアートのみ。 |
| Library Logo | 必須 | 幅1280以上または高さ720以上、png | 透明背景のロゴ。 |
| Library Header Capsule | 必須 | 920 x 430 | ライブラリ表示用。 |
| Page Background | 任意 | 1438 x 810 | 明るすぎない背景。 |

## スクリーンショット候補

Steam向けには、テスト用スクリーンショットをそのまま使うのではなく、1920 x 1080以上の16:9で撮り直す。

推奨候補:

1. 主人公選択: 番長とギャルが同時に見える画面
2. 最初の事件三択: `徹平の赤点` または `ミナの通知`
3. 志望校選択: 候補札、詳細、確定ボタンが見える画面
4. 志望校確定演出: 主人公の立ち絵と覚悟文が見える画面
5. 最初の12週レポート: キャラ反応、学力、生活、次目標が見える画面
6. 季節イベントCG: 春/夏/秋/冬のうち1枚
7. エンディングCG: ネタバレが強すぎない結末を1枚

既存の検証用スクリーンショット:

- `test-results/electron-smoke/initial-profile.png`
- `test-results/electron-smoke/target-confirm.png`
- `test-results/responsive-matrix/desktop-bancho-target-confirm.png`
- `test-results/responsive-matrix/desktop-gyaru-target-confirm.png`
- `test-results/responsive-matrix/desktop-bancho-12-week-report.png`
- `test-results/responsive-matrix/desktop-gyaru-12-week-report.png`

これらは検証証跡であり、Steam提出用には解像度・構図・余白を調整して再撮影する。

## カプセル制作ルール

- ベースのカプセル画像には、ゲームアート、ゲーム名、公式サブタイトル以外の文言を入れない。
- レビュー点、割引文言、受賞名、他作品宣伝、不要な説明文を入れない。
- すべてPG-13相当の絵にする。
- Library Heroは文字なしのアートだけにする。
- Library Logoは透明背景のロゴだけにする。
- 期間限定イベントや大型更新の訴求文は、通常カプセルではなくArtwork Overrideで扱う。

## ストア説明文ルール

- Short Descriptionは短い概要にし、改行や装飾を前提にしない。
- Short Descriptionに時期依存文言を入れない。
- About This Gameはスクリーンショットを見た後の補足として、短い段落と見出しで読ませる。
- ストア説明文内に外部リンク、QRコード、Steam UIを模した画像、他作品宣伝を入れない。
- 説明文に入れる画像やGIFは、総量と翻訳負荷を考え、文字なしを基本にする。

## 未確定項目

- 正式英題を `Juken Bancho` にするか、別表記にするか。
- 公式サブタイトルを付けるか。
- 価格。
- 対応言語。
- Windows専用で初回提出するか、Linux buildも出すか。
- Steam Cloud、実績、Overlayの採否。
- VOICEVOXのストア表記と使用speaker確定。

## 参照

- Steamworks Graphical Assets: `https://partner.steamgames.com/doc/store/assets?l=english`
- Steamworks Graphical Asset Rules: `https://partner.steamgames.com/doc/store/assets/rules`
- Steamworks Store Page Written Description: `https://partner.steamgames.com/doc/store/page/description?language=english`
