import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;

  if (!api_url) {
    console.error("[HOME] Missing VITE_API_URL");
    return null;
  }

  const now = Date.now();

  // 🔥 READ CACHE
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (parsed?.timestamp && now - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }
  }

  // 🔥 FETCH API
  const response = await axios.get(api_url);
  const raw = response.data?.results;

  if (!raw) return null;

  // ✅ NORMALIZED DATA SHAPE
  const data = {
    spotlights: raw.spotlights ?? [],
    trending: raw.trending ?? [],

    // 🔑 THIS IS THE IMPORTANT PART
    topten: raw.topTen ?? {
      today: [],
      week: [],
      month: [],
    },

    todaySchedule: raw.today ?? [],
    top_airing: raw.topAiring ?? [],
    most_popular: raw.mostPopular ?? [],
    most_favorite: raw.mostFavorite ?? [],
    latest_completed: raw.latestCompleted ?? [],
    latest_episode: raw.latestEpisode ?? [],
    top_upcoming: raw.topUpcoming ?? [],
    recently_added: raw.recentlyAdded ?? [],
    genres: raw.genres ?? [],
  };

  // 🔥 SAVE CACHE
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: now,
    })
  );

  return data;
}
