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

// ... (FAQ_ITEMS remains the same)

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
      {/* Remote video ONLY (as requested) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster="/splash.jpg"
        className="splash-video"
      >
        <source src="https://files.catbox.moe/kfq8pz.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="splash-overlay"></div>
      <div className="splash-gradient"></div>

      {/* Audio Button */}
      <button className="audio-toggle" onClick={toggleAudio}>
        <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
      </button>

      {/* Centered content — kept within viewport */}
      {/* ADDED: A max-width class and padding to ensure content doesn't stretch too wide on any screen */}
      <div className="content-wrapper w-full max-w-4xl px-4 mx-auto"> 
        {/* Logo */}
        {/* ASSUMPTION: Logo size is managed by CSS, but if it's too big, you may need a max-width here */}
        <div className="logo-container">
          <img src="/logo.png" alt={logoTitle} className="logo" />
        </div>

        {/* Status pill like Lunar */}
        <div className="watching-pill">10 users watching now</div>

        {/* Headings */}
        {/* ADJUSTED: Used common responsive text classes (text-5xl for desktop, text-3xl for mobile) 
             Note: These classes should be defined in your CSS/Tailwind config. If you are using plain CSS,
             you will need to implement media queries for the .tagline and .subline classes. */}
        <h1 className="tagline text-5xl md:text-6xl text-center mx-auto">Your Complete Anime Entertainment Platform</h1>
        <p className="subline text-lg text-center mx-auto">Thousands of series — free and fast streaming.</p>

        {/* Search */}
        <div className="search-container w-full max-w-lg mx-auto"> 
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

        {/* CTA Row */}
        <div className="button-row flex justify-center mt-6"> 
          <Link to="/home" className="enter-button">
            Start Watching <FontAwesomeIcon icon={faAngleRight} className="angle-icon" />
          </Link>
          <a
            href="https://discord.gg/YourDiscordInvite"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button ml-4"
          >
            Discord
          </a>
        </div>

        {/* FAQ */}
        <div className="faq-section mt-10 w-full max-w-xl mx-auto"> 
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
