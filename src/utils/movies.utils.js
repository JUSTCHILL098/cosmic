import axios from "axios";

const FHQBASE  = "https://jitsu-ten.vercel.app/api/flixhq";
const M3U8PROXY = import.meta.env.VITE_M3U8_PROXY_URL; // existing proxy

const fhq = (path) => axios.get(`${FHQBASE}${path}`).then(r => r.data);

const normFHQ = (m) => ({
  id:       m.id,
  title:    m.name || m.title || "Unknown",
  poster:   m.posterImage || m.image || "https://placehold.co/200x300/111/333?text=No+Poster",
  backdrop: m.cover || null,
  overview: m.synopsis || m.description || "",
  rating:   m.score ? String(m.score) : (m.rating || "N/A"),
  year:     String(m.releaseDate || m.year || "").slice(0, 4),
  genres:   m.genre || m.genres || [],
  quality:  m.quality || "",
  duration: m.duration || "",
  type:     m.type || "Movie",
  cast:     m.casts || m.cast || [],
  country:  Array.isArray(m.country) ? m.country.join(", ") : (m.country || ""),
  production: Array.isArray(m.production) ? m.production.filter(p => p !== "N/A").join(", ") : (m.production || ""),
});

export const getPopular    = (p = 1) => fhq(`/movies/category/popular?page=${p}`).then(d => ({ results: (d.data||[]).map(normFHQ), totalPages: d.lastPage||1 }));
export const getTopRated   = (p = 1) => fhq(`/movies/category/top-rated?page=${p}`).then(d => ({ results: (d.data||[]).map(normFHQ), totalPages: d.lastPage||1 }));
export const getUpcoming   = (p = 1) => fhq(`/media/upcoming?page=${p}`).then(d => ({ results: (d.data||[]).filter(m=>m.type==="Movie").map(normFHQ), totalPages: d.lastPage||1 }));
export const getNowPlaying = (p = 1) => fhq(`/movies/category/popular?page=${p}`).then(d => ({ results: (d.data||[]).map(normFHQ), totalPages: d.lastPage||1 }));
export const getTrending   = ()      => fhq(`/home`).then(d => ({ results: [...(d.trendingMovies||[]),...(d.recentMovies||[])].slice(0,24).map(normFHQ), totalPages:1 }));
export const searchMovies  = (q,p=1) => fhq(`/media/search?q=${encodeURIComponent(q)}&page=${p}`).then(d => ({ results: (d.data||[]).filter(m=>m.type==="Movie").map(normFHQ), totalPages: d.lastPage||1 }));

export const getMovieDetail = async (id) => {
  const res = await fhq(`/media/${id}`);
  // FlixHQ wraps detail in res.data
  const m = res.data || res;
  const norm = normFHQ(m);
  return {
    ...norm,
    providerEpisodes: res.providerEpisodes || [],
    episodeId: res.providerEpisodes?.[0]?.episodeId || id,
    recommended: (res.recommended || []).map(normFHQ),
  };
};

export const getMovieSources = async (episodeId, server = "vidcloud") => {
  const res = await fhq(`/sources/${encodeURIComponent(episodeId)}?server=${server}`);
  const sources   = res.data?.sources   || res.sources   || [];
  const subtitles = res.data?.subtitles || res.subtitles || [];

  // Proxy the HLS URL through the existing M3U8 proxy to bypass CORS
  const proxied = sources.map(s => {
    if ((s.isM3u8 || s.type === "hls") && s.url && M3U8PROXY) {
      return { ...s, url: `${M3U8PROXY}${encodeURIComponent(s.url)}` };
    }
    return s;
  });

  // Map to Player's expected format: { file, label, kind, default }
  const mappedSubs = subtitles.map(s => ({
    file:    s.url  || s.file || "",
    label:   s.lang || s.label || "English",
    kind:    "subtitles",
    default: !!s.default,
  })).filter(s => s.file);

  return {
    sources:   proxied,
    subtitles: mappedSubs,
    headers:   res.headers || {},
  };
};
