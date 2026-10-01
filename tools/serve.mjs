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
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, p);
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Kismet DS → http://localhost:${port}  ·  Landing Builder → http://localhost:${port}/builder/  ·  Jev: ${KEY ? 'connected' : 'no TYPESAFE_API_KEY (demo mode)'}`));
