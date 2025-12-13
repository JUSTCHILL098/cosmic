import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;

  if (!api_url) {
    console.error("VITE_API_URL is missing");
    return null;
  }

  const now = Date.now();

  // 🔹 Cache
  const cachedRaw = localStorage.getItem(CACHE_KEY);
  if (cachedRaw) {
    const cached = JSON.parse(cachedRaw);
    if (
      cached?.timestamp &&
      cached?.data &&
      now - cached.timestamp < CACHE_DURATION
    ) {
      return cached.data;
    }
  }

  // 🔹 Fetch
  const response = await axios.get(api_url);
  const raw = response?.data;

  if (!raw?.results) {
    console.error("Invalid API response", raw);
    return null;
  }

  const r = raw.results;

  // ✅ FIXED DATA SHAPE
  const data = {
    spotlights: r.spotlights ?? [],
    trending: r.trending ?? [],

    // 🔥 THIS IS THE FIX — BUILD TOPTEN MANUALLY
    topten: {
      today: Array.isArray(r.today) ? r.today : [],
      week: Array.isArray(r.week) ? r.week : [],
      month: Array.isArray(r.month) ? r.month : [],
    },

    todaySchedule: r.today ?? [],
    top_airing: r.topAiring ?? [],
    most_popular: r.mostPopular ?? [],
    most_favorite: r.mostFavorite ?? [],
    latest_completed: r.latestCompleted ?? [],
    latest_episode: r.latestEpisode ?? [],
    top_upcoming: r.topUpcoming ?? [],
    recently_added: r.recentlyAdded ?? [],
    genres: r.genres ?? [],
  };

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: now,
    })
  );

  return data;
}
