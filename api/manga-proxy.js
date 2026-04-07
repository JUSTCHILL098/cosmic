// Vercel serverless function — proxies MangaDex API to bypass CORS
export default async function handler(req, res) {
  // Extract the path after /api/manga-proxy
  const path = req.url.replace(/^\/api\/manga-proxy/, "") || "/";

  const url = `https://api.mangadex.org${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CosmicAnime/1.0",
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
