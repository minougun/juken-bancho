# 受験番長 Steam ローカル完了チェックリスト

作成日: 2026-05-15

## 目的

Steamworksへ入る前に、ローカルで完了できる作業を固定する。ここにある項目はSteamworks上の公開操作ではなく、ローカル確認・文書化・素材準備に限る。

## 現在ローカルで完了済み

- [x] Web版を正としてElectronでデスクトップ化
- [x] `electron/main.cjs` 追加
- [x] `web/server.mjs` の直接起動互換を維持したままElectronから再利用
- [x] `npm run desktop:pack` 追加
- [x] `npm run steam:stage` 追加
- [x] `npm run test:desktop-package` 追加
- [x] `npm run test:desktop-smoke` 追加
- [x] Windows depot候補 `dist/desktop/win-unpacked/` 生成
- [x] `dist/desktop/win-unpacked/受験番長.exe` 生成
- [x] Linux確認用 `dist/desktop/linux-unpacked/` 生成
- [x] SteamPipe VDFテンプレート追加
- [x] Steam移植実装書追加
- [x] Steamストア説明文ドラフト追加
- [x] ストア素材サイズ表追加
- [x] 素材/規約確認観点を `docs/third-party-notices.md` に集約

## ローカルで毎回確認するコマンド

```bash
cd /mnt/c/Users/minou/juken-bancho
npm install
npm run check
npm run verify
npm run desktop:pack
npm run steam:stage
npm run test:desktop-package
npm run test:desktop-smoke
npm run steam:local-check
git diff --check
```

## Windows実機確認チェック

Windows実機で以下を確認する。これはこのWSL環境だけでは完了できない。

- [ ] `dist/desktop/win-unpacked/受験番長.exe` を直接起動できる。
- [ ] 初期画面が表示される。
- [ ] `はじめる` から主人公選択に進める。
- [ ] 番長ルートで最初の12週画面まで到達できる。
- [ ] ギャルルートで最初の12週画面まで到達できる。
- [ ] 保存データなしの `続きから` 表示が破綻しない。
- [ ] 保存後にアプリ再起動して `続きから` が使える。
- [ ] BGM ON/OFFが動く。
- [ ] VOICE OFF状態でVOICEVOX通信が発生しない。
- [ ] VOICE ON時、VOICEVOX未起動でもゲーム進行が止まらない。
- [ ] 外部URLがアプリ内ではなく既定ブラウザで開く。
- [ ] アプリを閉じた後、ローカルWebサーバーが残らない。

## Steamworks直前チェック

外部操作に入る直前に人間が確認する。

- [ ] AppIDが確定している。
- [ ] Windows DepotIDが確定している。
- [ ] `steam/app_build_steam.template.vdf` の `YOUR_STEAM_APP_ID` を実値へ差し替える準備がある。
- [ ] `steam/depot_build_windows.template.vdf` の `YOUR_WINDOWS_DEPOT_ID` を実値へ差し替える準備がある。
- [ ] Launch Optionに `受験番長.exe` を設定する方針が確定している。
- [ ] default branchではなく検証branchへ最初にuploadする。
- [ ] upload後にSteamクライアントからインストール・起動確認する。

## 公開前チェック

- [ ] Steamストア素材一式が揃っている。
- [ ] スクリーンショットは1920 x 1080以上、16:9で撮り直している。
- [ ] カプセル画像に余計な宣伝文や割引文がない。
- [ ] ストア説明文に外部リンクや他作品宣伝がない。
- [ ] VOICEVOX speakerの実使用一覧とクレジットが確定している。
- [ ] BGM/CG/フォント/生成画像のクレジット確認が終わっている。
- [ ] 年齢レーティングが確定している。
- [ ] 価格が確定している。
- [ ] 対応OS/言語が確定している。
- [ ] Steam Cloud、実績、Overlayの採否が確定している。

## 現時点で残るブロッカー

- Steamworks権限がないとAppID/DepotID確定、upload、branch反映、審査提出はできない。
- Windows実機またはSteamクライアントがないと、`受験番長.exe` のWindows実行とSteam経由起動は確認できない。
- ストア素材の最終画像は、提出サイズで別途制作・書き出しが必要。
