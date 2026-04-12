// Vercel serverless — proxies Videasy API to bypass CORS
// Calls api.videasy.net with the correct Referer (cineby.sc) and returns decrypted HLS sources
// Usage: /api/videasy?tmdbId=157336&mediaType=movie&title=Interstellar&year=2014

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tmdbId, mediaType, title, year, seasonId = "1", episodeId = "1", imdbId = "", provider = "myflixerzupcloud" } = req.query;
  if (!tmdbId || !mediaType || !title) return res.status(400).json({ error: "Missing required params: tmdbId, mediaType, title" });

  const params = new URLSearchParams({ title, mediaType, year: year || "", episodeId, seasonId, tmdbId, imdbId });
  const url = `https://api.videasy.net/${provider}/sources-with-title?${params}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Referer":    "https://cineby.sc/",
        "Origin":     "https://cineby.sc",
        "Accept":     "*/*",
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Videasy returned ${upstream.status}` });
    }

    const data = await upstream.json();
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
