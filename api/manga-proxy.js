// Vercel serverless function — proxies MangaDex API to bypass CORS
// Called via: /api/manga-proxy?url=<encoded_mangadex_url>
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.status(200).end();
  }

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing url param" });

  // Only allow mangadex.org
  if (!targetUrl.startsWith("https://api.mangadex.org")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "CosmicAnime/1.0", "Accept": "application/json" },
    });
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
