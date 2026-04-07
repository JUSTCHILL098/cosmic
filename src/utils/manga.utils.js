import axios from "axios";

// MangaDex: use /manga-api proxy (Vite dev proxy + Vercel serverless in prod)
const get = async (path) => {
  const { data } = await axios.get(`/manga-api${path}`);
  return data;
};

export const getCoverUrl = (manga, size = ".512.jpg") => {
  const rel  = manga?.relationships?.find(r => r.type === "cover_art");
  const file = rel?.attributes?.fileName;
  if (!file) return "https://placehold.co/200x300/111/444?text=No+Cover";
  return `${COVERS}/${manga.id}/${file}${size}`;
};

const getTitle = (attrs) => {
  const en = attrs?.title?.en || Object.values(attrs?.title || {})[0] || "Unknown";
  let jp = "";
  for (const alt of (attrs?.altTitles || [])) {
    if (alt.ja) { jp = alt.ja; break; }
    if (alt["ja-ro"]) { jp = alt["ja-ro"]; break; }
  }
  return { en, jp: jp || en };
};

const normManga = (m) => {
  const { en, jp } = getTitle(m.attributes);
  return {
    id:             m.id,
    title:          en,
    japanese_title: jp,
    image:          getCoverUrl(m),
    author:         m.relationships?.find(r => r.type === "author")?.attributes?.name || "",
    status:         m.attributes?.status || "",
    latestChapter:  m.attributes?.lastChapter ? `Ch. ${m.attributes.lastChapter}` : "",
    tags:           m.attributes?.tags?.map(t => t.attributes?.name?.en).filter(Boolean) || [],
    description:    m.attributes?.description?.en || "",
    year:           m.attributes?.year || "",
  };
};

const qs = (params) => {
  const parts = [];
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach(i => parts.push(`${encodeURIComponent(k)}[]=${encodeURIComponent(i)}`));
    else parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  return parts.length ? "?" + parts.join("&") : "";
};

export const searchManga = async (query, page = 1) => {
  const offset = (page - 1) * 20;
  const d = await get(`/manga${qs({ title: query, limit: 20, offset, includes: ["cover_art","author"], "order[relevance]": "desc", availableTranslatedLanguage: ["en"] })}`);
  return (d?.data || []).map(normManga);
};

export const getLatestManga = async (page = 1) => {
  const offset = (page - 1) * 48;
  const d = await get(`/manga${qs({ limit: 48, offset, includes: ["cover_art","author"], "order[updatedAt]": "desc", availableTranslatedLanguage: ["en"], hasAvailableChapters: true })}`);
  return (d?.data || []).map(normManga);
};

export const getLatestRelease = async () => {
  const chapRes = await get(`/chapter${qs({ limit: 32, translatedLanguage: ["en"], includes: ["manga"], "order[publishAt]": "desc" })}`);
  const seen = new Set();
  const mangaIds = [];
  for (const ch of (chapRes?.data || [])) {
    const rel = ch.relationships?.find(r => r.type === "manga");
    if (rel?.id && !seen.has(rel.id)) { seen.add(rel.id); mangaIds.push(rel.id); }
  }
  if (!mangaIds.length) return [];
  const mangaRes = await get(`/manga${qs({ ids: mangaIds, limit: mangaIds.length, includes: ["cover_art","author"] })}`);
  const map = {};
  for (const m of (mangaRes?.data || [])) map[m.id] = normManga(m);
  return mangaIds.map(id => map[id]).filter(Boolean);
};

export const getChapterInfo = async (id) => {
  const [mangaRes, chaptersRes] = await Promise.all([
    get(`/manga/${id}${qs({ includes: ["cover_art","author","artist"] })}`),
    get(`/manga/${id}/feed${qs({ limit: 500, translatedLanguage: ["en"], "order[chapter]": "asc", includes: ["scanlation_group"] })}`),
  ]);
  const m = mangaRes?.data;
  const { en, jp } = getTitle(m.attributes);
  const chapters = (chaptersRes?.data || []).map(ch => ({
    id: ch.id, chapterID: ch.id,
    title: ch.attributes?.chapter
      ? `Chapter ${ch.attributes.chapter}${ch.attributes.title ? ` — ${ch.attributes.title}` : ""}`
      : ch.attributes?.title || "Oneshot",
    date: ch.attributes?.publishAt
      ? new Date(ch.attributes.publishAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
      : "",
    pages: ch.attributes?.pages || 0,
  }));
  return {
    manga: {
      id: m.id, title: en, japanese_title: jp,
      image: getCoverUrl(m, ".512.jpg"),
      author: m.relationships?.find(r => r.type === "author")?.attributes?.name || "",
      status: m.attributes?.status || "",
      rating: m.attributes?.contentRating || "",
      genres: m.attributes?.tags?.map(t => t.attributes?.name?.en).filter(Boolean) || [],
      summary: m.attributes?.description?.en || "",
    },
    chapters,
  };
};

export const fetchChapter = async (_mangaId, chapterID) => {
  const d = await get(`/at-home/server/${chapterID}`);
  const base = d?.baseUrl, hash = d?.chapter?.hash, pages = d?.chapter?.data || [];
  return pages.map(p => `${base}/data/${hash}/${p}`);
};
