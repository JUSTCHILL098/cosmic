import axios from "axios";

const BASE   = "https://api.mangadex.org";
const COVERS = "https://uploads.mangadex.org/covers";

export const getCoverUrl = (manga, size = ".512.jpg") => {
  const rel  = manga?.relationships?.find(r => r.type === "cover_art");
  const file = rel?.attributes?.fileName;
  if (!file) return "https://placehold.co/200x300/111/444?text=No+Cover";
  return `${COVERS}/${manga.id}/${file}${size}`;
};

// Extract both EN and JP titles
const getTitle = (attrs) => {
  const en = attrs?.title?.en || Object.values(attrs?.title || {})[0] || "Unknown";
  // Japanese title: look in altTitles for ja or ja-ro
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
    id:            m.id,
    title:         en,
    japanese_title: jp,
    image:         getCoverUrl(m),
    author:        m.relationships?.find(r => r.type === "author")?.attributes?.name || "",
    status:        m.attributes?.status || "",
    latestChapter: m.attributes?.lastChapter ? `Ch. ${m.attributes.lastChapter}` : "",
    tags:          m.attributes?.tags?.map(t => t.attributes?.name?.en).filter(Boolean) || [],
    description:   m.attributes?.description?.en || "",
    year:          m.attributes?.year || "",
  };
};

// Search — use title + fuzzy for accuracy
export const searchManga = async (query, page = 1) => {
  const offset = (page - 1) * 20;
  const { data } = await axios.get(`${BASE}/manga`, {
    params: {
      title: query,
      limit: 20, offset,
      includes: ["cover_art","author"],
      "order[relevance]": "desc",
      availableTranslatedLanguage: ["en"],
    },
  });
  return (data?.data || []).map(normManga);
};

// Latest manga — fetch 48 for a full page
export const getLatestManga = async (page = 1) => {
  const offset = (page - 1) * 48;
  const { data } = await axios.get(`${BASE}/manga`, {
    params: {
      limit: 48, offset,
      includes: ["cover_art","author"],
      "order[updatedAt]": "desc",
      availableTranslatedLanguage: ["en"],
      hasAvailableChapters: true,
    },
  });
  return (data?.data || []).map(normManga);
};

// Latest releases — fetch chapters then resolve manga covers in one batch request
export const getLatestRelease = async () => {
  // Step 1: get recent chapters
  const chapRes = await axios.get(`${BASE}/chapter`, {
    params: {
      limit: 32,
      translatedLanguage: ["en"],
      includes: ["manga"],
      "order[publishAt]": "desc",
    },
  });

  // Step 2: collect unique manga IDs from chapter relationships
  const seen = new Set();
  const mangaIds = [];
  for (const ch of (chapRes.data?.data || [])) {
    const rel = ch.relationships?.find(r => r.type === "manga");
    if (rel?.id && !seen.has(rel.id)) {
      seen.add(rel.id);
      mangaIds.push(rel.id);
    }
  }
  if (!mangaIds.length) return [];

  // Step 3: batch-fetch manga with covers
  const mangaRes = await axios.get(`${BASE}/manga`, {
    params: {
      ids: mangaIds,
      limit: mangaIds.length,
      includes: ["cover_art","author"],
    },
  });

  // Preserve the chapter-order
  const mangaMap = {};
  for (const m of (mangaRes.data?.data || [])) {
    mangaMap[m.id] = normManga(m);
  }
  return mangaIds.map(id => mangaMap[id]).filter(Boolean);
};

// Manga detail + chapter list
export const getChapterInfo = async (id) => {
  const [mangaRes, chaptersRes] = await Promise.all([
    axios.get(`${BASE}/manga/${id}`, { params: { includes: ["cover_art","author","artist"] } }),
    axios.get(`${BASE}/manga/${id}/feed`, {
      params: {
        limit: 500,
        translatedLanguage: ["en"],
        "order[chapter]": "asc",
        includes: ["scanlation_group"],
      },
    }),
  ]);

  const m = mangaRes.data?.data;
  const { en, jp } = getTitle(m.attributes);
  const chapters = (chaptersRes.data?.data || []).map(ch => ({
    id:        ch.id,
    chapterID: ch.id,
    title:     ch.attributes?.chapter
      ? `Chapter ${ch.attributes.chapter}${ch.attributes.title ? ` — ${ch.attributes.title}` : ""}`
      : ch.attributes?.title || "Oneshot",
    date:      ch.attributes?.publishAt
      ? new Date(ch.attributes.publishAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
      : "",
    pages: ch.attributes?.pages || 0,
  }));

  return {
    manga: {
      id:             m.id,
      title:          en,
      japanese_title: jp,
      image:          getCoverUrl(m, ".512.jpg"),
      author:         m.relationships?.find(r => r.type === "author")?.attributes?.name || "",
      status:         m.attributes?.status || "",
      rating:         m.attributes?.contentRating || "",
      genres:         m.attributes?.tags?.map(t => t.attributes?.name?.en).filter(Boolean) || [],
      summary:        m.attributes?.description?.en || "",
    },
    chapters,
  };
};

// Chapter images via MangaDex @ Home
export const fetchChapter = async (_mangaId, chapterID) => {
  const { data } = await axios.get(`${BASE}/at-home/server/${chapterID}`);
  const base  = data?.baseUrl;
  const hash  = data?.chapter?.hash;
  const pages = data?.chapter?.data || [];
  return pages.map(p => `${base}/data/${hash}/${p}`);
};
