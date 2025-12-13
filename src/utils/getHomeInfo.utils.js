import axios from "axios";

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;
  if (!api_url) return null;

  const response = await axios.get(api_url);
  const raw = response.data;

  if (!raw?.results) return null;

  const r = raw.results;

  return {
    spotlights: r.spotlights ?? [],
    trending: r.trending ?? [],

    // ✅ READ DIRECTLY FROM BACKEND SHAPE
    topten: {
      today: r.today ?? [],
      week: r.week ?? [],
      month: r.month ?? [],
    },

    todaySchedule: r.today ?? [],
    top_airing: r.topAiring ?? [],
    most_favorite: r.mostFavorite ?? [],
    latest_completed: r.latestCompleted ?? [],
    latest_episode: r.latestEpisode ?? [],
    genres: r.genres ?? [],
  };
}
