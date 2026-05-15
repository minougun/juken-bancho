# 受験番長 Steam移植 実装書

作成日: 2026-05-15  
対象リポジトリ: `/mnt/c/Users/minou/juken-bancho`  
対象ブランチ: `main`  
Steam移植基準コミット: `93b38d7 Prepare the web build for Steam desktop staging`
実装書追加コミット: `0925a0c Document the Steam desktop staging implementation`
想定保存先: `docs/steam-implementation.md`

## 1. 概要

本書は、`受験番長` のWeb版をSteam提出候補としてデスクトップアプリ化した実装内容、ビルド手順、生成成果物、検証結果、未実施事項、リスク、次アクションを引き継ぐための実装書である。

現時点で完了している範囲は、**ローカル環境でElectron版デスクトップアプリを生成し、Windows向けSteam depot候補となる `dist/desktop/win-unpacked/` を作成したところまで**である。Steamworksへの実アップロード、Steamストアページ編集、審査提出、build branch公開、releaseは未実施である。

今回の移植方針は、既存Web版を正とし、ElectronでSteam向けデスクトップアプリとして包む方式である。Unity版への再移植、またはUnity版をSteam初回提出対象にする方針ではない。

主要成果物は以下である。

```text
/mnt/c/Users/minou/juken-bancho/dist/desktop/win-unpacked/
/mnt/c/Users/minou/juken-bancho/dist/desktop/win-unpacked/受験番長.exe
/mnt/c/Users/minou/juken-bancho/dist/desktop/linux-unpacked/
```

Windows向けSteam depot候補は以下を想定する。

```text
dist/desktop/win-unpacked/
```

`dist/` は `.gitignore` 対象であり、Git管理外の生成物として扱う。

## 2. 背景と移植方針

`受験番長` は、現在のWeb版が最新のゲーム内容、UI、保存、VOICEVOX proxy、BGM/CG、検証スクリプトを持っている。既存Unity側はWeb版より内容が古いため、Steam初回提出用の対象にはしていない。

今回の移植方針は以下である。

- `web/` 版を正とする。
- ElectronでWeb版をデスクトップアプリ化する。
- ElectronのメインプロセスからローカルWebサーバーを起動し、`BrowserWindow` で表示する。
- Steam提出候補として、Windows向けのunpacked buildを生成する。
- SteamPipe用VDFテンプレートを用意し、AppID / DepotID はSteamworks側の実値に差し替えて使う。
- Steamworks上の操作は外部サービス操作であるため、ユーザーの明示確認とSteamworks権限を持つ担当者による実行を前提とする。

この方針により、既にレビュー済みのWeb版を大きく書き換えず、Steam向けに配布可能なデスクトップパッケージへ変換する。

## 3. 現在のアーキテクチャ

現在のSteam候補版は、以下の構成で動作する。

```text
受験番長.exe
  └─ Electron main process: electron/main.cjs
       ├─ web/server.mjs を利用してローカルWebサーバーを起動
       ├─ ランダム localhost port を取得
       ├─ BrowserWindow を 1280x800 で作成
       ├─ ローカルURLを読み込み
       └─ アプリ終了時にWebサーバーを閉じる

web/
  ├─ index.html
  ├─ app.js
  ├─ styles.css
  ├─ server.mjs
  ├─ data/game-data.js
  └─ assets/

steam/
  ├─ app_build_steam.template.vdf
  └─ depot_build_windows.template.vdf
```

Electron側はWebアプリの内容を直接変更しない。`web/server.mjs` が静的配信と既存 `/voicevox/*` proxy を担い、Electronメインプロセスはそのサーバーを起動して画面に表示する。

Steam候補buildでは、`electron/**/*`、`web/**/*`、`package.json` がpackage対象に含まれる。`asar` は無効化されているため、packaged app内では `resources/app/` 配下にアプリファイルが展開された状態で含まれる。

## 4. 変更ファイル一覧

