import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { gql, GET_VIEWER, GET_MEDIA_LIST, SAVE_MEDIA_LIST, ANILIST_IMPLICIT_URL } from "@/src/lib/anilist";

const Ctx = createContext(null);

const TOKEN_KEY = "anilist_token";
const USER_KEY  = "anilist_user";

export const AniListProvider = ({ children }) => {
  const [token,   setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // Fetch viewer on token change
  useEffect(() => {
    if (!token) { setUser(null); return; }
    setLoading(true);
    gql(GET_VIEWER, {}, token)
      .then(d => {
        setUser(d.Viewer);
        localStorage.setItem(USER_KEY, JSON.stringify(d.Viewer));
      })
      .catch(() => { logout(); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = () => {
    window.location.href = ANILIST_IMPLICIT_URL;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const setAccessToken = (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const getList = useCallback((status = "CURRENT", page = 1) => {
    if (!token || !user) return Promise.resolve([]);
    return gql(GET_MEDIA_LIST, { userId: user.id, type: "ANIME", status, page, perPage: 50 }, token)
      .then(d => d.Page.mediaList);
  }, [token, user]);

  const saveEntry = useCallback((mediaId, status, progress, score) => {
    if (!token) return Promise.reject(new Error("Not logged in"));
    return gql(SAVE_MEDIA_LIST, { mediaId, status, progress, score }, token)
      .then(d => d.SaveMediaListEntry);
  }, [token]);

  // Track an episode watch on AniList
  const trackEpisode = useCallback(async (anilistId, episodeNum) => {
    if (!token || !anilistId || !episodeNum) return;
    try {
      await saveEntry(Number(anilistId), "CURRENT", Number(episodeNum), undefined);
    } catch (e) {
      console.warn("AniList track failed:", e.message);
    }
  }, [token, saveEntry]);

  return (
    <Ctx.Provider value={{
      token, user, loading,
      isConnected: !!token && !!user,
      login, logout, setAccessToken,
      getList, saveEntry, trackEpisode,
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAniList = () => useContext(Ctx);
