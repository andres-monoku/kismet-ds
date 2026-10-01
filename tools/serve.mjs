// Tiny static server for previewing the kit: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };
const KEY = process.env.TYPESAFE_API_KEY;
createServer(async (req, res) => {
  // Landing Builder: proxy to TypeSafe (Jev) so the API key never reaches the browser.
  if (req.url === '/api/jev') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    if (!KEY) { res.writeHead(501, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'TYPESAFE_API_KEY is not set' })); }
    let body = ''; for await (const chunk of req) body += chunk;
    try {
      const r = await fetch('https://api.typesafe.ai/v1/systemone', { method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body });
      res.writeHead(r.status, { 'Content-Type': 'application/json' }); return res.end(await r.text());
    } catch (e) { res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: String(e) })); }
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
