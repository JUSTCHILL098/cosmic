// Vercel serverless — proxies Videasy API using Node https.request
// fetch() on Vercel strips Referer; https.request does not
import https from "https";
import { URL } from "url";

export const config = { maxDuration: 30 };

function nodeGet(urlStr, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const opts = {
      hostname: u.hostname,
      port:     u.port || 443,
      path:     u.pathname + u.search,
      method:   "GET",
      headers,
      timeout:  20000,
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

  const { tmdbId, mediaType, title, year, seasonId = "1", episodeId = "1", imdbId = "", provider = "myflixerzupcloud" } = req.query;
  if (!tmdbId || !mediaType || !title)
    return res.status(400).json({ error: "Missing required params: tmdbId, mediaType, title" });

  const params = new URLSearchParams({ title, mediaType, year: year || "", episodeId, seasonId, tmdbId, imdbId });
  const targetUrl = `https://api.videasy.net/${provider}/sources-with-title?${params}`;

  try {
    const upstream = await nodeGet(targetUrl, {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      "Referer":    "https://cineby.sc/",
      "Origin":     "https://cineby.sc",
      "Accept":     "application/json, */*",
    });

    if (upstream.statusCode >= 400) {
      return res.status(upstream.statusCode).json({ error: `Videasy returned ${upstream.statusCode}` });
    }

    const chunks = [];
    for await (const chunk of upstream) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString("utf8");

    let data;
    try { data = JSON.parse(body); }
    catch { return res.status(502).json({ error: "Invalid JSON from Videasy", raw: body.slice(0, 200) }); }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
