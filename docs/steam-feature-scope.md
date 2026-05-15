# 受験番長 Steam機能スコープ判断メモ

作成日: 2026-05-15

## 結論

初回Steam提出では、Steam API連携を必須化しない方針が妥当。現時点のゲームはローカル保存、ローカルBGM、任意VOICEで成立しており、Steam Cloud / 実績 / Overlayを入れると、Steamworks SDK統合、保存経路変更、Windows実機検証、Steamクライアント検証が増える。

ただし、ストア説明やユーザー期待値と矛盾しないように、未対応機能は明示的に採否判断する。

## Steam Cloud

### 現状

- Web版は `localStorage` に進行データと到達済み結末を保存している。
- Electron版もWeb版をそのまま表示するため、現時点ではSteam Cloud対象の通常ファイル保存ではない。

### 採用する場合の作業

- 保存先をSteam Cloud対象にしやすいファイルへ移す、またはSteam Remote Storage APIを使う。
- 既存 `localStorage` 保存との移行を設計する。
- Steamworks上でCloud設定を行う。
- 複数PC同期、競合、オフライン起動、削除、破損データ復旧を確認する。

### 初回判断

初回提出では未対応推奨。実装するなら、先に保存層を `localStorage` からファイル保存へ分離する小さな設計変更を行う。

## 実績

### 候補

- 初めて12週を終える。
- 初めて合格する。
- 合格番長エンディング到達。
- 優等生ギャル合格エンディング到達。
- 全10エンディング到達。
- 学力を一定値まで上げる。
- 体力を切らさず12週を終える。

### 採用する場合の作業

- Steamworks上でachievement定義を作る。
- Steamworks SDKをElectronから扱う方法を選ぶ。
- unlockタイミングをゲーム内イベントに接続する。
- オフライン時、再起動時、二重unlock時の挙動を確認する。
- アイコンを用意する。

### 初回判断

初回提出では未対応でもよい。入れるなら、最初は5個程度に絞る。全エンディングや長期実績は、保存移行と合わせて第2段階にする。

## Overlay

### 現状

Electron版は標準のデスクトップアプリとして起動する。Steam Overlay対応の最終確認はSteamクライアント経由でしか判断できない。

### 初回判断

Steamクライアント経由起動時にOverlayが使えるかを確認する。ゲーム側でOverlay依存の機能は作らない。

## 推奨ロードマップ

1. 初回提出: Steam API連携なし。Electron版の安定起動とストア準備を優先。
2. v1.1候補: 保存層をファイル保存へ分離し、Steam Cloud対応を検討。
3. v1.2候補: 実績5個から導入。
4. 以後: 全エンディング実績、統計、Steam Deck最適化を追加検討。

## 参照

- Steam Cloud: `https://partner.steamgames.com/doc/features/cloud?l=english`
- Steam Stats and Achievements: `https://partner.steamgames.com/doc/features/achievements?l=english`
