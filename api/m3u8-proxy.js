// Vercel serverless function — proxies HLS m3u8 playlists and segments
// Rewrites segment URLs so they also route through this proxy
// Usage: /api/m3u8-proxy?url=<encoded_url>

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing url param" });

  let decoded;
  try {
    decoded = decodeURIComponent(targetUrl);
  } catch {
    decoded = targetUrl;
  }

  try {
    const response = await fetch(decoded, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer":    "https://streameeeeee.site/",
        "Origin":     "https://streameeeeee.site",
        "Accept":     "*/*",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream returned ${response.status}` });
    }

    const contentType = response.headers.get("content-type") || "";

    // ── HLS playlist (.m3u8) — rewrite URLs ──────────────────────────────────
    if (
      decoded.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("x-mpegurl")
    ) {
      const text = await response.text();
      const base = decoded.substring(0, decoded.lastIndexOf("/") + 1);
      const proxyBase = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/api/m3u8-proxy?url=`;

      // Rewrite every URI line (segment .ts, key .key, sub-playlist .m3u8)
      const rewritten = text.split("\n").map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          // Rewrite URI= inside tags like #EXT-X-KEY:METHOD=AES-128,URI="..."
          return line.replace(/URI="([^"]+)"/g, (_, uri) => {
            const abs = uri.startsWith("http") ? uri : base + uri;
            return `URI="${proxyBase}${encodeURIComponent(abs)}"`;
          });
        }
        // Segment / sub-playlist line
        const abs = trimmed.startsWith("http") ? trimmed : base + trimmed;
        return `${proxyBase}${encodeURIComponent(abs)}`;
      }).join("\n");

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).send(rewritten);
    }

    // ── TS segment or key — stream binary ────────────────────────────────────
    const buffer = await response.arrayBuffer();
    const ct = contentType || (decoded.endsWith(".ts") ? "video/mp2t" : "application/octet-stream");
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
