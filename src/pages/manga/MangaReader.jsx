import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Settings, List } from "lucide-react";
import { fetchChapter } from "@/src/utils/manga.utils";

export default function MangaReader() {
  const { id, chapterID } = useParams();
  const navigate = useNavigate();
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [mode,    setMode]    = useState("vertical"); // vertical | paged
  const [page,    setPage]    = useState(0);
  const topRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setImages([]);
    setPage(0);
    fetchChapter(decodeURIComponent(id), decodeURIComponent(chapterID))
      .then(d => {
        // MangaDex returns a plain array of image URLs
        const imgs = Array.isArray(d) ? d : (d?.images || d?.pages || d?.data || []);
        setImages(imgs.filter(Boolean));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, chapterID]);

  const back = () => navigate(`/manga/${encodeURIComponent(id)}`);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
    </div>
  );

  if (error || images.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#000" }}>
      <p className="text-white/30 font-mono text-sm">{error || "No images found for this chapter"}</p>
      <button onClick={back} className="text-white/50 hover:text-white font-mono text-xs underline">← Back</button>
    </div>
  );

  const imgSrc = (img) => typeof img === "string" ? img : (img?.url || img?.src || img?.image || "");

  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#fff" }}>
      {/* Top bar */}
      <div ref={topRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={back} className="flex items-center gap-1.5 text-white/50 hover:text-white font-mono text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          {mode === "paged" && (
            <span className="text-white/30 font-mono text-xs">{page + 1} / {images.length}</span>
          )}
          <button
            onClick={() => setMode(m => m === "vertical" ? "paged" : "vertical")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
            style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
            {mode === "vertical" ? <List className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
            {mode === "vertical" ? "Paged" : "Scroll"}
          </button>
        </div>
      </div>

      {/* Reader */}
      <div className="pt-14">
        {mode === "vertical" ? (
          /* Vertical scroll mode */
          <div className="flex flex-col items-center gap-1 max-w-3xl mx-auto px-2 pb-20">
            {images.map((img, i) => (
              <img
                key={i}
                src={imgSrc(img)}
                alt={`Page ${i + 1}`}
                className="w-full h-auto"
                style={{ display: "block" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            ))}
          </div>
        ) : (
          /* Paged mode */
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 pb-20">
            <img
              src={imgSrc(images[page])}
              alt={`Page ${page + 1}`}
              className="max-w-full max-h-[calc(100vh-120px)] object-contain"
              onError={e => { e.target.src = "https://placehold.co/400x600/111/444?text=Error"; }}
            />
            {/* Paged nav */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-2xl"
              style={{ background:"rgba(0,0,0,0.8)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-25"
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white/60 font-mono text-sm min-w-[60px] text-center">{page + 1} / {images.length}</span>
              <button onClick={() => setPage(p => Math.min(images.length - 1, p + 1))} disabled={page === images.length - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-25"
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
