import axios from "axios";

// Jikan API (MAL) — for metadata, search, trending
const JIKAN = "https://api.jikan.moe/v4";
// MangaDex — for chapters & page images (proxied through our serverless fn)
const MDX   = "https://api.mangadex.org";
// Proxy base — routes through /api/manga-proxy?url=<encoded>
const PROXY = "/api/manga-proxy?url=";

const jikan = (path) => axios.get(`${JIKAN}${path}`).then(r => r.data);
const mdx   = (path) => axios.get(`${PROXY}${encodeURIComponent(`${MDX}${path}`)}`).then(r => r.data);

const normManga = (m) => ({
  id:             String(m.mal_id),
  title:          m.title_english || m.title || "Unknown",
  japanese_title: m.title_japanese || m.title || "Unknown",
  image:          m.images?.webp?.large_image_url || m.images?.jpg?.large_image_url || "https://placehold.co/200x300/111/444?text=No+Cover",
  author:         m.authors?.map(a => a.name).join(", ") || "",
  status:         m.status || "",
  latestChapter:  m.chapters ? `${m.chapters} chapters` : "",
  tags:           m.genres?.map(g => g.name) || [],
  description:    m.synopsis || "",
  year:           m.published?.prop?.from?.year || "",
  score:          m.score || null,
  rank:           m.rank || null,
  popularity:     m.popularity || null,
});

// ── Search ────────────────────────────────────────────────────────────────────
export const searchManga = async (query, page = 1) => {
  const d = await jikan(`/manga?q=${encodeURIComponent(query)}&page=${page}&limit=20&order_by=relevance&sort=desc`);
  return (d?.data || []).map(normManga);
};

// ── Latest / Trending ─────────────────────────────────────────────────────────
export const getLatestManga = async (page = 1) => {
  const d = await jikan(`/manga?order_by=popularity&sort=asc&page=${page}&limit=24&sfw=true`);
  return (d?.data || []).map(normManga);
};

export const getLatestRelease = async () => {
  const d = await jikan(`/manga?order_by=start_date&sort=desc&page=1&limit=24&sfw=true&type=manga`);
  return (d?.data || []).map(normManga);
};

export const getTrending = async () => {
  const d = await jikan(`/top/manga?limit=24&filter=bypopularity`);
  return (d?.data || []).map(normManga);
};

// ── Manga detail + chapters via MangaDex ─────────────────────────────────────
// id is a MAL numeric id — we search MangaDex by title to get the MDX uuid
export const getChapterInfo = async (id) => {
  const numericId = parseInt(id, 10);
  if (!numericId || isNaN(numericId)) {
    return { manga: { id, title: "Unknown", japanese_title: "Unknown", image: "", author: "", status: "", rating: "", genres: [], summary: "", malUrl: "" }, chapters: [] };
  }

  // 1. Get manga metadata from Jikan
  const mangaRes = await jikan(`/manga/${numericId}/full`).catch(() => null);
  const m = mangaRes?.data;
  if (!m) return { manga: { id, title: "Not found", japanese_title: "", image: "", author: "", status: "", rating: "", genres: [], summary: "", malUrl: "" }, chapters: [] };

  const manga = {
    id:             String(m.mal_id),
    title:          m.title_english || m.title || "Unknown",
    japanese_title: m.title_japanese || m.title || "Unknown",
    image:          m.images?.webp?.large_image_url || m.images?.jpg?.large_image_url || "",
    author:         m.authors?.map(a => a.name).join(", ") || "",
    status:         m.status || "",
    rating:         m.rating || "",
    genres:         m.genres?.map(g => g.name) || [],
    summary:        m.synopsis || "",
    score:          m.score,
    malUrl:         m.url || `https://myanimelist.net/manga/${m.mal_id}`,
  };

  // 2. Search MangaDex for this title to get chapters
  const searchTitle = encodeURIComponent(m.title_english || m.title || "");
  let chapters = [];
  try {
    const mdxSearch = await mdx(`/manga?title=${searchTitle}&limit=5&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art`);
    const mdxManga = mdxSearch?.data?.[0];
    if (mdxManga) {
      const mdxId = mdxManga.id;
      // Fetch chapters (English, ordered desc)
      const chapRes = await mdx(`/manga/${mdxId}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=100&contentRating[]=safe&contentRating[]=suggestive`);
      chapters = (chapRes?.data || [])
        .filter(c => c.attributes?.chapter)
        .map(c => ({
          id:      c.id,
          chapter: c.attributes.chapter,
          title:   c.attributes.title || `Chapter ${c.attributes.chapter}`,
          pages:   c.attributes.pages || 0,
          date:    c.attributes.publishAt?.slice(0, 10) || "",
          mdxId:   c.id,
        }))
        // deduplicate by chapter number, keep first (most recent scanlation)
        .filter((c, i, arr) => arr.findIndex(x => x.chapter === c.chapter) === i);
    }
  } catch (e) {
    console.warn("MangaDex chapter fetch failed:", e.message);
  }

  return { manga, chapters };
};

// ── Chapter page images via MangaDex at-home ─────────────────────────────────
export const fetchChapter = async (mangaId, chapterId) => {
  // chapterId here is the MangaDex chapter UUID
  try {
    const atHome = await mdx(`/at-home/server/${chapterId}`);
    const { baseUrl, chapter: ch } = atHome;
    if (!baseUrl || !ch) return [];
    // Use data-saver (compressed) pages
    const pages = (ch.dataSaver || ch.data || []).map((filename, i) => {
      const quality = ch.dataSaver ? "data-saver" : "data";
      const hash    = ch.hash;
      const rawUrl  = `${baseUrl}/${quality}/${hash}/${filename}`;
      // Proxy the image URL through our serverless function
      return `${PROXY}${encodeURIComponent(rawUrl)}`;
    });
    return pages;
  } catch (e) {
    console.error("fetchChapter error:", e.message);
    return [];
  }
};
