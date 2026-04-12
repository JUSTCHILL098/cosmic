// Vercel serverless — fetches decrypted HLS sources from Videasy decryptor
// The decryptor handles WASM decryption server-side and returns clean m3u8 URLs
// Public instance: https://videasy-decryptor.vercel.app (walterwhite-69/Videasy.net-Decryptor)

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
      },
      timeout: 25000,
    };
    const req = https.request(opts, resolve);
    req.on("error",   reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.end();
  });
}

async function tryInstance(baseUrl, params) {
  const url = `${baseUrl}/sources?${params}`;
  const upstream = await nodeGet(url);
  if (upstream.statusCode >= 400) throw new Error(`${upstream.statusCode}`);
  const chunks = [];
  for await (const chunk of upstream) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tmdbId, mediaType = "movie", title = "", year = "", seasonId = "1", episodeId = "1" } = req.query;
  if (!tmdbId) return res.status(400).json({ error: "Missing tmdbId" });

  const params = new URLSearchParams({ tmdbId, mediaType, seasonId, episodeId });
  if (title) params.set("title", title);
  if (year)  params.set("year",  year);

  // Try multiple known public instances of the decryptor
  const instances = [
    "https://videasy-decryptor.vercel.app",
    "https://videasy-api.vercel.app",
    "https://videasy.vercel.app",
  ];

  let lastErr = null;
  for (const base of instances) {
    try {
      const data = await tryInstance(base, params.toString());
      res.setHeader("Content-Type",  "application/json");
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).json(data);
    } catch (e) {
      lastErr = e;
    }
  }

  return res.status(502).json({ error: `All instances failed: ${lastErr?.message}` });
}
