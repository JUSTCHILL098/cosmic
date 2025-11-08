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
      {/* Video Background: local-first with poster for reliability */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster="/splash.jpg"
        className="splash-video"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="splash-overlay"></div>
      <div className="splash-gradient"></div>

      {/* Audio Button */}
      <button className="audio-toggle" onClick={toggleAudio}>
        <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
      </button>

      <div className="content-wrapper">
        {/* Logo */}
        <div className="logo-container">
          <img src="/logo.png" alt={logoTitle} className="logo" />
        </div>

        {/* Tagline / Subline to mirror Lunar’s black theme */}
        <h1 className="tagline">Watch anime free, fast, and without intrusive ads</h1>
        <p className="subline">Latest episodes, movies, and timeless classics — all in one place.</p>

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
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <Link to="/most-popular" className="quick-link">Popular</Link>
          <Link to="/movie" className="quick-link">Movies</Link>
          <Link to="/a2z" className="quick-link">A–Z</Link>
          <Link to="/schedule" className="quick-link">Schedule</Link>
        </div>

        {/* Enter Homepage */}
        <Link to="/home" className="enter-button">
          Enter Homepage <FontAwesomeIcon icon={faAngleRight} className="angle-icon" />
        </Link>

        {/* Small Feature Grid (visual parity without extra features) */}
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-title">Fast Streaming</div>
            <div className="feature-desc">Optimized delivery for smooth playback.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">No Intrusive Ads</div>
            <div className="feature-desc">Focus on content, not interruptions.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Community & Support</div>
            <div className="feature-desc">Active channels and prompt help.</div>
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