| 区分 | ファイル | 内容 |
| --- | --- | --- |
| 追加 | `electron/main.cjs` | Electronメインプロセス。BrowserWindow作成、ローカルWebサーバー起動、外部URL制御、終了時クローズ処理。 |
| 変更 | `web/server.mjs` | 静的配信サーバーを関数化し、Electron側から再利用可能にした。既存の直接起動挙動と `/voicevox/*` proxy は維持。 |
| 変更 | `package.json` | Electron entry、desktop/Steam向けscripts、electron-builder設定、metadataを追加。 |
| 変更 | `package-lock.json` | `electron`、`electron-builder` 追加に伴うlock更新。 |
| 追加 | `steam/app_build_steam.template.vdf` | SteamPipe用App buildテンプレート。AppID placeholderを含む。 |
| 追加 | `steam/depot_build_windows.template.vdf` | Windows depot用テンプレート。DepotID placeholderとContentRootを含む。 |
| 追加 | `docs/steam-release.md` | Steam移植方針、ビルド手順、成果物、Steamworks外部作業、素材/規約注意点。 |
| 追加 | `docs/steam-local-release-checklist.md` | Steamworks前にローカルで完了できる確認項目。 |
| 追加 | `docs/steam-store-page-draft.md` | Steamストア説明文下書き、素材サイズ、画像制作ルール。 |
| 追加 | `docs/steam-store-page-fact-check.md` | ストア下書きの数値、仕様、公開前リスクを確認するfact-check pass。 |
| 追加 | `docs/steam-feature-scope.md` | Steam Cloud、実績、Overlayの初回提出スコープ判断。 |
| 追加 | `docs/steamworks-upload-runbook.md` | SteamPipe upload担当者向け手順。 |
| 変更 | `README.md` | Steam / Desktop Buildセクションを追加。 |
| 追加 | `scripts/check-desktop-package.mjs` | `win-unpacked` 成果物の必須ファイル、assets、旧表記、stale helperを検証。 |
| 追加 | `scripts/check-electron-smoke.mjs` | Electronを起動し、初期画面から志望校確定後の最初の12週までを確認するスモーク検証。 |
| 追加 | `scripts/check-steam-local-readiness.mjs` | Steamworks前に必要なローカル文書、生成物、スクリプト、素材メモを検証。 |
| 変更 | `.gitignore` | `dist/` を除外。 |

既存の未追跡ファイルとして以下が存在する。

```text
docs/claude-code-review-request-2026-04-27.md
```

このファイルは今回のSteam移植コミット対象外であり、Steam移植差分には混ぜない。

## 5. Electron化の実装詳細

### 5.1 エントリポイント

Electronのエントリポイントは以下である。

```text
electron/main.cjs
```

`package.json` の `main` は次を指す。

```json
{
  "main": "electron/main.cjs"
}
```

### 5.2 BrowserWindow設定

Electronメインプロセスは `BrowserWindow` で `受験番長` を起動する。

画面サイズは以下である。

```text
初期サイズ: 1280x800
最小サイズ: 360x640
```

Steam向けデスクトップ表示を想定しつつ、Web版の小型画面耐性も維持するため、最小サイズはスマホ縦に近い `360x640` にしている。

### 5.3 セキュリティ設定

ElectronのWebPreferencesは以下を前提とする。

```text
contextIsolation: true
nodeIntegration: false
sandbox: true
```

意図は、Web版のレンダラープロセスからNode.js機能へ直接アクセスさせないことである。Web版は外部API、認証、DB、課金、広告なしの構成であり、Steam候補でもこの前提を維持する。

### 5.4 メニューと外部URL

- アプリメニューは非表示。
- 外部URLはアプリ内遷移させず、OSの既定ブラウザで開く。
- アプリ終了時にローカルWebサーバーを閉じる。

外部URLをアプリ内で開かせないことで、Electron内に想定外の外部ページを読み込ませない。

## 6. Webサーバー再利用の実装詳細

`web/server.mjs` は、既存の静的配信サーバーとしての直接起動挙動を維持しつつ、Electron側から再利用できるように関数化されている。

追加されたexportは以下である。

```js
createJukenBanchoWebServer()
startJukenBanchoWebServer()
```

