// CI only: brotli/gzip reverse proxy in front of the production server so the
// performance audit sees compressed transfers like the real CDN does.
import http from 'node:http';
import zlib from 'node:zlib';
const TARGET = Number(process.env.TARGET_PORT || 4173);
const PORT = Number(process.env.PORT || 4174);
http.createServer((req, res) => {
  const up = http.request({ host: '127.0.0.1', port: TARGET, path: req.url, method: req.method, headers: { ...req.headers, 'accept-encoding': 'identity', host: `localhost:${TARGET}` } }, (r) => {
    const type = String(r.headers['content-type'] || '');
    const compressible = /text|javascript|json|css|svg|xml/.test(type) && !r.headers['content-encoding'];
    const headers = { ...r.headers };
    if (!compressible) { res.writeHead(r.statusCode || 200, headers); r.pipe(res); return; }
    delete headers['content-length'];
    const br = /br/.test(String(req.headers['accept-encoding'] || ''));
    headers['content-encoding'] = br ? 'br' : 'gzip';
    res.writeHead(r.statusCode || 200, headers);
    r.pipe(br ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.createGzip()).pipe(res);
  });
  up.on('error', () => { res.writeHead(502); res.end(); });
  req.pipe(up);
}).listen(PORT, () => console.log(`compress proxy :${PORT} -> :${TARGET}`));
