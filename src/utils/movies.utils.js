import axios from "axios";

// FlixHQ API for streaming + movie data
const FHQBASE  = "https://jitsu-ten.vercel.app/api/flixhq";
const M3U8PROXY = import.meta.env.VITE_M3U8_PROXY_URL; // https://pro-xi-mocha.vercel.app/m3u8-proxy?url=

const fhq = (path) => axios.get(`${FHQBASE}${path}`).then(r => r.data);

// Proxy an HLS URL through the m3u8 proxy to bypass CORS
const proxyM3u8 = (url) => {
  if (!url) return url;
  if (!M3U8PROXY) return url;
  // Don't double-proxy
  if (url.startsWith(M3U8PROXY)) return url;
  return `${M3U8PROXY}${encodeURIComponent(url)}`;
};

// Normalize FlixHQ movie to our shape
// Detail response wraps data in { data: {...}, providerEpisodes: [...] }
// List responses have items directly
const normFHQ = (m) => ({
  id:        m.id,
  title:     m.name || m.title || "Unknown",
  poster:    m.posterImage || m.image || "https://placehold.co/200x300/111/333?text=No+Poster",
  backdrop:  m.cover || null,
  overview:  m.synopsis || m.description || "",
  rating:    m.rating ? String(m.rating) : "N/A",
  year:      String(m.releaseDate || m.year || ""),
  genres:    m.genre || m.genres || [],
  quality:   m.quality || "",
  duration:  m.duration || "",
  type:      m.type || "Movie",
  cast:      m.casts || m.cast || [],
  tags:      m.tags || [],
  production: m.production || "",
  country:   m.country || "",
});

// ── List endpoints ────────────────────────────────────────────────────────────
export const getPopular    = (page = 1) => fhq(`/movies/category/popular?page=${page}`).then(d => ({ results: (d.data || []).map(normFHQ), totalPages: d.lastPage || 1 }));
export const getTopRated   = (page = 1) => fhq(`/movies/category/top-rated?page=${page}`).then(d => ({ results: (d.data || []).map(normFHQ), totalPages: d.lastPage || 1 }));
export const getUpcoming   = (page = 1) => fhq(`/media/upcoming?page=${page}`).then(d => ({ results: (d.data || []).filter(m => m.type === "Movie").map(normFHQ), totalPages: d.lastPage || 1 }));
export const getTrending   = (page = 1) => fhq(`/home`).then(d => ({ results: [...(d.trendingMovies || []), ...(d.recentMovies || [])].slice(0, 24).map(normFHQ), totalPages: 1 }));
export const getNowPlaying = (page = 1) => fhq(`/movies/category/popular?page=${page}`).then(d => ({ results: (d.data || []).map(normFHQ), totalPages: d.lastPage || 1 }));

// ── Search ────────────────────────────────────────────────────────────────────
export const searchMovies = (query, page = 1) =>
  fhq(`/media/search?q=${encodeURIComponent(query)}&page=${page}`)
    .then(d => ({ results: (d.data || []).filter(m => m.type === "Movie").map(normFHQ), totalPages: d.lastPage || 1 }));

// ── Movie detail ──────────────────────────────────────────────────────────────
// API returns: { data: { id, name, synopsis, casts, genre, ... }, providerEpisodes: [...] }
export const getMovieDetail = async (id) => {
  const res = await fhq(`/media/${id}`);
  // Detail wraps in res.data; list items are direct
  const m = res.data || res;
  return {
    ...normFHQ(m),
    providerEpisodes: res.providerEpisodes || [],
    // Use episodeId from providerEpisodes for streaming (not .id — use .episodeId)
    episodeId: res.providerEpisodes?.[0]?.episodeId || res.providerEpisodes?.[0]?.id || id,
  };
};

// ── Streaming ─────────────────────────────────────────────────────────────────
export const getMovieSources = async (episodeId, server = "vidcloud") => {
  const d = await fhq(`/sources/${encodeURIComponent(episodeId)}?server=${server}`);
  const rawSources = d.data?.sources || d.sources || [];
  // Proxy every HLS source URL to bypass CORS
  const sources = rawSources.map(s => ({
    ...s,
    url: proxyM3u8(s.url),
  }));
  return {
    sources,
    subtitles: d.data?.subtitles || d.subtitles || [],
    headers:   d.headers || {},
  };
};

// ── Servers for an episode ────────────────────────────────────────────────────
export const getMovieServers = (episodeId) =>
  fhq(`/media/${encodeURIComponent(episodeId)}/servers`).then(d => d.data || d || []);
