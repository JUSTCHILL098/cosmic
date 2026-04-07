import axios from "axios";

const getQtip = async (id) => {
  try {
    // Use main API URL — worker URLs are optional and often broken
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) throw new Error("No API endpoint defined.");
    const animeId = id.split("-").pop();
    const response = await axios.get(`${apiUrl}qtip/${animeId}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return null;
  }
};

export default getQtip;
