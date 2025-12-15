import { X, Info } from "lucide-react";
import { useEffect } from "react";

export default function SharePopup({ open, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[360px] max-w-[92%] rounded-2xl overflow-hidden bg-[#0b0b0b] border border-white/10 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 rounded-full
                     bg-black/50 backdrop-blur-sm
                     flex items-center justify-center
                     text-white/80 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Image */}
        <img
          src="https://files.catbox.moe/s3svgw.jpeg"
          alt="Share"
          className="w-full h-[190px] object-cover"
        />

        {/* Content */}
        <div className="p-5 text-center space-y-3">
          <h2 className="text-white text-lg font-semibold">
            Sharing is caring.
          </h2>

          <p className="text-white/70 text-sm">
            If you don’t share, I’ll shoot you!
          </p>

          {/* Button (exact style you asked for) */}
          <a
            href="/one-punch-man-season-3-19932"
            className="
              inline-flex items-center justify-center gap-2
              h-10 px-8 rounded-md
              bg-black/40 backdrop-blur-sm
              border border-white/20
              text-white text-sm font-medium
              hover:bg-black/60 transition
              w-full
            "
          >
            <Info className="h-4 w-4" />
            Details
          </a>
        </div>
      </div>
    </div>
  );
}
