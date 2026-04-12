import axios from "axios";

// FlixHQ API for streaming + movie data
const FHQBASE = "https://jitsu-ten.vercel.app/api/flixhq";
// TMDB for posters/backdrops (FlixHQ doesn't always have them)
const TMDB    = "https://api.themoviedb.org/3";
const TMDBKEY = import.meta.env.VITE_TMDB_KEY;
const IMG     = "https://image.tmdb.org/t/p";

export const poster   = (path, size = "w500")  => path ? `${IMG}/${size}${path}` : null;
export const backdrop = (path, size = "w1280") => path ? `${IMG}/${size}${path}` : null;

const fhq  = (path) => axios.get(`${FHQBASE}${path}`).then(r => r.data);
const tmdb = (path, params = {}) =>
  axios.get(`${TMDB}${path}`, { params: { api_key: TMDBKEY, language: "en-US", ...params } }).then(r => r.data);

// Normalize FlixHQ movie to our shape
const normFHQ = (m) => ({
  id:        m.id,
  title:     m.name || m.title || "Unknown",
  poster:    m.posterImage || m.image || "https://placehold.co/200x300/111/333?text=No+Poster",
  backdrop:  m.cover || null,
  overview:  m.description || "",
  rating:    m.rating ? String(m.rating) : "N/A",
  year:      String(m.releaseDate || m.year || ""),
  genres:    m.genres || [],
  quality:   m.quality || "",
  duration:  m.duration || "",
  type:      m.type || "Movie",
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
export const getMovieDetail = async (id) => {
  const d = await fhq(`/media/${id}`);
  return {
    ...normFHQ(d),
    // Extra fields from FlixHQ detail
    cast:        d.cast || [],
    tags:        d.tags || [],
    production:  d.production || "",
    country:     d.country || "",
    // providerEpisodes contains the episode/movie IDs for streaming
    providerEpisodes: d.providerEpisodes || [],
    episodeId:   d.providerEpisodes?.[0]?.id || id, // for movies, use first episode or the id itself
  };
};

// ── Streaming ─────────────────────────────────────────────────────────────────
export const getMovieSources = async (episodeId, server = "vidcloud") => {
  const d = await fhq(`/sources/${encodeURIComponent(episodeId)}?server=${server}`);
  return {
    sources:   d.data?.sources || d.sources || [],
    subtitles: d.data?.subtitles || d.subtitles || [],
    headers:   d.headers || {},
  };
};

// ── Servers for an episode ────────────────────────────────────────────────────
export const getMovieServers = (episodeId) =>
  fhq(`/media/${encodeURIComponent(episodeId)}/servers`).then(d => d.data || d || []);
