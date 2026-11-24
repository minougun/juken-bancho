# 受験番長の声を ElevenLabs（Eleven v4）で作る（2026-11-24）

- モデル：eleven_v4（公式ドキュメントで日本語対応を確認）。鍵は環境変数 ELEVENLABS_API_KEY（表示・保存しない）。
- ゲーム側（web/app.js）：assets/voice/el/manifest.json の「castId|読み上げる文」→ 音声ファイル。一式があれば声は ElevenLabs だけ（VOICEVOX やブラウザの読み上げに切り替えない）。一式に無い行は鳴らさず、voiceDebugLog に elevenlabs-missing として残す。一式が無いときだけ従来どおり。VOICE ボタンの表示は「キャラ声」。
- 試しのセリフ：trial-lines.json（導入4場面×2人＋冒頭の出来事、31 行・758 文字）。ゲームの buildVoiceLines と同じ文（読み方つき）。

## 手順（普通のターミナルで。サンドボックスからは api.elevenlabs.io に接続できなかった）
1. 声の一覧：`python3 tools/elevenlabs/el.py voices` → voices.json
2. 割り当て：casting.json に {"bancho": "<voice_id>", "gyaru": ..., "teppei": ..., "mina": ..., "teacher": ..., "ren": ..., "narrator": ...}
3. 試し：`python3 tools/elevenlabs/el.py generate --lines tools/elevenlabs/trial-lines.json --max-chars 1000`
4. 聴いて決めてから全体：`python3 tools/elevenlabs/el.py generate --lines tools/elevenlabs/full-lines.json --max-chars 9000`

## 全体のセリフ一覧（full-lines.json、441 行・8,252 文字）の作り方
- collect-lines.cjs：ゲームを自動で最後まで遊ばせ、画面が変わるたびに名前の欄と文（読み上げ用の文があればそれ）を buildVoiceLines に通して集める。でたらめに 40 回 → 364 行で頭打ち（all-lines.json）。
- static-lines.cjs：データとスクリプトに書かれた「名前「…」」の台詞、voiceText の主人公の台詞（両方の主人公）、条件で言い方を変える台詞（両方の言い方、声は前後 30 行の名前）を足す → full-lines.json。
- 確認：勉強を優先する遊び方（STRATEGY=study）で別に 15 回 → 一覧に無い行 0（check-study.json）。
- クイズの問題文・解説は名前「…」の形ではなく、読み上げの対象外。
- ゲームのセリフや読み方を変えたら、この3つを流し直して、el.py generate で足りない分だけ作る。
