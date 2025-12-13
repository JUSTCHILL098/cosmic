import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default async function getHomeInfo() {
  // ✅ Vite-safe env access with fallback
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

    // ✅ Read cache safely
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cachedData = JSON.parse(cachedRaw);
      if (
        cachedData?.timestamp &&
        currentTime - cachedData.timestamp < CACHE_DURATION &&
        cachedData?.data
      ) {
        return cachedData.data;
      }
    }

    // ✅ Fetch API
    const response = await axios.get(api_url);
    const raw = response?.data;

    if (!raw) {
      console.error("[HOME API] Empty response");
      return null;
    }

    // ✅ Support both `{ results }` and direct payloads
    const source = raw.results ?? raw;

    // ✅ Normalize data shape for frontend
    const data = {
      spotlights: Array.isArray(source.spotlights) ? source.spotlights : [],
      trending: Array.isArray(source.trending) ? source.trending : [],

      // Top Ten normalization
      topten:
        source.topTen ??
        {
          today: Array.isArray(source.today) ? source.today : [],
          week: Array.isArray(source.week) ? source.week : [],
          month: Array.isArray(source.month) ? source.month : [],
        },

      todaySchedule: Array.isArray(source.today) ? source.today : [],
      top_airing:
        Array.isArray(source.topAiring)
          ? source.topAiring
          : Array.isArray(source.top_airing)
          ? source.top_airing
          : [],
      most_popular:
        Array.isArray(source.mostPopular)
          ? source.mostPopular
          : Array.isArray(source.most_popular)
          ? source.most_popular
          : [],
      most_favorite:
        Array.isArray(source.mostFavorite)
          ? source.mostFavorite
          : Array.isArray(source.most_favorite)
          ? source.most_favorite
          : [],
      latest_completed:
        Array.isArray(source.latestCompleted)
          ? source.latestCompleted
          : Array.isArray(source.latest_completed)
          ? source.latest_completed
          : [],
      latest_episode:
        Array.isArray(source.latestEpisode)
          ? source.latestEpisode
          : Array.isArray(source.latest_episode)
          ? source.latest_episode
          : [],
      top_upcoming: Array.isArray(source.topUpcoming)
        ? source.topUpcoming
        : [],
      recently_added: Array.isArray(source.recentlyAdded)
        ? source.recentlyAdded
        : [],
      genres: Array.isArray(source.genres) ? source.genres : [],
    };

    // ✅ Cache normalized data
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