維持された挙動は以下である。

```bash
node web/server.mjs
```

このコマンドで直接ローカルWebサーバーを起動できる。

Electron側では、`web/server.mjs` を利用してランダムなlocalhost portでWebサーバーを起動し、そのURLを `BrowserWindow` に読み込ませる。これにより、固定port衝突を避ける。

既存の `/voicevox/*` proxy 挙動は維持されている。VOICEVOX利用時の公開用クレジット、実使用speakerごとの規約確認はSteam公開前に別途必要である。

## 7. ビルド設定

### 7.1 package metadata

`package.json` には以下が設定されている。

```json
{
  "main": "electron/main.cjs",
  "description": "受験と学校コミュニティを144週で走るカード選択式スケジュールゲーム",
  "author": "minougun",
  "license": "UNLICENSED"
}
```

### 7.2 devDependencies

```text
electron@42.1.0
electron-builder@26.8.1
```

### 7.3 scripts

追加された主要scriptは以下である。

```json
{
  "desktop:start": "electron electron/main.cjs",
  "desktop:pack": "electron-builder --dir",
  "steam:local-check": "node scripts/check-steam-local-readiness.mjs",
  "steam:stage": "electron-builder --win dir",
  "test:desktop-package": "node scripts/check-desktop-package.mjs",
  "test:desktop-smoke": "node scripts/check-electron-smoke.mjs"
}
```

用途は以下の通り。

| script | 用途 |
| --- | --- |
| `desktop:start` | Electron版をローカル起動する。 |
| `desktop:pack` | Electron desktop buildをunpacked形式で生成する。 |
| `steam:local-check` | Steamworks前のローカル生成物、文書、素材準備メモを検証する。 |
| `steam:stage` | Windows向けunpacked buildを生成し、Steam depot候補を作る。 |
| `test:desktop-package` | `win-unpacked` の必須ファイルとstale要素を検証する。 |
| `test:desktop-smoke` | Electronを実起動し、初期導線を操作してスクリーンショットを残す。 |

### 7.4 electron-builder設定

主要設定は以下である。

```text
appId: jp.minougun.jukenbancho
productName: 受験番長
artifactName: juken-bancho-${version}-${os}-${arch}.${ext}
directories.output: dist/desktop
files:
  - electron/**/*
  - web/**/*
  - package.json
Windows target: dir
Linux target: dir
asar: false
win.signAndEditExecutable: false
```

### 7.5 `asar: false` と `signAndEditExecutable: false` の理由

WSL環境でWindows buildを生成する際、resource edit / wine 周りで失敗したため、現時点ではSteam depot候補として扱いやすいunpacked buildを優先している。

そのため、以下を設定している。

```text
asar: false
win.signAndEditExecutable: false
```

これは**Steam提出候補のローカル生成を通すための暫定判断**であり、署名済みインストーラー配布とは別の扱いである。Windows実行ファイル署名は未実施である。

## 8. Steam depot候補の作成手順

### 8.1 前提

作業ディレクトリは以下とする。

```bash
cd /mnt/c/Users/minou/juken-bancho
```

### 8.2 依存関係のインストール

```bash
npm install
```

### 8.3 Desktop build生成

Linux/desktop unpacked buildを含むElectron packageを作成する。

```bash
npm run desktop:pack
```

### 8.4 Windows Steam候補build生成

Windows向けunpacked buildを作成する。

```bash
npm run steam:stage
```

生成後、以下が存在することを確認する。

```text
dist/desktop/win-unpacked/
dist/desktop/win-unpacked/受験番長.exe
```

### 8.5 Desktop package検証

```bash
npm run test:desktop-package
```

期待される成功例は以下である。

```text
Desktop package ok: 7 required files, 37 assets.
```

### 8.6 Electron起動スモーク

GUIが使えるローカル環境では、Electron本体を起動して初期導線を確認する。

```bash
npm run test:desktop-smoke
```

期待される成功例は以下である。

```text
Electron smoke ok. Screenshots: /mnt/c/Users/minou/juken-bancho/test-results/electron-smoke
```

