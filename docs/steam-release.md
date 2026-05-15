# 受験番長 Steam 移植メモ

## 方針

`web/` 版を正とし、Electron でデスクトップアプリ化する。既存 Unity 側は Web 版より内容が古いため、Steam 初回提出用の移植対象にはしない。

## ローカルビルド

```bash
npm install
npm run check
npm run test:responsive
npm run desktop:pack
npm run steam:stage
```

成果物:

- Linux ローカル確認: `dist/desktop/linux-unpacked/`
- Windows Steam depot 候補: `dist/desktop/win-unpacked/`

Steam の起動オプションでは、Windows depot の実行ファイルを指定する。

```text
受験番長.exe
```

## Steamworks で必要な外部作業

Steamworks 側では、AppID / DepotID / launch option / store assets / 審査提出が必要。これは外部サービス上の編集と公開操作なので、このリポジトリからは自動実行しない。

SteamPipe アップロード時は、`steam/*.template.vdf` を実AppID/DepotIDに置き換え、Steamworks SDK の ContentBuilder から `steamcmd` でアップロードする。

## 注意

- VOICE はデフォルトOFF。デスクトップ版でもローカルの VOICEVOX Engine が `127.0.0.1:50021` で起動している場合だけ、既存の `/voicevox/*` proxy 経由で読む。
- VOICEVOX 音声ファイルは同梱していない。公開時は実際に使う音声ライブラリの規約とクレジット確認が必要。
- BGM / CG の素材表記は `docs/third-party-notices.md` を確認する。
- Steam 実提出前にストア画像、アイコン、年齢レーティング、価格、実績対応の有無を決める。

## 参照

- Steamworks Builds: `https://partner.steamgames.com/doc/store/application/builds`
- SteamPipe Uploading: `https://partner.steamgames.com/doc/sdk/uploading`
