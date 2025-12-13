import { createContext, useContext, useState, useEffect } from "react";
import getHomeInfo from "../utils/getHomeInfo.utils.js";

const HomeInfoContext = createContext();

export const HomeInfoProvider = ({ children }) => {
  const [homeInfo, setHomeInfo] = useState(null);
  const [homeInfoLoading, setHomeInfoLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        const raw = await getHomeInfo();

        // ✅ NORMALIZE RESPONSE (frontend-only fix)
        const normalizedHomeInfo = {
          // Spotlight
          spotlights: raw?.results?.spotlights ?? raw?.spotlights ?? [],

          // Genres
          genres: raw?.results?.genres ?? raw?.genres ?? [],

          // Trending
          trending: raw?.results?.trending ?? raw?.trending ?? [],

          // Latest Episode
          latest_episode:
            raw?.results?.latestEpisode ??
            raw?.latestEpisode ??
            raw?.latest_episode ??
            [],

          // Top Ten (IMPORTANT)
          topten:
            raw?.results?.topTen ??
            {
              today: raw?.today ?? [],
              week: raw?.week ?? [],
              month: raw?.month ?? [],
            },

          // Tabbed sections
          top_airing:
            raw?.results?.topAiring ??
            raw?.topAiring ??
            raw?.top_airing ??
            [],

          most_favorite:
            raw?.results?.mostFavorite ??
            raw?.mostFavorite ??
            raw?.most_favorite ??
            [],

          latest_completed:
            raw?.results?.latestCompleted ??
            raw?.latestCompleted ??
            raw?.latest_completed ??
            [],
        };

        setHomeInfo(normalizedHomeInfo);
      } catch (err) {
        console.error("Error fetching home info:", err);
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