### 8.7 Steamローカル完了チェック

```bash
npm run steam:local-check
```

期待される成功例は以下である。

```text
Steam local readiness ok: 21 files, 10 scripts.
```

### 8.8 追加検証

```bash
npm run verify
npm run check
git diff --check
```

成功済みの `npm run check` の例は以下である。

```text
Data integrity ok: 2 profiles, 4 schools, 7 cards, 4 seasonal events, 6 random events, 30000 study questions.
```

## 9. SteamPipeテンプレートの使い方

### 9.1 テンプレートファイル

SteamPipe用に以下のテンプレートが追加されている。

```text
steam/app_build_steam.template.vdf
steam/depot_build_windows.template.vdf
```

テンプレート内のplaceholderは以下である。

```text
YOUR_STEAM_APP_ID
YOUR_WINDOWS_DEPOT_ID
```

Steamworksで発行された実値に差し替えて使用する。

### 9.2 ContentRoot

Windows depot向けのContentRootは以下を想定している。

```text
../dist/desktop/win-unpacked
```

Windows depot候補ディレクトリは以下である。

```text
dist/desktop/win-unpacked/
```

起動実行ファイルは以下である。

```text
受験番長.exe
```

### 9.3 Steamworks SDK / ContentBuilderでの使い方

Steamworks SDKのContentBuilderで、App build VDFとDepot build VDFを使ってbuildをアップロードする。Valve公式ドキュメントでは、SteamPipe uploadにはbuild scriptとdepot scriptを作成し、Steamworks SDKに含まれるcommand-line toolでuploadする流れが説明されている。

実施時は以下を確認する。

- Steamworks SDKを取得していること。
- Steamworksアカウントに対象AppIDのbuild権限があること。
- `YOUR_STEAM_APP_ID` を実AppIDへ差し替えていること。
- `YOUR_WINDOWS_DEPOT_ID` を実Windows DepotIDへ差し替えていること。
- ContentRootが `dist/desktop/win-unpacked/` を指していること。
- Steamworks側のLaunch Optionで `受験番長.exe` を起動対象にしていること。

参考公式情報:

- Steamworks Builds: `https://partner.steamgames.com/doc/store/application/builds`
- SteamPipe Uploading: `https://partner.steamgames.com/doc/sdk/uploading`

## 10. 検証結果

### 10.1 成功済みコマンド

以下は成功済みである。

```bash
npm run verify
npm run desktop:pack
npm run steam:stage
npm run test:desktop-package
npm run test:desktop-smoke
npm run steam:local-check
npm run check
git diff --check
```

### 10.2 Desktop package検証

`npm run test:desktop-package` の結果は以下である。

```text
Desktop package ok: 7 required files, 37 assets.
```

検証スクリプトは、`dist/desktop/win-unpacked` に以下が含まれることを確認する。

```text
受験番長.exe
resources/app/electron/main.cjs
resources/app/web/index.html
resources/app/web/app.js
resources/app/web/styles.css
resources/app/web/server.mjs
resources/app/web/data/game-data.js
```

また、`web/assets` が一定数以上含まれること、旧表記 `鉄平` がpackaged appに残っていないこと、以下のstale helperがpackaged appに残っていないことも確認する。

```text
buildProgressMilestoneVoiceText
getChapterRelationshipReport
```

### 10.3 Electron起動スモーク

`npm run test:desktop-smoke` の結果は以下である。

```text
Electron smoke ok. Screenshots: /mnt/c/Users/minou/juken-bancho/test-results/electron-smoke
```

確認内容は以下である。

- Electronが `electron/main.cjs` から起動する。
- `BrowserWindow` がローカルWebサーバーURLを読み込む。
- page title が `受験番長` である。
- 初期プロフィール選択が表示される。
- 番長ルートで導入、最初の事件、志望校選択、志望校確定、最初の12週画面まで進める。
- 初期画面と志望校確定画面のスクリーンショットを `test-results/electron-smoke/` に保存する。
- 操作中の `console.error` と `pageerror` がないことを確認する。

### 10.4 Data integrity検証

