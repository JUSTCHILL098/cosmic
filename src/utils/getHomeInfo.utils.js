import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;

  if (!api_url) {
    console.error("❌ VITE_API_URL missing");
    return null;
  }

  try {
    const now = Date.now();

    // 🔹 CACHE
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (now - parsed.timestamp < CACHE_DURATION) {
        return parsed.data;
      }
    }

    // 🔹 FETCH
    const response = await axios.get(api_url);
    const raw = response.data;

    if (!raw || !raw.results) {
      console.error("❌ Invalid API response", raw);
      return null;
    }

    const results = raw.results;

    // 🔹 NORMALIZED DATA (THIS FIXES TOPTEN)
    const data = {
      spotlights: results.spotlights ?? [],
      trending: results.trending ?? [],

      // ✅ FIXED TOPTEN
      topten: {
        today: Array.isArray(results.today) ? results.today : [],
        week: Array.isArray(results.week) ? results.week : [],
        month: Array.isArray(results.month) ? results.month : [],
      },

      todaySchedule: results.today ?? [],
      top_airing: results.topAiring ?? [],
      most_popular: results.mostPopular ?? [],
      most_favorite: results.mostFavorite ?? [],
      latest_completed: results.latestCompleted ?? [],
      latest_episode: results.latestEpisode ?? [],
      top_upcoming: results.topUpcoming ?? [],
      recently_added: results.recentlyAdded ?? [],
      genres: results.genres ?? [],
    };

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: now })
    );

    return data;
  } catch (err) {
    console.error("❌ HOME FETCH FAILED", err);
    return null;
  }
}
