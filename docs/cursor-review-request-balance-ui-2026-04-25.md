# Cursor Review Request: 受験番長 UI / Balance Follow-up

Date: 2026-04-25
Project path: `/mnt/c/Users/minou/juken-bancho/`
Public URL: `https://minougun.github.io/juken-bancho/`
Local test URL: `http://127.0.0.1:43361/`

## Review Goal

`受験番長` Web版について、直近のUI演出修正とカードバランス修正を辛口レビューしてください。

今回の重点は以下です。

- 主人公選択後のアニメーションが自然に見えるか
- 選択後の主人公中央配置が、プロローグ後の志望校選択・週次選択でも破綻していないか
- `自習室に乗り込む` と `補習を受ける` のステータス差が、プレイヤーにとって意味のある選択になっているか
- スマホ表示でキャラ・HUD・選択肢・ダイアログが読みやすいか

## How To Run

```bash
cd /mnt/c/Users/minou/juken-bancho
PORT=43361 node web/server.mjs
```

Open:

```text
http://127.0.0.1:43361/
```

If the port is already used:

```bash
PORT=43362 node web/server.mjs
```

Public build:

```text
https://minougun.github.io/juken-bancho/
```

## Main Files To Review

- `/mnt/c/Users/minou/juken-bancho/web/app.js`
- `/mnt/c/Users/minou/juken-bancho/web/styles.css`
- `/mnt/c/Users/minou/juken-bancho/web/index.html`
- `/mnt/c/Users/minou/juken-bancho/web/server.mjs`
- `/mnt/c/Users/minou/juken-bancho/docs/handoff.md`

## Recent Commits To Inspect

- `4a1fa5f` `Retune study room payoff`
- `b5efff2` `Rebalance study room card`
- `bc84dee` `Keep protagonist centered after selection`
- `953345b` `Make profile selection animation visible`
- `128a4c4` `Animate profile selection`

## Recent Changes

### 1. 主人公選択アニメーション

主人公選択画面で、番長とギャルの両方を最初から表示するようにしています。

選択後は以下の演出にしています。

- 選んだ主人公が中央へ移動
- 選ばなかった主人公がフェードアウト
- アニメーション後、その中央配置のままプロローグへ入る
- `prefers-reduced-motion: reduce` では即時遷移する

該当箇所:

- `web/app.js`
  - `PROFILE_SELECT_ANIMATION_MS`
  - `startProfileSelection`
  - `selectProfile`
  - `characterCentered`
  - `render`
- `web/styles.css`
  - `.novel-stage--profile-selecting`
  - `.novel-stage--selected-bancho`
  - `.novel-stage--selected-gyaru`
  - `.novel-stage--route-centered`

### 2. 選択後の中央配置維持

選択後の主人公立ち絵は、プロローグ終了後も通常位置へ戻さず、志望校選択・週次選択でも中央配置を維持します。

チェックしてほしい点:

- 中央配置がノベルゲームUIとして自然か
- ステータスHUDや選択肢と視覚的に干渉していないか
- スマホ縦・スマホ横・PCで違和感がないか
- エンディング画面では立ち絵が邪魔にならないか

### 3. `自習室に乗り込む` の再調整

以前は `自習室に乗り込む` が `補習を受ける` より選ぶ意味が薄かったため、攻めの学習カードとして再調整しました。

現在の設定:

```text
自習室に乗り込む
学力+3 / 人望-1 / メンツ+1 / 体力-4 / ストレス+3
必要体力: 14
```

比較対象:

```text
補習を受ける
学力+1 / 人望+1 / メンツ-1 / 体力-3 / ストレス+2
必要体力: 10
```

設計意図:

- `自習室`: 学力を大きく伸ばし、メンツも立つ。ただし仲間との距離・疲労・ストレスが重い。
- `補習`: 学力上昇は小さいが、人望を保てる安定策。先生に頭を下げるのでメンツは少し下がる。

チェックしてほしい点:

- この2カードの差は選択として面白いか
- `自習室` が強すぎる、またはまだ弱すぎるか
- 学力+3が、144週制のゲーム全体で過剰になっていないか
- 高偏差値志望校で `自習室` 一択になりすぎないか
- `模試に特攻`、`赤本ラストスパート` と役割が被りすぎていないか