`npm run check` の結果は以下である。

```text
Data integrity ok: 2 profiles, 4 schools, 7 cards, 4 seasonal events, 6 random events, 30000 study questions.
```

### 10.5 Steamローカル完了チェック

`npm run steam:local-check` は、以下を確認する。

- Steam関連docsが揃っている。
- SteamPipeテンプレートが残っている。
- Windows/Linuxのunpacked buildが存在する。
- Electron smokeのスクリーンショットが存在する。
- `package.json` にSteam関連scriptが存在する。
- ストア素材サイズ、VOICEVOX/CC0、検証branch手順がdocsに記録されている。

### 10.6 旧表記チェック

以下の検索で、対象範囲には旧表記 `鉄平` のヒットなし。

```bash
rg -n "鉄平" web docs README.md package.json scripts electron steam --glob '!docs/claude-code-review-request-2026-04-27.md'
```

### 10.7 未検証の検証領域

以下は未検証である。

- Windows実機でのGUI起動確認。
- Steamクライアント経由での起動確認。
- Steamworks upload後のbranch確認。
- Steam Deck確認。
- 署名済みWindows executableとしての挙動。
- VOICEVOX利用時の公開用クレジット・speaker別規約最終確認。

## 11. 既知の制約

### 11.1 Steam配信済みではない

現状はローカルでSteam depot候補を生成済みである。Steamへ配信済み、アップロード済み、審査提出済み、公開済みとは扱わない。

### 11.2 Unity版への完全移植ではない

今回の作業はWeb版をElectronでSteam向けに包む作業であり、Unity版への再移植ではない。Unity版はWeb版より内容が古いため、Steam初回提出対象としていない。

### 11.3 `dist/desktop/win-unpacked/` はGit管理外

`dist/` は `.gitignore` に追加されている。Electron build成果物は巨大な生成物であり、Git管理しない。

### 11.4 Windows実機起動未確認

`npm run steam:stage`、`npm run test:desktop-package`、`npm run test:desktop-smoke` は成功しているが、Windows実機で `受験番長.exe` をGUI起動する確認は未実施である。

### 11.5 署名未実施

Windows実行ファイル署名は未実施である。`win.signAndEditExecutable: false` は、WSL環境でSteam候補buildを生成するための現時点の判断であり、署名済み配布を意味しない。

### 11.6 Steamworks機能未統合

Steam Cloud、実績、Overlay、Steam API連携は未対応である。初回提出で必須ではない場合でも、Steamストア/ユーザー期待値に応じて別途判断する必要がある。

### 11.7 VOICEVOX関連

VOICEVOX利用時の公開用クレジット・実使用speakerごとの音声ライブラリ規約最終確認は未実施である。公開前に `docs/third-party-notices.md`、ゲーム内クレジット、ストア表記の整合を確認する。

## 12. Steamworksで残っている作業

以下はSteamworks側の外部サービス操作である。ユーザーの明示確認とSteamworks権限を持つ担当者が必要である。

### 12.1 App / Depot設定

- AppIDの確認または登録。
- Windows DepotIDの確認または登録。
- `steam/app_build_steam.template.vdf` の `YOUR_STEAM_APP_ID` を実値へ差し替え。
- `steam/depot_build_windows.template.vdf` の `YOUR_WINDOWS_DEPOT_ID` を実値へ差し替え。
- Steamworks Launch Optionで `受験番長.exe` を指定。

### 12.2 SteamPipe upload

- Steamworks SDK / ContentBuilder環境の準備。
- VDFテンプレートを実値化。
- SteamPipe upload実行。
- upload後のbuild確認。
- build branchへの割り当て。
- default branch反映は明示確認後に実行。

### 12.3 Store / Review / Release

- Steamストアページ編集。
- ストア画像、カプセル画像、アイコン、スクリーンショット準備。
- 年齢レーティング、価格設定、言語設定。
- VOICEVOX、BGM、CG、使用素材のクレジット整理。
- Steam審査提出。
- build branch公開。
- release。

### 12.4 実機・環境確認

