import axios from "axios";

// TMDB — metadata, search, trending
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB     = "https://api.themoviedb.org/3";
const IMG      = "https://image.tmdb.org/t/p/w500";
const IMG_ORIG = "https://image.tmdb.org/t/p/original";

const tmdb = (path, params = {}) =>
  axios.get(`${TMDB}${path}`, { params: { api_key: TMDB_KEY, ...params } }).then(r => r.data);

const normTMDB = (m) => ({
  id:       String(m.id),
  title:    m.title || m.name || "Unknown",
  poster:   m.poster_path   ? `${IMG}${m.poster_path}`        : "https://placehold.co/200x300/111/333?text=No+Poster",
  backdrop: m.backdrop_path ? `${IMG_ORIG}${m.backdrop_path}` : null,
  overview: m.overview || "",
  rating:   m.vote_average  ? m.vote_average.toFixed(1)       : "N/A",
  year:     (m.release_date || m.first_air_date || "").slice(0, 4),
  genres:   (m.genres || []).map(g => g.name),
  type:     "Movie",
});

export const getPopular    = (p = 1) => tmdb("/movie/popular",     { page: p }).then(d => ({ results: d.results.map(normTMDB), totalPages: d.total_pages }));
export const getTopRated   = (p = 1) => tmdb("/movie/top_rated",   { page: p }).then(d => ({ results: d.results.map(normTMDB), totalPages: d.total_pages }));
export const getUpcoming   = (p = 1) => tmdb("/movie/upcoming",    { page: p }).then(d => ({ results: d.results.map(normTMDB), totalPages: d.total_pages }));
export const getNowPlaying = (p = 1) => tmdb("/movie/now_playing", { page: p }).then(d => ({ results: d.results.map(normTMDB), totalPages: d.total_pages }));
export const getTrending   = ()      => tmdb("/trending/movie/week").then(d => ({ results: d.results.map(normTMDB), totalPages: 1 }));
export const searchMovies  = (q, p = 1) => tmdb("/search/movie", { query: q, page: p }).then(d => ({ results: d.results.map(normTMDB), totalPages: d.total_pages }));

export const getMovieDetail = async (id) => {
  const [detail, credits, recs] = await Promise.all([
    tmdb(`/movie/${id}`),
    tmdb(`/movie/${id}/credits`),
    tmdb(`/movie/${id}/recommendations`),
  ]);
  return {
    ...normTMDB(detail),
    genres:      (detail.genres || []).map(g => g.name),
    runtime:     detail.runtime ? `${detail.runtime} min` : "",
    status:      detail.status || "",
    cast:        (credits.cast || []).slice(0, 8).map(c => c.name),
    recommended: (recs.results || []).slice(0, 14).map(normTMDB),
  };
};

// Videasy — decrypted HLS sources via our serverless proxy
// Returns { sources: [{url, quality}], subtitles: [] }
export const getMovieSources = async (tmdbId, title, year) => {
  const params = new URLSearchParams({
    tmdbId,
    mediaType: "movie",
    title:     title || "",
    year:      year  || "",
  });
  const res = await axios.get(`/api/videasy?${params}`).then(r => r.data);

  // Videasy response shape: { url, subtitles, headers } or { sources: [...] }
  // Normalise to { sources: [{url, isM3u8}], subtitles: [{file, label, default}] }
  const rawSources   = res.sources   || (res.url ? [{ url: res.url, isM3u8: true }] : []);
  const rawSubtitles = res.subtitles || res.tracks || [];

  return {
    sources: rawSources.map(s => ({
      url:    s.url || s.file || "",
      isM3u8: true,
      quality: s.quality || s.label || "Auto",
    })).filter(s => s.url),
    subtitles: rawSubtitles
      .filter(s => s.kind !== "thumbnails")
      .map(s => ({
        file:    s.file || s.url || "",
        label:   s.label || s.lang || "English",
        kind:    "subtitles",
        default: !!s.default,
      })).filter(s => s.file),
  };
};
