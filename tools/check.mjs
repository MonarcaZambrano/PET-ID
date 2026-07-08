import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = ['index.html','admin.html','profile.html','css/styles.css','js/shared.js','js/customer.js','js/admin.js','js/profile.js','vendor/petid-qr.min.js','_redirects','_headers'];
for (const file of required) await access(path.join(root,file));
for (const file of ['js/shared.js','js/customer.js','js/admin.js','js/profile.js']) {
  const result = spawnSync(process.execPath, ['--check', path.join(root,file)], { encoding:'utf8' });
  if (result.status !== 0) throw new Error(`${file}: ${result.stderr}`);
}
for (const file of ['index.html','admin.html','profile.html']) {
  const text = await readFile(path.join(root,file),'utf8');
  if (!text.includes('<!doctype html>') || !text.includes('</html>')) throw new Error(`${file}: HTML incompleto`);
}
console.log('Comprobación básica correcta.');
