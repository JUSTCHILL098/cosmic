import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronDown,
  faAngleRight,
  faVolumeHigh,
  faVolumeXmark
} from "@fortawesome/free-solid-svg-icons";

const FAQ_ITEMS = [
  {
    question: "Is JustAnime safe?",
    answer:
      "Yes, JustAnime is completely safe to use. We ensure all content is properly scanned and secured for our users."
  },
  {
    question: "What makes JustAnime the best site to watch anime free online?",
    answer:
      "JustAnime offers high-quality streaming, a vast library of anime, no intrusive ads, and a user-friendly interface - all completely free."
  },
  {
    question: "How do I request an anime?",
    answer:
      "You can submit anime requests through our contact form or by reaching out to our support team."
  }
];

function SplashScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const handleSearchSubmit = useCallback(() => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;
    const queryParam = encodeURIComponent(trimmedSearch);
    navigate(`/search?keyword=${queryParam}`);
  }, [search, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const toggleAudio = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  return (
    <div className="splash-container">
      {/* Video Background with local-first source */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="splash-video"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        <source src="https://files.catbox.moe/kfq8pz.mp4" type="video/mp4" />
      </video>

      <div className="splash-overlay"></div>

      {/* Audio Button */}
      <button className="audio-toggle" onClick={toggleAudio} title={isMuted ? "Unmute" : "Mute"}>
        <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
      </button>

      {/* Centered content */}
      <div className="content-wrapper">
        {/* Logo */}
        <div className="logo-container">
          <img src="/logo.png" alt={logoTitle} className="logo" />
        </div>

        {/* Tagline */}
        <p className="mx-auto max-w-[700px] text-sm text-zinc-300 sm:text-base md:text-lg mb-2">
          Your Ultimate Anime Streaming Platform
        </p>
        <p className="mx-auto max-w-[700px] text-xs text-zinc-400 sm:text-sm mb-6">
          Thousands of anime series and movies
        </p>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search anime..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="search-button"
            onClick={handleSearchSubmit}
            aria-label="Search"
            title="Search"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>

        {/* Enter Homepage */}
        <Link to="/home" className="enter-button" title="Enter Homepage">
          Enter Homepage{" "}
          <FontAwesomeIcon icon={faAngleRight} className="angle-icon" />
        </Link>

        {/* Quick features row (Lunar-style vibe) */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-indigo-400 font-semibold mb-1">Massive Library</div>
            <div className="text-xs text-zinc-400">Explore thousands of anime</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-indigo-400 font-semibold mb-1">Global Content</div>
            <div className="text-xs text-zinc-400">Multi-language support</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-indigo-400 font-semibold mb-1">Personal Watchlist</div>
            <div className="text-xs text-zinc-400">Save favorites easily</div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`faq-toggle ${expandedFaq === index ? "rotate" : ""}`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
