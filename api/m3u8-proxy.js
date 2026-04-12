// Vercel serverless — HLS proxy using Node https module (not fetch)
// fetch() on Vercel strips/ignores certain headers; https.request does not
// Usage: /api/m3u8-proxy?url=<encoded>&referer=<encoded>

import https from "https";
import http from "http";
import { URL } from "url";

export const config = { maxDuration: 30 };

function request(urlStr, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const mod    = parsed.protocol === "https:" ? https : http;
    const opts   = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   "GET",
      headers,
      timeout:  15000,
    };
    const req = mod.request(opts, resolve);
    req.on("error",   reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.end();
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing url" });

  let decoded;
  try { decoded = decodeURIComponent(targetUrl); }
  catch { decoded = targetUrl; }

  const referer = req.query.referer
    ? decodeURIComponent(req.query.referer)
    : "https://streameeeeee.site/";
  const origin = new URL(referer).origin;

  const reqHeaders = {
    "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer":         referer,
    "Origin":          origin,
    "Accept":          "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection":      "keep-alive",
  };

  try {
    const upstream = await request(decoded, reqHeaders);

    if (upstream.statusCode >= 400) {
      return res.status(upstream.statusCode).json({ error: `Upstream ${upstream.statusCode}` });
    }

    const contentType = upstream.headers["content-type"] || "";
    const isPlaylist  = decoded.includes(".m3u8") || contentType.includes("mpegurl");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", isPlaylist ? "no-cache" : "public, max-age=3600");
    res.setHeader("Content-Type", isPlaylist
      ? "application/vnd.apple.mpegurl"
      : contentType || "application/octet-stream");

    if (!isPlaylist) {
      // Stream binary directly
      upstream.pipe(res);
      return;
    }

    // Buffer playlist text and rewrite URLs
    const chunks = [];
    for await (const chunk of upstream) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString("utf8");
    const base = decoded.substring(0, decoded.lastIndexOf("/") + 1);

    const proto    = req.headers["x-forwarded-proto"] || "https";
    const host     = req.headers.host;
    const refParam = `&referer=${encodeURIComponent(referer)}`;
    const proxyBase = `${proto}://${host}/api/m3u8-proxy?url=`;

    const rewritten = text.split("\n").map(line => {
      const t = line.trim();
      if (!t || t.startsWith("#")) {
        return line.replace(/URI="([^"]+)"/g, (_, uri) => {
          const abs = uri.startsWith("http") ? uri : base + uri;
          return `URI="${proxyBase}${encodeURIComponent(abs)}${refParam}"`;
        });
      }
      const abs = t.startsWith("http") ? t : base + t;
      return `${proxyBase}${encodeURIComponent(abs)}${refParam}`;
    }).join("\n");

    return res.status(200).send(rewritten);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
