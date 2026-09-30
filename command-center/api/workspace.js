const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../private');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.json':'application/json'};
function equal(a,b) {
  const x=crypto.createHash('sha256').update(a).digest();
  const y=crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(x,y);
}
module.exports = (req,res) => {
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','same-origin');
  if (!process.env.COMMAND_PASSWORD) { res.statusCode=503; return res.end('Private demo access is not configured.'); }
  const auth=req.headers.authorization || '';
  let credential='';
  if (auth.startsWith('Basic ')) credential=Buffer.from(auth.slice(6),'base64').toString();
  const colon=credential.indexOf(':');
  if (colon<0 || !equal(credential.slice(0,colon),'investor') || !equal(credential.slice(colon+1),process.env.COMMAND_PASSWORD)) {
    res.setHeader('WWW-Authenticate','Basic realm="Metari Investor Demo", charset="UTF-8"');
    res.statusCode=401; return res.end('Sign in to access the Metari investor demo.');
  }
  if (!['GET','HEAD'].includes(req.method)) { res.statusCode=405; res.setHeader('Allow','GET, HEAD'); return res.end(); }
  let rel;
  try { rel=decodeURIComponent(new URL(req.url,'https://command.metari.io').pathname); } catch { res.statusCode=400; return res.end(); }
  const file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));
  if (!file.startsWith(root+path.sep)) { res.statusCode=404; return res.end(); }
  let stat;
  try { stat=fs.statSync(file); if (!stat.isFile()) throw new Error(); } catch { res.statusCode=404; return res.end(); }
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges','bytes');
  let start=0,end=stat.size-1;
  if(req.headers.range) {
    const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!match || (!match[1]&&!match[2])) { res.statusCode=416; res.setHeader('Content-Range',`bytes */${stat.size}`); return res.end(); }
    if(!match[1]) start=Math.max(0,stat.size-Number(match[2]));
    else { start=Number(match[1]); if(match[2]) end=Math.min(end,Number(match[2])); }
    if(start>end || start>=stat.size) { res.statusCode=416; res.setHeader('Content-Range',`bytes */${stat.size}`); return res.end(); }
    res.statusCode=206; res.setHeader('Content-Range',`bytes ${start}-${end}/${stat.size}`);
  }
  res.setHeader('Content-Length',end-start+1);
  if(req.method==='HEAD') return res.end();
  fs.createReadStream(file,{start,end}).pipe(res);
};
