/** Minimal dependency-free static server for DevShift local development. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT)||3000;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8'};
const server = createServer(async(req,res)=>{
 if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405);return res.end('Method not allowed');}
 let pathname;
 try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
 catch {res.writeHead(400);return res.end('Invalid request');}
 if(pathname.includes('\0')||pathname.includes('\\')){res.writeHead(400);return res.end('Invalid path');}
 let path=resolve(root,'.'+pathname);
 if(!(path===root||path.startsWith(root+sep))){res.writeHead(403);return res.end('Forbidden');}
 if(pathname==='/'||pathname==='/index')path=resolve(root,'index.html');
 if(pathname!== '/'&&!extname(path))path+='.html';
 if(['.env','.gitignore'].some(part=>pathname===`/${part}`)||pathname.includes('/.git/')||pathname.startsWith('/tests/')||['/package.json','/dev-server.mjs','/README.md'].includes(pathname)){res.writeHead(404);return res.end('Not found');}
 try {
  const file=await stat(path);
  if(!file.isFile())throw new Error('not file');
  const bytes=await readFile(path);
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:bytes);
 }catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Page not found');}
});
server.listen(port,()=>console.log(`DevShift running at http://localhost:${port}  (Ctrl+C to stop)`));