- Windows実機で `受験番長.exe` を起動。
- Steamクライアント経由起動確認。
- Steam Deck確認。
- 画面サイズ、保存、BGM、VOICE、外部URL、終了処理の確認。

## 13. リリース前チェックリスト

### 13.1 ローカルbuild

- [ ] `npm install` が成功する。
- [ ] `npm run verify` が成功する。
- [ ] `npm run check` が成功する。
- [ ] `npm run desktop:pack` が成功する。
- [ ] `npm run steam:stage` が成功する。
- [ ] `npm run test:desktop-package` が成功する。
- [ ] `npm run test:desktop-smoke` が成功する。
- [ ] `npm run steam:local-check` が成功する。
- [ ] `git diff --check` が成功する。
- [ ] `dist/desktop/win-unpacked/受験番長.exe` が存在する。
- [ ] `dist/desktop/win-unpacked/resources/app/web/index.html` が存在する。
- [ ] `dist/desktop/win-unpacked/resources/app/web/app.js` が存在する。
- [ ] `dist/desktop/win-unpacked/resources/app/web/data/game-data.js` が存在する。
- [ ] `dist/desktop/win-unpacked/resources/app/electron/main.cjs` が存在する。

### 13.2 Windows実機

- [ ] Windows実機で `受験番長.exe` を直接起動できる。
- [ ] 初期画面が表示される。
- [ ] `はじめる` からゲーム開始できる。
- [ ] `続きから` が保存データあり/なしの両方で破綻しない。
- [ ] BGM ON/OFFが動作する。
- [ ] VOICE OFF状態で不要なVOICEVOX通信が発生しない。
- [ ] 外部URLがアプリ内ではなく既定ブラウザで開く。
- [ ] アプリ終了時にローカルWebサーバーが閉じる。

### 13.3 Steamworks前

- [ ] AppIDを確定する。
- [ ] Windows DepotIDを確定する。
- [ ] VDFテンプレートのplaceholderを実値へ差し替える。
- [ ] Launch Optionに `受験番長.exe` を指定する。
- [ ] Steamworks権限を持つアカウントでuploadする。
- [ ] upload後のbuildをbranchに割り当てる。
- [ ] default branch反映前に人間確認を行う。

### 13.4 素材・規約

- [ ] VOICEVOX利用時の公開用クレジットを確定する。
- [ ] 実使用speakerごとの音声ライブラリ規約を確認する。
- [ ] BGM/CG/フォント/その他素材のライセンスを確認する。
- [ ] ストア画像、カプセル画像、アイコンを準備する。
- [ ] 年齢レーティング、価格、対応OS、言語を確定する。

### 13.5 Steamクライアント

- [ ] SteamPipe upload後、Steamクライアントからインストールできる。
- [ ] Steamクライアント経由で起動できる。
- [ ] 初回起動、保存、再起動、終了が正常に動く。
- [ ] Steam Deckで起動できるか確認する。
- [ ] Overlay、Cloud、実績を使わない場合、その仕様として問題ないか確認する。

## 14. ロールバック方針

### 14.1 Git上のロールバック

Steam移植差分の基準コミットは以下である。

```text
93b38d7 Prepare the web build for Steam desktop staging
```

Steam移植差分を戻す場合は、以下の対象を確認する。

- `electron/main.cjs`
- `web/server.mjs`
- `package.json`
- `package-lock.json`
- `steam/app_build_steam.template.vdf`
- `steam/depot_build_windows.template.vdf`
- `docs/steam-release.md`
- `README.md`
- `scripts/check-desktop-package.mjs`
- `scripts/check-electron-smoke.mjs`
- `scripts/check-steam-local-readiness.mjs`
- `docs/steam-local-release-checklist.md`
- `docs/steam-store-page-draft.md`
- `docs/steam-store-page-fact-check.md`
- `docs/steam-feature-scope.md`
- `docs/steamworks-upload-runbook.md`
- `.gitignore`

既存未追跡ファイル `docs/claude-code-review-request-2026-04-27.md` はSteam移植差分ではないため、ロールバック対象に含めない。

