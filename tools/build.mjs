import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const items = ['index.html','admin.html','profile.html','404.html','robots.txt','_redirects','_headers','css','js','vendor'];
await rm(dist, { recursive:true, force:true });
await mkdir(dist, { recursive:true });
for (const item of items) await cp(path.join(root,item), path.join(dist,item), { recursive:true });
console.log(`Build creado en ${dist}`);
