#!/usr/bin/env python3
"""受験番長の声を ElevenLabs（Eleven v4、model_id: eleven_v4）で作る。

鍵は環境変数 ELEVENLABS_API_KEY から読む（表示しない・保存しない）。標準ライブラリだけで動く。

1) 声の一覧を保存する（無料・読むだけ）
     python3 tools/elevenlabs/el.py voices
   → tools/elevenlabs/voices.json（アカウントの声の名前・ラベル・試聴 URL）

2) 割り当て（tools/elevenlabs/casting.json：{"bancho": "<voice_id>", ...}）で音声を作る（文字数を使う）
     python3 tools/elevenlabs/el.py generate --lines tools/elevenlabs/trial-lines.json --max-chars 2000
   → web/assets/voice/el/<castId>/<sha1>.mp3 と web/assets/voice/el/manifest.json
   すでにある音声は作り直さない。--max-chars を超えそうなら、送る前に止まる。失敗は再試行しない。

ゲームは castId と text の組で manifest を引く（text はゲームの buildVoiceLines が返す読み方つきの文）。
"""
import argparse
import hashlib
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
API = "https://api.elevenlabs.io"
MODEL = "eleven_v4"
OUT = ROOT / "web" / "assets" / "voice" / "el"


def key():
    k = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not k:
        sys.exit("ELEVENLABS_API_KEY が設定されていません（端末で設定してから流してください）")
    return k


def request(method, path, body=None, accept="application/json"):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method,
                                 headers={"xi-api-key": key(), "Content-Type": "application/json", "Accept": accept})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        detail = e.read()[:300].decode("utf-8", "replace")
        raise SystemExit(f"HTTP {e.code} {path}: {detail}")


def voices():
    out, token = [], None
    while True:
        q = "/v2/voices?page_size=100" + (f"&next_page_token={token}" if token else "")
        d = json.loads(request("GET", q))
        for v in d.get("voices", []):
            out.append({"voice_id": v["voice_id"], "name": v.get("name"), "category": v.get("category"),
                        "labels": v.get("labels") or {}, "description": v.get("description"),
                        "preview_url": v.get("preview_url")})
        token = d.get("next_page_token")
        if not d.get("has_more") or not token:
            break
    (HERE / "voices.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    ja = [v for v in out if (v["labels"].get("language") or "").startswith("ja")]
    print(f"{len(out)} 件（日本語のラベル {len(ja)} 件）→ {HERE / 'voices.json'}")


def sha(cast, text):
    return hashlib.sha1(f"{cast}|{text}".encode()).hexdigest()[:16]


def generate(lines_path, max_chars):
    casting = json.loads((HERE / "casting.json").read_text())
    lines = json.loads(Path(lines_path).read_text())["lines"]
    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {"model_id": MODEL, "lines": {}}
    todo = []
    for l in lines:
        cast, text = l["castId"], l["text"]
        if cast not in casting:
            print(f"割り当てなし（とばす）: {cast}")
            continue
        key_ = f"{cast}|{text}"
        rel = f"{cast}/{sha(cast, text)}.mp3"
        if key_ in manifest["lines"] and (OUT / rel).exists():
            continue
        todo.append((cast, text, key_, rel))
    total = sum(len(t[1]) for t in todo)
    print(f"作る音声 {len(todo)} 本・{total} 文字（上限 {max_chars}）")
    if total > max_chars:
        sys.exit("上限を超えるので送りません。--max-chars を確かめてください")
    for i, (cast, text, key_, rel) in enumerate(todo, 1):
        audio = request("POST", f"/v1/text-to-speech/{casting[cast]}?output_format=mp3_44100_128",
                        {"text": text, "model_id": MODEL, "language_code": "ja"}, accept="audio/mpeg")
        (OUT / rel).parent.mkdir(parents=True, exist_ok=True)
        (OUT / rel).write_bytes(audio)
        manifest["lines"][key_] = rel
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
        print(f"[{i}/{len(todo)}] {cast} {text[:24]}")
    print("できました:", manifest_path)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("voices")
    g = sub.add_parser("generate")
    g.add_argument("--lines", required=True)
    g.add_argument("--max-chars", type=int, required=True)
    a = ap.parse_args()
    voices() if a.cmd == "voices" else generate(a.lines, a.max_chars)
