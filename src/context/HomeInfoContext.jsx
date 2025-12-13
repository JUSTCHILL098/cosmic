import { createContext, useContext, useEffect, useState } from "react";
import getHomeInfo from "../utils/getHomeInfo.utils.js";

const HomeInfoContext = createContext(null);

export const HomeInfoProvider = ({ children }) => {
  const [homeInfo, setHomeInfo] = useState(null);
  const [homeInfoLoading, setHomeInfoLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        const data = await getHomeInfo();

        if (!data) {
          throw new Error("Home API returned null");
        }

        // ✅ DO NOT TOUCH SHAPE HERE
        const normalized = {
          spotlights: Array.isArray(data.spotlights) ? data.spotlights : [],
          genres: Array.isArray(data.genres) ? data.genres : [],
          trending: Array.isArray(data.trending) ? data.trending : [],
          latest_episode: Array.isArray(data.latest_episode)
            ? data.latest_episode
            : [],

          // ✅ THIS IS THE FIX
          topten: {
            today: Array.isArray(data.topten?.today)
              ? data.topten.today
              : [],
            week: Array.isArray(data.topten?.week)
              ? data.topten.week
              : [],
            month: Array.isArray(data.topten?.month)
              ? data.topten.month
              : [],
          },

          top_airing: Array.isArray(data.top_airing)
            ? data.top_airing
            : [],
          most_favorite: Array.isArray(data.most_favorite)
            ? data.most_favorite
            : [],
          latest_completed: Array.isArray(data.latest_completed)
            ? data.latest_completed
            : [],
        };

        console.log("✅ TOPTEN FINAL:", normalized.topten);

        setHomeInfo(normalized);
      } catch (err) {
        console.error("Home info error:", err);
        setError(err);
      } finally {
        setHomeInfoLoading(false);
      }
    };

    fetchHomeInfo();
  }, []);

  return (
    <HomeInfoContext.Provider value={{ homeInfo, homeInfoLoading, error }}>
      {children}
    </HomeInfoContext.Provider>
  );
};

export const useHomeInfo = () => useContext(HomeInfoContext);
