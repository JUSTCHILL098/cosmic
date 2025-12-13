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
        const raw = await getHomeInfo();

        if (!raw || !raw.results) {
          throw new Error("Invalid home API response");
        }

        const results = raw.results;

        const normalizedHomeInfo = {
          spotlights: Array.isArray(results.spotlights)
            ? results.spotlights
            : [],

          genres: Array.isArray(results.genres)
            ? results.genres
            : [],

          trending: Array.isArray(results.trending)
            ? results.trending
            : [],

          latest_episode: Array.isArray(results.latestEpisode)
            ? results.latestEpisode
            : [],

          // ✅ FIXED TOP TEN (DO NOT TOUCH)
          topten: {
            today: Array.isArray(results.topTen?.today)
              ? results.topTen.today
              : [],
            week: Array.isArray(results.topTen?.week)
              ? results.topTen.week
              : [],
            month: Array.isArray(results.topTen?.month)
              ? results.topTen.month
              : [],
          },

          top_airing: Array.isArray(results.topAiring)
            ? results.topAiring
            : [],

          most_favorite: Array.isArray(results.mostFavorite)
            ? results.mostFavorite
            : [],

          latest_completed: Array.isArray(results.latestCompleted)
            ? results.latestCompleted
            : [],
        };

        console.log(
          "✅ TOP TEN FIXED:",
          normalizedHomeInfo.topten
        );

        setHomeInfo(normalizedHomeInfo);
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
    <HomeInfoContext.Provider
      value={{ homeInfo, homeInfoLoading, error }}
    >
      {children}
    </HomeInfoContext.Provider>
  );
};

export const useHomeInfo = () => useContext(HomeInfoContext);
