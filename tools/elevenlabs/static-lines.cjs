// データとスクリプトに直接書かれたセリフを取り出し、自動で遊んで集めた一覧（all-lines.json）に足す。
// 1) 「名前「…」」の形の行（誰の声か文で決まる）
// 2) voiceText: "..." の主人公の行（どちらの主人公か分からないので、両方の分）
// 実行：node tools/elevenlabs/static-lines.cjs  → tools/elevenlabs/full-lines.json
const { chromium } = require('/home/minougun/.nvm/versions/node/v24.22.1/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const T = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const srv = http.createServer((req, res) => { let f = path.join(ROOT, 'web', decodeURIComponent(req.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html'; if (/\.(mp3|ogg|wav)$/.test(f) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); }).listen(8787, '127.0.0.1');
const quoteTexts = new Set(), voiceTexts = new Set();
for (const f of ['web/data/game-data.js', 'web/app.js']) {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const m of s.matchAll(/"((?:[^"\\\n]|\\.)*)"/g)) {
    let v; try { v = JSON.parse('"' + m[1] + '"'); } catch { continue; }
    for (const line of v.split(/\n+/)) if (/^[^「」:：]{1,24}「.+」$/.test(line.trim())) quoteTexts.add(line.trim());
  }
  for (const m of s.matchAll(/voiceText:\s*\n?\s*"((?:[^"\\\n]|\\.)*)"/g)) { try { voiceTexts.add(JSON.parse('"' + m[1] + '"')); } catch { } }
}
// 3) 条件で言い方を変える台詞（`${speaker}「…${cond ? "A" : "B"}…」`）：両方の言い方を作る。
//    誰の声かは、その台詞の前後 30 行に出てくる登場人物の名前で決める。
const CAST_NAMES = ['受験番長', '優等生ギャル', '徹平', 'ミナ', '黒羽レン', '鬼塚先生'];
const ternaryLines = new Set();
{
  const src = fs.readFileSync(path.join(ROOT, 'web/app.js'), 'utf8');
  const rows = src.split('\n');
  rows.forEach((row, i) => {
    const m = row.match(/`\$\{speaker\}「(.*)」`/);
    if (!m || !/\$\{[^}]*\?\s*"[^"]*"\s*:\s*"[^"]*"\s*\}/.test(m[1])) return;
    const near = rows.slice(Math.max(0, i - 30), i + 30).join('\n');
    const names = CAST_NAMES.filter((n) => near.includes('"' + n + '"'));
    // ${cond ? "A" : "B"} を A・B に展開（複数あれば全組み合わせ）
    let variants = [m[1]];
    while (variants.some((v) => /\$\{/.test(v))) {
      variants = variants.flatMap((v) => {
        const t = v.match(/\$\{[^}]*\?\s*"([^"]*)"\s*:\s*"([^"]*)"\s*\}/);
        if (!t) return [v.replace(/\$\{[^}]*\}/, '')];
        return [v.replace(t[0], t[1]), v.replace(t[0], t[2])];
      });
    }
    for (const n of names) for (const v of variants) ternaryLines.add(`${n}「${v}」`);
  });
}
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.goto('http://127.0.0.1:8787/'); await p.waitForFunction(() => window.JUKEN_BANCHO_AUDIO);
  const extra = await p.evaluate(([qs, vs, ts]) => {
    const A = window.JUKEN_BANCHO_AUDIO, out = [];
    for (const q of qs) for (const l of A.buildVoiceLines('ナレーション', q)) out.push({ castId: l.castId, text: l.text, from: 'quote' });
    for (const q of ts) for (const l of A.buildVoiceLines('ナレーション', q)) out.push({ castId: l.castId, text: l.text, from: 'ternary' });
    for (const v of vs) for (const sp of ['受験番長', '優等生ギャル']) for (const l of A.buildVoiceLines(sp, v)) out.push({ castId: l.castId, text: l.text, from: 'voiceText' });
    return out;
  }, [[...quoteTexts], [...voiceTexts], [...ternaryLines]]);
  console.log('条件の台詞', ternaryLines.size, [...ternaryLines].map((x) => x.slice(0, 22)).join(' / '));
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-lines.json'), 'utf8')).lines;
  const all = new Map(base.map((l) => [l.castId + '|' + l.text, { castId: l.castId, text: l.text }]));
  let added = 0, addedChars = 0;
  for (const l of extra) { const k = l.castId + '|' + l.text; if (!all.has(k)) { all.set(k, { castId: l.castId, text: l.text }); added++; addedChars += l.text.length; } }
  const lines = [...all.values()];
  fs.writeFileSync(path.join(__dirname, 'full-lines.json'), JSON.stringify({ model_id: 'eleven_v4', lines }, null, 1));
  const by = {}; for (const l of lines) by[l.castId] = (by[l.castId] || 0) + 1;
  console.log('quote', quoteTexts.size, 'voiceText', voiceTexts.size, '足した', added, '行', addedChars, '文字');
  console.log('合計', lines.length, '行', lines.reduce((a, l) => a + l.text.length, 0), '文字', JSON.stringify(by));
  await b.close(); srv.close();
})();
