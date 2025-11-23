import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

/*
  - Uses an inline SVG mask (no external mask file required).
  - Adds stars background, smooth infinite marquee, enlarged window dots,
    Geist font loader, and a fake "users watching now" counter that looks real.
*/

export default function SplashScreen() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // fake user count (no API). Start from a plausible base; gently vary over time.
  const [users, setUsers] = useState(() => {
    // pick a base that feels real but not constant
    return Math.floor(120 + Math.random() * 80); // 120 - 200
  });

  useEffect(() => {
    // font injection (Geist / Geist Mono). Only inject once.
    const addLink = (href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    };
    addLink("https://fonts.cdnfonts.com/css/geist");
    addLink("https://fonts.cdnfonts.com/css/geist-mono");

    // users counter drift: every 5-8 seconds slightly change value to feel live
    const id = setInterval(() => {
      setUsers((prev) => {
        // small random walk but keep positive and bounded
        const delta = Math.floor(Math.random() * 11) - 5; // -5..+5
        let next = prev + delta;
        if (next < 5) next = 5;
        if (next > 800) next = 800;
        return next;
      });
    }, 6000 + Math.floor(Math.random() * 3000));

    // try autoplay
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    return () => clearInterval(id);
  }, []);

  // marquee items (same as original)
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

  // Create a data-URL SVG to use as CSS mask-image (LUNAR text)
  const getMaskDataUrl = () => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='160' viewBox='0 0 1200 160'>
        <style>
          text { font-family: 'Geist', 'Geist Mono', system-ui, sans-serif; font-weight:900; font-size:140px; letter-spacing:6px; }
        </style>
        <rect width='100%' height='100%' fill='white'/>
        <text x='50%' y='70%' text-anchor='middle' fill='black'>LUNAR</text>
      </svg>
    `;
    // encode and return data URL
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const maskDataUrl = getMaskDataUrl();

  return (
    <main className="splash-root">
      {/* stars layer */}
      <div className="stars" aria-hidden />

      <div className="splash-wrapper">
        {/* top fixed loading overlay (keeps parity with original) */}
        <div className="loading-overlay" aria-hidden />

        <section className="hero">
          {/* users watching badge (exact style like Lunar) */}
          <div className="users-badge">
            <span className="ping-dot">
              <span className="ping-anim" />
              <span className="ping-core" />
            </span>
            <span className="users-text">{users} users watching now</span>
          </div>

          {/* masked video area */}
          <div className="masked-video-wrap">
            <div
              className="masked-video"
              style={{
                WebkitMaskImage: `url("${maskDataUrl}")`,
                maskImage: `url("${maskDataUrl}")`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                background: "transparent",
              }}
              role="img"
              aria-label="LUNAR video mask"
            >
              <video
                ref={videoRef}
                className="masked-video-element"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="https://api.lunaranime.ru/static/intro.mp4" type="video/mp4" />
                {/* fallback */}
              </video>
            </div>
            <span className="sr-only">LUNAR</span>
          </div>

          <div className="hero-text">
            <p className="headline">Your Ultimate Anime Streaming Platform</p>
            <p className="subhead">Thousands of anime series and movies in English and German</p>
          </div>

          <div className="cta-row">
            <button className="btn-primary" onClick={() => navigate("/home")}>Start Watching</button>
            <a className="btn-ghost" href="#">Discord</a>
          </div>

          {/* preview window with big dots */}
          <div className="preview-window">
            <div className="preview-top">
              <div className="window-dots">
                <div className="window-dot dot-red" />
                <div className="window-dot dot-yellow" />
                <div className="window-dot dot-green" />
              </div>
              <div className="url-pill">https://lunar.animes</div>
            </div>
            <div className="preview-image">
              <img src="https://i.imgur.com/Jp9w4wF.png" alt="Preview" />
            </div>
          </div>
        </section>

        {/* marquee: smooth infinite looping */}
        <section className="marquee-section" aria-hidden>
          <div className="marquee-track" style={{ "--duration": "90s" }}>
            <div className="marquee-inner">
              {[...items, ...items].map((it, idx) => (
                <div key={`m1-${idx}`} className="marquee-item">
                  <span className="marquee-text">{it}</span>
                  <span className="divider" />
                </div>
              ))}
            </div>
            <div className="marquee-inner" aria-hidden>
              {[...items, ...items].map((it, idx) => (
                <div key={`m2-${idx}`} className="marquee-item">
                  <span className="marquee-text">{it}</span>
                  <span className="divider" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* small overview (keeps lightweight for splash) */}
        <section className="overview">
          <h2>Overview</h2>
          <p>Everything you need for your perfect anime experience</p>
        </section>
      </div>
    </main>
  );
}
