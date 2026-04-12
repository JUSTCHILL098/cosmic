// Vercel serverless function — proxies MangaDex API to bypass CORS
// Called via: /api/manga-proxy?url=<encoded_mangadex_url>
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing url param" });

  // Allow mangadex.org and uploads.mangadex.network
  const allowed = [
    "https://api.mangadex.org",
    "https://uploads.mangadex.network",
    "https://cmdxd98sb0x3yprd.mangadex.network",
  ];
  const isAllowed = allowed.some(a => targetUrl.startsWith(a));
  if (!isAllowed) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "CosmicAnime/1.0",
        "Accept": "application/json",
        "Referer": "https://mangadex.org",
      },
    });

    const contentType = response.headers.get("content-type") || "application/json";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");

    if (contentType.includes("image")) {
      const buffer = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(buffer));
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
