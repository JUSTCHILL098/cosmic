// Vercel serverless — proxies videasy.vercel.app/sources to bypass CORS
// videasy.vercel.app runs WASM decryption and returns direct HLS m3u8 URLs

import https from "https";
import { URL } from "url";

export const config = { maxDuration: 30 };

function nodeGet(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const opts = {
      hostname: u.hostname,
      port:     u.port || 443,
      path:     u.pathname + u.search,
      method:   "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        "Accept":     "application/json, */*",
        "Origin":     "https://videasy.vercel.app",
        "Referer":    "https://videasy.vercel.app/",
      },
      timeout: 25000,
    };
    const req = https.request(opts, resolve);
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

  const {
    tmdbId, mediaType = "movie", title = "",
    year = "", seasonId = "1", episodeId = "1", imdbId = "",
  } = req.query;

  if (!tmdbId) return res.status(400).json({ error: "Missing tmdbId" });

  // Exact params as documented on videasy.vercel.app
  const params = new URLSearchParams({
    title,
    mediaType,
    tmdbId,
    year,
    seasonId,
    episodeId,
    imdbId,
  });

  const targetUrl = `https://videasy.vercel.app/sources?${params}`;

  try {
    const upstream = await nodeGet(targetUrl);

    if (upstream.statusCode >= 400) {
      // Read error body for debugging
      const chunks = [];
      for await (const chunk of upstream) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString("utf8");
      return res.status(upstream.statusCode).json({
        error: `Videasy returned ${upstream.statusCode}`,
        detail: body.slice(0, 300),
      });
    }

    const chunks = [];
    for await (const chunk of upstream) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString("utf8");

    let data;
    try { data = JSON.parse(body); }
    catch { return res.status(502).json({ error: "Invalid JSON", raw: body.slice(0, 300) }); }

    res.setHeader("Content-Type",  "application/json");
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
