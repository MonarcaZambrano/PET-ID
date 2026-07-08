import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const mime = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp' };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    let filePath;
    if (/^\/p\/[^/]+\/?$/.test(pathname)) filePath = path.join(root, 'profile.html');
    else if (pathname === '/') filePath = path.join(root, 'index.html');
    else filePath = path.join(root, pathname.replace(/^\//, ''));
    const normalized = path.normalize(filePath);
    if (!normalized.startsWith(root)) throw new Error('Ruta inválida');
    const info = await stat(normalized);
    const target = info.isDirectory() ? path.join(normalized, 'index.html') : normalized;
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(path.join(root, '404.html'));
      res.writeHead(404, { 'Content-Type':'text/html; charset=utf-8' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  }
});
server.listen(port, () => console.log(`PetID disponible en http://localhost:${port}`));
