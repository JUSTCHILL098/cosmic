
import React, { useEffect, useState } from "react";
import "./SplashScreen.css";
import { FaDiscord, FaSearch, FaBars } from "react-icons/fa";

export default function SplashScreen() {
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 900) + 100);
  }, []);

  const animeList = [
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
    "Your Name 君の名は"
  ];

  return (
    <div className="splash-container">

      {/* Stars BG */}
      <div className="stars"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-logo">LUNAR</div>

          <div className="nav-icons">
            <FaSearch />
            <FaDiscord />
            <FaBars />
          </div>
        </div>
      </nav>

      {/* TOP SECTION */}
      <section className="top-section">

        {/* USERS WATCHING */}
        <div className="watching-box">
          <span className="dot"></span>
          {viewerCount} users watching now
        </div>

        {/* MASKED VIDEO */}
        <div className="mask-box">
          <video
            className="lunar-video"
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src="https://api.lunaranime.ru/static/intro.mp4" />
          </video>
        </div>

        {/* TEXT */}
        <p className="subtext">Your Ultimate Anime Streaming Platform</p>
        <p className="subtext-sm">Thousands of anime series and movies in English and German</p>

      </section>

      {/* CAROUSEL */}
      <div className="carousel">
        <div className="carousel-track">
          {animeList.map((a, i) => (
            <div className="carousel-item" key={i}>
              <span>{a}</span>
              <div className="divider"></div>
            </div>
          ))}

          {/* Duplicate for infinite looping */}
          {animeList.map((a, i) => (
            <div className="carousel-item" key={"dup-" + i}>
              <span>{a}</span>
              <div className="divider"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
