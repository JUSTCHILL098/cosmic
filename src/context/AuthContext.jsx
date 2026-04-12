import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    setProfile(data ?? null);
    setLoading(false);
  };

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/profile" },
    });
    if (error) throw error;
    // Insert profile immediately using the user id
    const userId = data.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        username,
        avatar_url: null,
        banner_url: null,
        bio: "",
        level: 1,
        xp: 0,
        episodes_watched: 0,
        comments: 0,
        created_at: new Date().toISOString(),
      });
    }
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Surface a friendlier message for unverified email
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        throw new Error("Please verify your email first. Check your inbox for a confirmation link.");
      }
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    // Try update first; if no row exists, upsert to create it
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (error) {
      // Fallback: upsert (creates row if missing)
      const { error: upsertErr } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...updates });
      if (upsertErr) throw upsertErr;
    }
    // Re-fetch the updated row
    const { data: fresh } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(fresh ?? null);
    return fresh;
  };

  // Track an episode watch — increments episodes_watched and adds XP
  const trackWatch = async (animeId, episodeId, animeTitle) => {
    if (!user) return;
    // Upsert watch record
    await supabase.from("watch_history").upsert({
      user_id: user.id,
      anime_id: animeId,
      episode_id: episodeId,
      anime_title: animeTitle,
      watched_at: new Date().toISOString(),
    }, { onConflict: "user_id,anime_id,episode_id" });

    // Increment episodes_watched + xp on profile
    const newEps = (profile?.episodes_watched || 0) + 1;
    const newXp  = (profile?.xp || 0) + 10;
    const newLvl = Math.floor(newXp / 500) + 1;
    await updateProfile({ episodes_watched: newEps, xp: newXp, level: newLvl });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile, trackWatch, fetchProfile: () => fetchProfile(user?.id) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
