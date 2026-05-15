# 受験番長 SteamPipe Upload Runbook

作成日: 2026-05-15

## 目的

Steamworks権限を持つ担当者が、ローカルで生成済みのWindows depot候補を検証branchへuploadするための手順書。ここに実AppID、DepotID、Steamworks認証情報は書かない。

## 前提

- ローカル作業ディレクトリ: `/mnt/c/Users/minou/juken-bancho`
- Windows depot候補: `dist/desktop/win-unpacked/`
- 起動実行ファイル: `受験番長.exe`
- VDFテンプレート:
  - `steam/app_build_steam.template.vdf`
  - `steam/depot_build_windows.template.vdf`

## 事前ローカル検証

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

## VDF準備

テンプレートをコピーして、実値版を作る。実値版は認証情報ではないが、Steamworks管理値なので、公開リポジトリへ混ぜる前に運用方針を決める。

```bash
cp steam/app_build_steam.template.vdf steam/app_build_steam.local.vdf
cp steam/depot_build_windows.template.vdf steam/depot_build_windows.local.vdf
```

差し替えるplaceholder:

```text
YOUR_STEAM_APP_ID
YOUR_WINDOWS_DEPOT_ID
```

確認するContentRoot:

```text
../dist/desktop/win-unpacked
```

## Steamworks側で確認すること

- AppIDが対象ゲームのものか。
- Windows DepotIDが対象ゲームのWindows depotか。
- Launch Optionが `受験番長.exe` を指しているか。
- 最初のupload先が検証branchか。
- default branch反映は、人間確認後に別操作として行うか。

## Upload後の確認

- Steamworks上でbuildが作成されている。
- 検証branchにbuildを割り当てられる。
- Steamクライアントから検証branchを選んでインストールできる。
- Steamクライアント経由で起動できる。
- 初回画面、主人公選択、志望校確定、最初の12週まで進める。
- 保存後に再起動して `続きから` が使える。

## 禁止事項

- Steamworks認証情報をこのリポジトリ、Issue、PR、チャット、Markdownに貼らない。
- 初回uploadをdefault branchへ直接反映しない。
- Windows実機確認前に審査提出しない。
- クレジット、レーティング、価格、ストア素材が未確定のままreleaseしない。

## 参照

- Steamworks Builds: `https://partner.steamgames.com/doc/store/application/builds`
- SteamPipe Uploading: `https://partner.steamgames.com/doc/sdk/uploading`
