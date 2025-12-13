import axios from "axios";

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;
  if (!api_url) {
    console.error("VITE_API_URL missing");
    return null;
  }

  const res = await axios.get(api_url);
  const raw = res.data;

  if (!raw || !raw.results) {
    console.error("Invalid API response", raw);
    return null;
  }

  const r = raw.results;

  return {
    spotlights: r.spotlights ?? [],
    trending: r.trending ?? [],

    // ✅ ✅ CORRECT TOP TEN MAPPING
    topten: {
      today: r.topTen?.today ?? [],
      week: r.topTen?.week ?? [],
      month: r.topTen?.month ?? [],
    },

    top_airing: r.topAiring ?? [],
    most_favorite: r.mostFavorite ?? [],
    latest_completed: r.latestCompleted ?? [],
    latest_episode: r.latestEpisode ?? [],
    genres: r.genres ?? [],
  };
}
