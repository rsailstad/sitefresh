// GET /api/fetch?url=https://example.com
// Server-side page fetcher for the in-browser AI search audit (replaces public CORS proxies).
// Guards: http(s) only, public IPs only (checked on every redirect hop), 10s timeout, 2 MB cap.
import dns from 'node:dns/promises';
import net from 'node:net';

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_HOPS = 5;

function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) return isPrivate(v.slice(7));
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80');
}

async function assertPublic(u) {
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Only http(s) URLs are allowed');
  if (u.port && !['80', '443'].includes(u.port)) throw new Error('Non-standard ports are not allowed');
  const addrs = await dns.lookup(u.hostname, { all: true });
  if (!addrs.length || addrs.some(a => isPrivate(a.address))) throw new Error('Address not allowed');
}

export default async function handler(req, res) {
  let target;
  try { target = new URL(String(req.query.url || '')); } catch { return res.status(400).send('Invalid URL'); }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    let resp;
    for (let hop = 0; hop <= MAX_HOPS; hop++) {
      await assertPublic(target);
      resp = await fetch(target, {
        redirect: 'manual',
        signal: ctrl.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SiteFreshAudit/1.0; +https://sitefresh.co/audit.html)',
          'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
        },
      });
      const loc = resp.headers.get('location');
      if (resp.status >= 300 && resp.status < 400 && loc) { target = new URL(loc, target); continue; }
      break;
    }
    if (!resp.ok) return res.status(502).send(`Site returned HTTP ${resp.status}`);
    const type = resp.headers.get('content-type') || '';
    if (!/html|xml|text\/plain/i.test(type)) return res.status(415).send('Not an HTML page');

    const reader = resp.body.getReader();
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) { ctrl.abort(); break; }
      chunks.push(value);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=600');
    res.setHeader('X-Final-Url', target.href);
    return res.status(200).send(Buffer.concat(chunks.map(c => Buffer.from(c))).toString('utf8'));
  } catch (e) {
    return res.status(502).send(e.name === 'AbortError' ? 'Site took too long to respond' : e.message);
  } finally {
    clearTimeout(timer);
  }
}
