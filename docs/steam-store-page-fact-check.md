# Steamストア下書き fact-check pass

作成日: 2026-05-15

対象:

- `docs/steam-store-page-draft.md`
- `docs/steam-feature-scope.md`
- `docs/third-party-notices.md`

## 結果

公開・Steamworks入力前の下書きとしては使用可能。ただし、ストア画像の最終提出、VOICEVOX speaker、価格、対応言語、Steam Cloud/実績/Overlayの採否は未確定のまま残す。

## チェック済み主張

| 主張 | 種別 | 判定 | 根拠 / 対応 |
| --- | --- | --- | --- |
| 144週のゲームである | product detail / number | verified | `web/data/game-data.js` の `TOTAL_TURNS = 144` と各志望校 `totalTurns: 144` に一致。 |
| 2主人公である | product detail / number | verified | `web/data/game-data.js` の `protagonistProfiles` に `bancho` と `gyaru` が存在。 |
| 結末帳に全10エンディングがある | product detail / number | verified | `web/data/game-data.js` の `endingCatalog` は番長5種、ギャル5種。 |
| 保存は現時点で `localStorage` ベース | product detail | verified | `web/app.js` で進行、結末、回想、復習が `window.localStorage` に保存される。 |
| VOICEはローカルVOICEVOX Engineがある場合に使う | product detail | verified | `web/app.js` の `VOICEVOX_DIRECT_URLS` と `/voicevox` proxy、`docs/third-party-notices.md` の記載に一致。 |
| VOICEVOX音声ファイルは同梱していない | product detail | verified | `docs/third-party-notices.md` に明記。repo内の音声ファイルはBGM/SE用途。 |
| BGMの多くはCC0素材として整理されている | attribution / license | partially supported | `docs/third-party-notices.md` 上ではOpenGameArtのCC0として整理済み。ただし公開前に各source pageの再確認が必要。 |
| Steamの必須Store Assetサイズ | policy detail / number | verified | Steamworks Graphical Assets公式docsのサイズ表に合わせた。 |
| Steamのカプセル画像はゲームアート、ゲーム名、公式サブタイトル以外を避ける | policy detail | verified | Steamworks Graphical Asset Rules公式docsに合わせた。 |
| Short Descriptionに時期依存文言を入れない | policy detail | verified | Steamworks Store Page Written Description公式docsに合わせた。 |
| About This Game内に外部リンクや他作品宣伝を入れない | policy detail | verified | Steamworks Store Page Written Description公式docsに合わせた。 |
| 初回提出ではSteam API連携を必須化しない方針 | product decision | supported as recommendation | 現状の保存が `localStorage` であり、Steam Cloud/実績はSteamworks SDKまたはSteamworks側設定と追加検証が必要なため、初回scope外推奨として妥当。 |

## 要注意

- `Juken Bancho` は英題候補。正式英題として確定したわけではない。
- Steamストア画像は未制作。`docs/steam-store-page-draft.md` はサイズ表と制作要件であり、提出物ではない。
- VOICEVOX speakerの最終利用名とクレジットは未確定。
- BGM/CG/フォント/生成画像の公開用クレジットは、Steam審査前にもう一度 source 単位で確認する。
- Steam Cloud、実績、Overlayは未対応方針のドラフト。ストア上で対応機能として表示しない。

## 参照

- Steamworks Graphical Assets: `https://partner.steamgames.com/doc/store/assets?l=english`
- Steamworks Graphical Asset Rules: `https://partner.steamgames.com/doc/store/assets/rules`
- Steamworks Store Page Written Description: `https://partner.steamgames.com/doc/store/page/description?language=english`
- Steam Cloud: `https://partner.steamgames.com/doc/features/cloud?l=english`
- Steam Stats and Achievements: `https://partner.steamgames.com/doc/features/achievements?l=english`
