import axios from "axios";

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;

  if (!api_url) {
    console.error("❌ VITE_API_URL missing");
    return null;
  }

  const response = await axios.get(api_url);
  const raw = response.data;

  if (!raw || !raw.results) {
    console.error("❌ Invalid API response", raw);
    return null;
  }

  const r = raw.results;

  return {
    spotlights: r.spotlights ?? [],
    trending: r.trending ?? [],

    // ✅ THIS IS THE IMPORTANT PART
    topten: {
      today: r.today ?? [],
      week: r.week ?? [],
      month: r.month ?? [],
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
}
