import axios from "axios";

const KEY  = import.meta.env.VITE_TMDB_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p";

export const poster   = (path, size = "w500")    => path ? `${IMG}/${size}${path}` : "https://placehold.co/200x300/111/333?text=No+Poster";
export const backdrop = (path, size = "w1280")   => path ? `${IMG}/${size}${path}` : null;

const get = (url, params = {}) =>
  axios.get(`${BASE}${url}`, { params: { api_key: KEY, language: "en-US", ...params } }).then(r => r.data);

const normMovie = (m) => ({
  id:           m.id,
  title:        m.title || m.name || "Unknown",
  original:     m.original_title || m.original_name || "",
  poster:       poster(m.poster_path),
  backdrop:     backdrop(m.backdrop_path),
  overview:     m.overview || "",
  rating:       m.vote_average?.toFixed(1) || "N/A",
  year:         (m.release_date || m.first_air_date || "").slice(0, 4),
  genres:       m.genre_ids || [],
  mediaType:    m.media_type || "movie",
  popularity:   m.popularity || 0,
});

// Trending (week) — mix of movies + TV
export const getTrending    = (page = 1) => get("/trending/movie/week",    { page }).then(r => ({ results: r.results.map(normMovie), totalPages: r.total_pages }));
export const getPopular     = (page = 1) => get("/movie/popular",          { page }).then(r => ({ results: r.results.map(normMovie), totalPages: r.total_pages }));
export const getNowPlaying  = (page = 1) => get("/movie/now_playing",      { page }).then(r => ({ results: r.results.map(normMovie), totalPages: r.total_pages }));
export const getTopRated    = (page = 1) => get("/movie/top_rated",        { page }).then(r => ({ results: r.results.map(normMovie), totalPages: r.total_pages }));
export const getUpcoming    = (page = 1) => get("/movie/upcoming",         { page }).then(r => ({ results: r.results.map(normMovie), totalPages: r.total_pages }));
export const searchMovies   = (query, page = 1) => get("/search/movie",    { query, page }).then(r => ({ results: r.results.map(normMovie), totalPages: r.total_pages }));
export const getMovieDetail = (id)       => get(`/movie/${id}`,            { append_to_response: "credits,videos,similar" });
export const getGenres      = ()         => get("/genre/movie/list").then(r => r.genres || []);
