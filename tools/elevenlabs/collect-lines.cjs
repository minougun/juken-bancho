// 受験番長を自動で何回も最後まで遊ばせて、実際に読み上げるセリフ（castId と文）を全部集める。
// 画面が変わるたびに、ゲームの queueCurrentDialogueVoice と同じ材料（名前の欄と、読み上げ用の文 or 本文）を
// ゲーム自身の buildVoiceLines に通す。
// 実行：node tools/elevenlabs/collect-lines.cjs <回数> <出力.json> [既存の一覧.json（漏れを数える）]
const { chromium } = require('/home/minougun/.nvm/versions/node/v24.22.1/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', 'web');
const RUNS = Number(process.argv[2] || 3), OUT = process.argv[3], KNOWN = process.argv[4];
// 遊び方：環境変数 STRATEGY=study なら、勉強・学習・机・赤本などの選択肢を 8 割の確率で優先する（良い結末に近づける）
const STRATEGY = process.env.STRATEGY || 'random';
const T = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json' };
const srv = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html';
  // 音声・BGM は読まない（速くするため）
  if (/\.(mp3|ogg|wav)$/.test(f) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(8786, '127.0.0.1');

(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
  const all = new Map(); const growth = []; const errors = [];
  for (let run = 0; run < RUNS; run++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.addInitScript(() => {
      window.__seen = new Map();
      const grab = () => {
        const sp = document.querySelector('#speakerName'), dt = document.querySelector('#dialogueText');
        if (!sp || !dt || !window.JUKEN_BANCHO_AUDIO) return;
        const text = (dt.dataset.voiceText || dt.textContent).trim();
        if (!text) return;
        for (const l of window.JUKEN_BANCHO_AUDIO.buildVoiceLines(sp.textContent.trim(), text)) window.__seen.set(l.castId + '|' + l.text, { castId: l.castId, text: l.text });
      };
      new MutationObserver(grab).observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['data-voice-text'] });
    });
    await p.addInitScript((st) => { window.__strategy = st; }, STRATEGY);
    await p.goto('http://127.0.0.1:8786/');
    await p.waitForFunction(() => window.JUKEN_BANCHO_AUDIO);
    let steps = 0, screen = '';
    while (steps < 2500) {
      steps++;
      screen = await p.locator('.novel-stage').evaluate((e) => e.dataset.screen).catch(() => '');
      if (screen === 'ending') break;
      // 押せるものを1つ選ぶ：次へ → 選択肢・カード（ランダム）→ はじめる
      const clicked = await p.evaluate(() => {
        const vis = (e) => e && !e.hidden && !e.disabled && e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden';
        const adv = document.querySelector('#advanceButton');
        if (vis(adv)) { adv.click(); return 'advance'; }
        const pool = [...document.querySelectorAll('.novel-stage button, .novel-stage [role="button"]')]
          .filter((e) => vis(e) && !e.closest('.system-controls, .hud, #menuPanel, .collection-page') && !/メニュー|閉じる|戻る|スキップ|BGM|VOICE|結末帳|回想帳|学習帳/.test(e.textContent));
        if (!pool.length) return '';
        const study = pool.filter((e) => /勉強|学習|机|赤本|模試|自習|参考書|予習|復習|塾|図書/.test(e.textContent));
        const pick = (window.__strategy === 'study' && study.length && Math.random() < 0.8)
          ? study[Math.floor(Math.random() * study.length)]
          : pool[Math.floor(Math.random() * pool.length)];
        pick.click(); return 'pick:' + pick.textContent.trim().slice(0, 10);
      });
      if (!clicked) {
        const start = p.getByRole('button', { name: /はじめる/ }).first();
        if (await start.isVisible().catch(() => false)) await start.click(); else await p.waitForTimeout(150);
      }
      await p.waitForTimeout(clicked.startsWith('pick') ? 120 : 40);
    }
    const seen = await p.evaluate(() => [...window.__seen.values()]);
    for (const l of seen) all.set(l.castId + '|' + l.text, l);
    growth.push(all.size);
    console.log(`run ${run + 1}: screen=${screen} steps=${steps} この回 ${seen.length} 行 / 合計 ${all.size} 行`);
    await ctx.close();
  }
  const lines = [...all.values()];
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ model_id: 'eleven_v4', lines }, null, 1));
  if (KNOWN) {
    const known = new Set(JSON.parse(fs.readFileSync(KNOWN, 'utf8')).lines.map((l) => l.castId + '|' + l.text));
    const miss = lines.filter((l) => !known.has(l.castId + '|' + l.text));
    console.log('既存の一覧に無い行:', miss.length); for (const m of miss.slice(0, 15)) console.log('  ', m.castId, m.text.slice(0, 40));
  }
  const chars = lines.reduce((a, l) => a + l.text.length, 0);
  console.log('合計', lines.length, '行', chars, '文字', 'errors', errors.slice(0, 3));
  await b.close(); srv.close();
})();
