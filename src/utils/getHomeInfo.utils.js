import axios from "axios";

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;

  if (!api_url) {
    console.error("❌ VITE_API_URL missing");
    return null;
  }

  const response = await axios.get(api_url);
  const raw = response.data;

  console.log("🔥 RAW HOME API RESPONSE =>", raw);

  if (!raw?.results) {
    console.error("❌ No results key");
    return null;
  }

  const r = raw.results;

  console.log("🔥 RAW TOPTEN FROM API =>", r.topTen);

  return {
    spotlights: r.spotlights ?? [],
    trending: r.trending ?? [],
    topten: r.topTen ?? { today: [], week: [], month: [] },
    todaySchedule: r.today ?? [],
    top_airing: r.topAiring ?? [],
    most_favorite: r.mostFavorite ?? [],
    latest_completed: r.latestCompleted ?? [],
    latest_episode: r.latestEpisode ?? [],
    genres: r.genres ?? [],
  };
}
