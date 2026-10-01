// Tiny static server for previewing the kit: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };
// The key is read from the environment or from a local .env file (git-ignored). It never reaches the browser.
let KEY = process.env.TYPESAFE_API_KEY;
if (!KEY) { try { KEY = ((await readFile(join(root, '.env'), 'utf8')).match(/^TYPESAFE_API_KEY=(.+)$/m) || [])[1]?.trim(); } catch {} }
/* Copywriting key and model: read on every request, so adding ANTHROPIC_API_KEY to .env works without restarting. */
const env = async name => { if (process.env[name]) return process.env[name]; try { return ((await readFile(join(root, '.env'), 'utf8')).match(new RegExp('^' + name + '=(.+)$', 'm')) || [])[1]?.trim(); } catch { return undefined; } };
createServer(async (req, res) => {
  // Landing Builder: proxy to TypeSafe (Jev) so the API key never reaches the browser.
  if (req.url === '/api/jev') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    if (!KEY) { res.writeHead(501, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'TYPESAFE_API_KEY is not set' })); }
    let body = ''; for await (const chunk of req) body += chunk;
    /* An idle connection to the API can go stale and hang for ~10 s: fail fast and retry once on a fresh one. */
    const call = ms => fetch('https://api.typesafe.ai/v1/systemone', { method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(ms) });
    try {
      let r; try { r = await call(2500); } catch (e) { console.error('Jev: first attempt failed, retrying ·', String(e.cause || e)); r = await call(5000); }
      res.writeHead(r.status, { 'Content-Type': 'application/json' }); return res.end(await r.text());
    } catch (e) { console.error('Jev: request failed ·', String(e.cause || e)); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: String(e) })); }
  }
  /* Copywriting: Claude writes the texts for the blocks Jev picked, from the brief + tools/data/kismet-knowledge.md, as structured data. */
  if (req.url === '/api/copy') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    const COPY_KEY = await env('ANTHROPIC_API_KEY'), COPY_MODEL = (await env('COPY_MODEL')) || 'claude-sonnet-5-5';
    if (!COPY_KEY) { res.writeHead(501, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not set' })); }
    let body = ''; for await (const chunk of req) body += chunk;
    try {
      const { brief = '', strategy = '', voice = '', sections = [] } = JSON.parse(body);
      const { COPY } = await import(new URL('../library/copy.js', import.meta.url));
      const ids = ['page', ...sections.filter((id, i, a) => COPY[id] && id !== 'page' && a.indexOf(id) === i)];
      const shape = s => typeof s === 'string' ? { type: 'string', description: s } : Array.isArray(s) ? { type: 'array', minItems: s[0], maxItems: s[0], items: shape(s[1]) } : { type: 'object', properties: Object.fromEntries(Object.entries(s).map(([k, v]) => [k, shape(v)])), required: Object.keys(s), additionalProperties: false };
      const schema = { type: 'object', properties: Object.fromEntries(ids.map(id => [id, shape(COPY[id])])), required: ids, additionalProperties: false };
      const knowledge = await readFile(new URL('./data/kismet-knowledge.md', import.meta.url), 'utf8');
      const system = `You are Kismet's senior copywriter. You write the copy of one landing page, block by block, for the page structure you are given.\n\nRules:\n- The page must deliver what the brief asks for. If the brief is about ingredients, explain ingredients and their benefits; if it is about a store, say where and how to find it; and so on. Every block should move that one story forward — no generic filler.\n- Use only the facts below. Never invent numbers, studies, prices, awards, testimonials or health claims.\n- Respect the length limits in each field description. Plain text only: no markdown, no emojis, no quotation marks around the text.\n- Always write in English.\n\n${knowledge}`;
      const user = `Brief from the marketing team: "${brief}"\n\nPage approach: ${strategy}\nVoice for this version: ${voice}\nBlocks on the page, in order: ${sections.join(', ')}\n\nWrite the copy with the write_copy tool. "page" holds the hero and the lines shared across the page.`;
      const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: AbortSignal.timeout(60000), headers: { 'x-api-key': COPY_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: COPY_MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content: user }], tools: [{ name: 'write_copy', description: 'Deliver the copy for every requested block of the landing page.', input_schema: schema }], tool_choice: { type: 'tool', name: 'write_copy' } }) });
      const j = await r.json();
      if (!r.ok) { console.error('Copy: API error ·', r.status, j.error && j.error.message); res.writeHead(r.status, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: (j.error && j.error.message) || 'Anthropic API error' })); }
      const out = (j.content || []).find(b => b.type === 'tool_use');
      res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ copy: out ? out.input : {}, model: j.model, usage: j.usage }));
    } catch (e) { console.error('Copy: request failed ·', String(e.cause || e)); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: String(e) })); }
  }
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, p);
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Kismet DS → http://localhost:${port}  ·  Landing Builder → http://localhost:${port}/builder/  ·  Jev: ${KEY ? 'connected' : 'no TYPESAFE_API_KEY (demo mode)'}`));
