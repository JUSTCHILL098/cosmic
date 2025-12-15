import { FaDiscord } from "react-icons/fa";

export default function SharePopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[420px] max-w-[90%] rounded-2xl overflow-hidden bg-[#0f0f0f] shadow-2xl border border-white/10">

        {/* Image */}
        <img
          src="https://files.catbox.moe/s3svgw.jpeg"
          alt="Share"
          className="w-full h-[220px] object-cover"
        />

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Sharing is caring.
          </h2>

          <p className="text-gray-300 text-sm">
            If you don’t share, I’ll shoot you!
          </p>

          {/* Discord Button */}
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center gap-3
              h-12 px-10 rounded-md
              bg-black/40 backdrop-blur-sm
              border border-white/20
              text-white text-base font-medium
              hover:bg-black/60 transition
              w-full
            "
          >
            <FaDiscord className="text-xl" />
            <span>Discord</span>
          </a>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
