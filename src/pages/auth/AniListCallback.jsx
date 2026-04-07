import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAniList } from "@/src/context/AniListContext";

export default function AniListCallback() {
  const navigate = useNavigate();
  const { setAccessToken } = useAniList();

  useEffect(() => {
    // AniList implicit flow puts token in URL hash: #access_token=xxx&token_type=Bearer&...
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
      navigate("/profile", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
        <p className="text-white/30 font-mono text-sm">Connecting to AniList...</p>
      </div>
    </div>
  );
}
