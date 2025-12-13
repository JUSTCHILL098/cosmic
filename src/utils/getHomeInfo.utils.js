import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default async function getHomeInfo() {
  // ✅ Vite-safe env access
  const api_url =
    import.meta.env?.VITE_API_URL ||
    import.meta.env?.VITE_API ||
    "";

  if (!api_url) {
    console.error("[HOME API] VITE_API_URL is missing");
    return null;
  }

  try {
    const currentTime = Date.now();

    // 🔹 Try cache first
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (
        cached?.timestamp &&
        cached?.data &&
        currentTime - cached.timestamp < CACHE_DURATION
      ) {
        return cached.data;
      }
    }

    // 🔹 Fetch from API
    const response = await axios.get(api_url);
    const raw = response?.data;

    if (!raw || !raw.results) {
      console.error("[HOME API] Invalid response shape", raw);
      return null;
    }

    const source = raw.results;

    // ✅ FINAL NORMALIZED SHAPE (MATCHES FRONTEND USAGE)
    const data = {
      // --- Hero / Top ---
      spotlights: Array.isArray(source.spotlights) ? source.spotlights : [],
      trending: Array.isArray(source.trending) ? source.trending : [],

      // ✅ TOP TEN (ONLY FROM source.topTen — NO FALLBACKS)
      topten: {
        today: Array.isArray(source?.topTen?.today)
          ? source.topTen.today
          : [],
        week: Array.isArray(source?.topTen?.week)
          ? source.topTen.week
          : [],
        month: Array.isArray(source?.topTen?.month)
          ? source.topTen.month
          : [],
      },

      // --- Schedule ---
      todaySchedule: Array.isArray(source.today) ? source.today : [],

      // --- Categories ---
      top_airing: Array.isArray(source.topAiring)
        ? source.topAiring
        : [],
      most_popular: Array.isArray(source.mostPopular)
        ? source.mostPopular
        : [],
      most_favorite: Array.isArray(source.mostFavorite)
        ? source.mostFavorite
        : [],
      latest_completed: Array.isArray(source.latestCompleted)
        ? source.latestCompleted
        : [],
      latest_episode: Array.isArray(source.latestEpisode)
        ? source.latestEpisode
        : [],
      top_upcoming: Array.isArray(source.topUpcoming)
        ? source.topUpcoming
        : [],
      recently_added: Array.isArray(source.recentlyAdded)
        ? source.recentlyAdded
        : [],

      // --- Genres ---
      genres: Array.isArray(source.genres) ? source.genres : [],
    };

    // 🔹 Cache normalized data
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: currentTime,
      })
    );

    return data;
  } catch (err) {
    console.error("[HOME API] Failed to load home info:", err);
    return null;
  }
}
