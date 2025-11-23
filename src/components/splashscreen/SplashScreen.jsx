import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import "./SplashScreen.css";

/**
 * Final SplashScreen.jsx
 * - Creates inline SVG mask for "LUNAR" so no external mask file required.
 * - Adds diagonal streaks + twinkling stars.
 * - Smooth marquee and preview window.
 * - Uses Geist font via injected <link>.
 */

export default function SplashScreen() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

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
    // inject Geist fonts
    const addLink = (href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        document.head.appendChild(l);
      }
    };
    addLink("https://fonts.cdnfonts.com/css/geist-mono");
    addLink("https://fonts.cdnfonts.com/css/geist");

    // ensure video tries to autoplay
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch(() => {
          /* autoplay blocked: it's fine, video will be paused */
        });
    }
  }, []);

  // build inline SVG mask data URL for "LUNAR"
  const maskSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'>
      <rect width='1200' height='200' fill='black'/>
      <style>
        @import url('https://fonts.cdnfonts.com/css/geist-mono');
        text { font-family: 'Geist Mono', monospace; font-weight: 900; font-size: 150px; letter-spacing: 8px; }
      </style>
      <text x='50%' y='72%' text-anchor='middle' fill='white'>LUNAR</text>
    </svg>`
  );
  const maskDataUrl = `data:image/svg+xml;utf8,${maskSvg}`;

  return (
    <main className="splash-root">
      <Navbar />

      {/* background layers */}
      <div className="streaks-layer" aria-hidden />
      <div className="twinkle-layer" aria-hidden />

      <div className="splash-wrapper">
        <section className="hero">
          {/* status badge */}
          <div className="status-wrap">
            <div className="status-badge">
              <span className="status-indicator">
                <span className="ping" />
                <span className="core" />
              </span>
              <span className="status-text">10 users watching now</span>
            </div>
          </div>

          {/* masked LUNAR */}
          <div
            className="mask-block"
            style={{
              WebkitMaskImage: `url("${maskDataUrl}")`,
              maskImage: `url("${maskDataUrl}")`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="https://api.lunaranime.ru/static/intro.mp4" type="video/mp4" />
            </video>
          </div>

          {/* subtitle */}
          <p className="subhead">Your Complete Anime Entertainment Platform</p>
          <p className="subdesc">Thousands of series in English &amp; German and more</p>

          {/* CTAs */}
          <div className="cta-row">
            <button className="cta-primary" onClick={() => navigate("/home")}>
              Start Watching
            </button>
            <a className="cta-ghost" href="#" onClick={(e)=>e.preventDefault()}>Discord</a>
          </div>

          {/* preview window */}
          <div className="preview">
            <div className="preview-top">
              <div className="preview-dots" aria-hidden>
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
              </div>

              <div className="preview-url">https://lunar.animes</div>
            </div>

            <div className="preview-body">
              <img className="preview-img" src="https://i.imgur.com/Jp9w4wF.png" alt="preview" />
            </div>
          </div>
        </section>

        {/* marquee (duplicate items for smoothness) */}
        <section className="marquee">
          <div className="marquee-track" style={{ "--duration": "72s" }}>
            {[...items, ...items].map((t, i) => (
              <div className="marquee-item" key={i}>{t}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
