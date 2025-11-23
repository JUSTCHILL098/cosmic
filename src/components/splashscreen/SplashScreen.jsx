import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../navbar/Navbar.jsx";
import "./SplashScreen.css";

export default function SplashScreen() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const maskUrl = "https://i.imgur.com/5hGx8zL.png";

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
    // spawn falling stars
    const container = document.querySelector(".stars");

    for (let i = 0; i < 80; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 3 + Math.random() * 5 + "s";
      s.style.animationDelay = Math.random() * 5 + "s";
      container.appendChild(s);
    }

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main className="splash-root">

      {/* NAVBAR */}
      <Navbar />

      {/* FALLING STARS */}
      <div className="stars"></div>

      <section className="hero-section">

        {/* STATUS BADGE */}
        <div className="status-badge">
          <span className="dot"></span> 0 users watching now
        </div>

        {/* MASKED VIDEO */}
        <div className="mask-box">
          <div
            className="mask-logo"
            style={{
              maskImage: `url("${maskUrl}")`,
              WebkitMaskImage: `url("${maskUrl}")`,
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="masked-video"
            >
              <source src="https://api.lunaranime.ru/static/intro.mp4" />
            </video>
          </div>
        </div>

        {/* TEXT */}
        <h1 className="hero-subtitle">Your Ultimate Anime Streaming Platform</h1>
        <p className="hero-desc">
          Thousands of anime series and movies in English and German
        </p>

        {/* CTA BUTTON */}
        <button
          onClick={() => navigate("/home")}
          className="watch-btn"
        >
          Start Watching
        </button>

        {/* PREVIEW WINDOW */}
        <div className="preview-window">
          <div className="window-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>

            <div className="url-box">https://lunar.animes</div>
          </div>

          <img
            src="https://i.imgur.com/Jp9w4wF.png"
            alt="Lunar Preview"
            className="preview-img"
          />
        </div>

      </section>

      {/* MARQUEE */}
      <section className="marquee-section">
        <div className="marquee-track">
          {[...items, ...items].map((label, i) => (
            <div className="marquee-item" key={i}>
              <span>{label}</span>
              <div className="marquee-divider"></div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
