// Vercel serverless — proxies HLS streams for raffaellocdn and similar CDNs
// Sends correct Referer/Origin headers server-side to bypass CDN checks
// Usage: /api/m3u8-proxy?url=<encoded_url>&referer=<encoded_referer>

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing url param" });

  let decoded;
  try { decoded = decodeURIComponent(targetUrl); }
  catch { decoded = targetUrl; }

  // Allow custom referer via query param, default to streameeeeee.site
  const referer = req.query.referer
    ? decodeURIComponent(req.query.referer)
    : "https://streameeeeee.site/";

  const origin = new URL(referer).origin;

  try {
    const response = await fetch(decoded, {
      method: "GET",
      headers: {
        "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer":         referer,
        "Origin":          origin,
        "Accept":          "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest":  "empty",
        "Sec-Fetch-Mode":  "cors",
        "Sec-Fetch-Site":  "cross-site",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream ${response.status}: ${response.statusText}` });
    }

    const contentType = response.headers.get("content-type") || "";
    const isPlaylist  = decoded.includes(".m3u8") || contentType.includes("mpegurl");

    if (isPlaylist) {
      const text = await response.text();
      const base = decoded.substring(0, decoded.lastIndexOf("/") + 1);

      // Build proxy base — same endpoint, preserve referer param
      const proto    = req.headers["x-forwarded-proto"] || "https";
      const host     = req.headers.host;
      const refParam = `&referer=${encodeURIComponent(referer)}`;
      const proxyBase = `${proto}://${host}/api/m3u8-proxy?url=`;

      const rewritten = text.split("\n").map(line => {
        const t = line.trim();
        if (!t || t.startsWith("#")) {
          // Rewrite URI= inside tags (e.g. EXT-X-KEY)
          return line.replace(/URI="([^"]+)"/g, (_, uri) => {
            const abs = uri.startsWith("http") ? uri : base + uri;
            return `URI="${proxyBase}${encodeURIComponent(abs)}${refParam}"`;
          });
        }
        const abs = t.startsWith("http") ? t : base + t;
        return `${proxyBase}${encodeURIComponent(abs)}${refParam}`;
      }).join("\n");

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Cache-Control", "no-cache, no-store");
      return res.status(200).send(rewritten);
    }

    // Binary (ts segment, key, etc.)
    const buffer = await response.arrayBuffer();
    const ct = contentType || (decoded.endsWith(".ts") ? "video/mp2t" : "application/octet-stream");
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