### 14.2 生成物のロールバック

`dist/` はGit管理外の生成物であるため、build成果物を消す場合は以下を削除する。

```bash
rm -rf dist/desktop
```

再生成は以下で行う。

```bash
npm run desktop:pack
npm run steam:stage
npm run test:desktop-package
npm run test:desktop-smoke
npm run steam:local-check
```

### 14.3 Steamworks上のロールバック

Steamworksへupload済みのbuildをbranchへ反映した後に戻す場合は、SteamworksのBuilds / Branch管理で以前のbuildへ戻す必要がある。

現時点ではSteamworks upload、branch公開、default branch反映は未実施である。したがって、現時点のロールバックはローカルGit差分と `dist/` 生成物の削除で足りる。

## 15. 次の推奨タスク

優先度順に実施する。

1. **Windows実機GUI起動確認**  
   `dist/desktop/win-unpacked/受験番長.exe` をWindows上で直接起動し、初期画面、ゲーム開始、保存、終了、外部URL、BGM/VOICE OFF状態を確認する。

2. **Steamworks AppID / DepotID の実値反映**  
   Steamworks側でAppIDとWindows DepotIDを確定し、VDFテンプレートを実値化する。

3. **Steamworks Launch Option設定**  
   Windows depotの起動実行ファイルとして `受験番長.exe` を指定する。

4. **SteamPipe uploadのテストbranch投入**  
   default branchではなく、検証用branchへuploadし、Steamクライアント経由でインストール・起動する。

5. **VOICEVOX / 素材クレジット最終確認**  
   実使用speakerごとの音声ライブラリ規約、VOICEVOX表記、BGM/CG/フォント等の素材クレジットを確定する。

6. **Steam Deck確認**  
   Linux buildまたはProton経由Windows buildのどちらで確認するか決め、実機または互換環境で起動、UI、保存、終了を確認する。

7. **署名・配布形態の判断**  
   Steam depot用unpacked buildとして継続するか、別途署名済みinstallerも用意するか判断する。現時点の `signAndEditExecutable: false` はWSL環境でのローカルSteam候補build生成を通すための判断であり、署名対応完了ではない。

8. **Steam Store素材準備**  
   カプセル画像、スクリーンショット、アイコン、説明文、年齢レーティング、価格設定、言語設定を整える。

9. **Steam Cloud / 実績 / Overlayの採否判断**  
   初回提出で未対応のままにするか、Steam API連携を行うかを決定する。未対応の場合、ストア説明やユーザー期待値と矛盾しないか確認する。

## 付録A. コマンド一覧

```bash
cd /mnt/c/Users/minou/juken-bancho
npm install
npm run verify
npm run check
npm run desktop:pack
npm run steam:stage
npm run test:desktop-package
npm run test:desktop-smoke
npm run steam:local-check
git diff --check
```

旧表記確認:

```bash
rg -n "鉄平" web docs README.md package.json scripts electron steam --glob '!docs/claude-code-review-request-2026-04-27.md'
```

生成物削除:

```bash
rm -rf dist/desktop
```

## 付録B. 現時点で断定できること / できないこと

### 断定できること

- Web版をElectronでSteam向けdesktop appとして包む実装方針である。
- `electron/main.cjs` が追加されている。
- `web/server.mjs` はElectron側から再利用できるよう関数化されている。
- `npm run desktop:pack`、`npm run steam:stage`、`npm run test:desktop-package`、`npm run test:desktop-smoke`、`npm run steam:local-check` は成功済みである。
- `dist/desktop/win-unpacked/` と `受験番長.exe` はローカルに生成済みである。
- `dist/` はGit管理外である。
- Steamworks upload、審査提出、releaseは未実施である。

### 断定できないこと / 未確認

- Windows実機でのGUI起動品質。
- Steamクライアント経由起動。
- Steamworks branch上での挙動。
- Steam Deckでの挙動。
- 署名済みWindows executableとしての挙動。
- 実使用VOICEVOX speakerごとの規約適合。
- Steamストア素材、年齢レーティング、価格設定の妥当性。
