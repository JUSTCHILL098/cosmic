import axios from "axios";

const CACHE_KEY = "homeInfoCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;

  const currentTime = Date.now();
  const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));

  if (cachedData && currentTime - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const response = await axios.get(api_url);
  const raw = response.data;

  // ✅ SUPPORT BOTH API SHAPES
  const source = raw.results ?? raw;

  const data = {
    spotlights: source.spotlights ?? [],
    trending: source.trending ?? [],

    // Top ten (your backend format)
    topten:
      source.topTen ??
      {
        today: source.today ?? [],
        week: source.week ?? [],
        month: source.month ?? [],
      },

    todaySchedule: source.today ?? [],
    top_airing: source.topAiring ?? source.top_airing ?? [],
    most_popular: source.mostPopular ?? source.most_popular ?? [],
    most_favorite: source.mostFavorite ?? source.most_favorite ?? [],
    latest_completed:
      source.latestCompleted ?? source.latest_completed ?? [],
    latest_episode:
      source.latestEpisode ?? source.latest_episode ?? [],
    top_upcoming: source.topUpcoming ?? [],
    recently_added: source.recentlyAdded ?? [],
    genres: source.genres ?? [],
  };

  const dataToCache = {
    data,
    timestamp: currentTime,
  };

  localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));

  return data;
}
