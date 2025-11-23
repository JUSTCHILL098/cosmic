import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import "./SplashScreen.css";

export default function SplashScreen() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Marquee items
  const items = [
    "Solo Leveling ソロレベリング",
    "One Piece ワンピース",
    "Dragon Ball ドラゴンボール",
    "Attack on Titan 進撃の巨人",
    "Demon Slayer 鬼滅の刃",
    "Naruto ナルト",
    "Jujutsu Kaisen 呪術廻戦",
    "Death Note デスノート",
    "Bleach ブリーチ",
    "Hunter x Hunter ハンター×ハンター",
    "Fullmetal Alchemist 鋼の錬金術師",
    "My Hero Academia 僕のヒーローアカデミア",
    "Chainsaw Man チェンソーマン",
    "Tokyo Ghoul 東京喰種",
    "Spy x Family スパイファミリー",
    "Violet Evergarden ヴァイオレット・エヴァーガーデン",
    "Vinland Saga ヴィンランド・サガ",
    "Cowboy Bebop カウボーイビバップ",
    "Evangelion 新世紀エヴァンゲリオン",
    "Your Name 君の名は",
  ];

  useEffect(() => {
    const addLink = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    };

    addLink("https://fonts.cdnfonts.com/css/geist-mono");
    addLink("https://fonts.cdnfonts.com/css/geist");

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* NAVBAR */}
      <Navbar />

      <div className="splash-wrapper min-h-screen text-white">
        <section className="hero-section">

          {/* ⭐ STARS */}
          <div className="stars"></div>
          <div className="stars-2"></div>
          <div className="stars-3"></div>

          {/* Badge */}
          <div className="fade z-10 mt-20">
            <div className="status-badge">
              <span className="status-dot-wrapper">
                <span className="status-ping"></span>
                <span className="status-dot"></span>
              </span>
              0 users watching now
            </div>
          </div>

          {/* MASK + VIDEO */}
          <div className="mask-container">
            <div className="mask-logo">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="mask-video"
              >
                <source
                  src="https://api.lunaranime.ru/static/intro.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <h1 className="hero-subtitle">
              Your Ultimate Anime Streaming Platform
            </h1>
            <p className="hero-desc">
              Thousands of anime series and movies in English and German
            </p>
          </div>

          {/* BUTTONS */}
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/home")}
              className="btn-primary"
            >
              Start Watching
            </button>

            <a href="#" className="btn-ghost">
              Discord
            </a>
          </div>

          {/* PREVIEW WINDOW */}
          <div className="preview-window">
            <div className="preview-header">
              <div className="dots">
                <div className="window-dot dot-red"></div>
                <div className="window-dot dot-yellow"></div>
                <div className="window-dot dot-green"></div>
              </div>

              <div className="url-pill">https://lunar.animes</div>
            </div>

            <div className="preview-body">
              <img
                src="https://i.imgur.com/Jp9w4wF.png"
                alt="Preview"
                className="preview-img"
              />
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="marquee-section">
          <div className="track">
            {[...items, ...items].map((label, i) => (
              <div className="marquee-item" key={i}>
                {label}
              </div>
            ))}
          </div>

          <div className="track reverse">
            {[...items, ...items].map((label, i) => (
              <div className="marquee-item" key={`r-${i}`}>
                {label}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
