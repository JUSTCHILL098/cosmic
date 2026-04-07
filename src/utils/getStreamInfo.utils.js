import axios from "axios";

export default async function getStreamInfo(animeId, episodeId, serverName, type) {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(
      `${api_url}stream?id=${animeId}&ep=${episodeId}&server=${serverName}&type=${type}`,
      { timeout: 10000 }
    );
    // API shape: { success, results: { streamingLink[], tracks[], servers[], intro, outro } }
    return response.data.results;
  } catch (error) {
    console.error("❌ STREAM API ERROR:", error.response?.data || error.message);
    return null;
  }
}
