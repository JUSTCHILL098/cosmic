const KEY = "continueWatching";
const MAX = 20;

export const saveProgress = ({ id, episodeId, episodeNum, title, japanese_title, poster, adultContent, currentTime, duration }) => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    // Remove existing entry for this episode
    const filtered = list.filter(i => i.episodeId !== episodeId);
    const entry = { id, episodeId, episodeNum, title, japanese_title, poster, adultContent: !!adultContent, currentTime, duration, updatedAt: Date.now() };
    // Add to front, cap at MAX
    const updated = [entry, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
};

export const getProgress = (episodeId) => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return list.find(i => i.episodeId === episodeId) || null;
  } catch { return null; }
};
