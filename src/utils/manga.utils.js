import axios from "axios";

// Jikan API (MyAnimeList) — free, CORS-enabled, works from Vercel
const BASE = "https://api.jikan.moe/v4";

const get = (path) => axios.get(`${BASE}${path}`).then(r => r.data);

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

// Search manga
export const searchManga = async (query, page = 1) => {
  const d = await get(`/manga?q=${encodeURIComponent(query)}&page=${page}&limit=20&order_by=relevance&sort=desc`);
  return (d?.data || []).map(normManga);
};

// Latest manga (by popularity — Jikan doesn't have "latest updated" without auth)
export const getLatestManga = async (page = 1) => {
  const d = await get(`/manga?order_by=popularity&sort=asc&page=${page}&limit=24&sfw=true`);
  return (d?.data || []).map(normManga);
};

// New releases — recently published
export const getLatestRelease = async () => {
  const d = await get(`/manga?order_by=start_date&sort=desc&page=1&limit=24&sfw=true&type=manga`);
  return (d?.data || []).map(normManga);
};

// Manga detail + chapters
export const getChapterInfo = async (id) => {
  // Jikan uses numeric MAL IDs — if we get a UUID (from old MangaDex data), reject gracefully
  const numericId = parseInt(id, 10);
  if (!numericId || isNaN(numericId)) {
    return { manga: { id, title: "Unknown", japanese_title: "Unknown", image: "", author: "", status: "", rating: "", genres: [], summary: "" }, chapters: [] };
  }

  const [mangaRes, chaptersRes] = await Promise.all([
    get(`/manga/${numericId}/full`),
    get(`/manga/${numericId}/chapters?page=1`).catch(() => ({ data: [] })),
  ]);
  const m = mangaRes?.data;
  if (!m) return { manga: { id, title: "Not found", japanese_title: "", image: "", author: "", status: "", rating: "", genres: [], summary: "" }, chapters: [] };

  const chapters = (chaptersRes?.data || []).map(ch => ({
    id:        String(ch.mal_id),
    chapterID: String(ch.mal_id),
    title:     ch.title ? `Chapter ${ch.chapter} — ${ch.title}` : `Chapter ${ch.chapter || "?"}`,
    date:      ch.aired || "",
    pages:     0,
  }));
  return {
    manga: {
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
    },
    chapters,
  };
};

// Chapter images — Jikan doesn't provide chapter images
// Redirect user to read on MangaDex or similar
export const fetchChapter = async (mangaId, chapterID) => {
  // Return empty — reading not supported via Jikan
  // The reader will show a "read online" link instead
  return [];
};

// Trending — top scored manga
export const getTrending = async () => {
  const d = await get(`/top/manga?limit=24&filter=bypopularity`);
  return (d?.data || []).map(normManga);
};