## Broader Balance Context

現在の学習系カード:

```text
自習室に乗り込む
学力+3 / 人望-1 / メンツ+1 / 体力-4 / ストレス+3

補習を受ける
学力+1 / 人望+1 / メンツ-1 / 体力-3 / ストレス+2

模試に特攻
学力+3 / メンツ+1 / ルックス-1 / 体力-6 / ストレス+5
解禁: 48週目

赤本ラストスパート
学力+4 / 人望-2 / ルックス-2 / 体力-9 / ストレス+7
解禁: 120週目
```

志望校は偏差値ごとに難易度が違います。

```text
城北実学大学: 偏差値52 / 合格学力74
東都学院大学: 偏差値60 / 合格学力82
帝王義塾大学: 偏差値68 / 合格学力90
国立天嶺大学: 偏差値74 / 合格学力96
```

## Regression Checklist

最低限、以下を実際に触って確認してください。

1. トップ画面で番長とギャルが両方見える
2. 番長を選ぶと、番長が中央へ移動し、ギャルがフェードアウトする
3. ギャルを選ぶと、ギャルが中央へ移動し、番長がフェードアウトする
4. 選択後、そのまま中央配置でプロローグが始まる
5. プロローグ終了後、志望校選択でも中央配置が維持される
6. 志望校選択後、週次選択でも中央配置が維持される
7. `自習室に乗り込む` の効果表示が `学力+3 / 人望-1 / メンツ+1 / 体力-4 / ストレス+3` になっている
8. `補習を受ける` の効果表示が `学力+1 / 人望+1 / メンツ-1 / 体力-3 / ストレス+2` のままになっている
9. `prefers-reduced-motion` 想定で、アニメーション必須になっていない
10. スマホ幅で横スクロールや読めない重なりがない

## Review Checklist

### UX / Game Feel

- 主人公選択演出は見える、待てる、気持ちいい範囲か
- 中央配置の立ち絵が、ゲーム画面の主役感を高めているか
- 中央立ち絵がカード選択の邪魔になっていないか
- 週次カードの効果差がプレイヤーにとって直感的か

### Balance

- `自習室` と `補習` の使い分けが成立しているか
- `自習室` が序盤から最強すぎないか
- 学力系カードのインフレで、志望校難易度が崩れていないか
- 人望・メンツ・ルックス・体力・ストレスのトレードオフが残っているか
- 144週プレイで中盤以降が単調にならないか

### Responsive / Accessibility

- 390x844程度のスマホ縦画面で破綻しないか
- 844x390程度のスマホ横画面で破綻しないか
- PC表示で中央立ち絵が小さすぎたり浮いたりしないか
- `prefers-reduced-motion` を尊重できているか
- ステータスやカード効果がスクリーンリーダー上で分かりにくくなっていないか

### Code Quality

- `characterCentered` の状態管理は分かりやすいか
- `profileSelectionToken` と選択ロックの扱いに競合や二重遷移のリスクはないか
- `.novel-stage--route-centered` のCSSはレスポンシブ上安全か
- カードデータが `web/app.js` に直書きのままで、次の調整がつらくなっていないか
- 今回の変更を Unity 側データへ同期する必要があるか

### Security / Safety

- 静的Web版として、外部API・DB・認証・アップロードはない前提
- `server.mjs` が `/web/` 外のファイルを返さないか
- `localStorage` はエンディング解放IDだけに留まっているか
- 生成素材・BGM素材のライセンス記載に不足がないか

## Requested Output Format

以下の順番で返してください。

1. Critical bugs / regressions
2. High-impact UX issues
3. Balance issues
4. Responsive / accessibility issues
5. Code structure issues
6. Security / licensing concerns
7. Quick wins
8. Recommended next implementation plan

各指摘には、できるだけファイルパスと行番号を付けてください。

## Current Status Notes

- Branch: `main`
- Latest commit: `4a1fa5f` `Retune study room payoff`
- Public URL: `https://minougun.github.io/juken-bancho/`
- Issue: `not_applicable` 軽微なUI/バランス継続調整のため未起票
- PR: `not_applicable` 既存フローどおり `main` に直接反映
