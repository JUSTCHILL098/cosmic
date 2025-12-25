import React, { useEffect, useRef } from "react";
import { 
  Bell, Share2, Smartphone, Tablet, Laptop, Tv, 
  Gamepad, ChevronLeft, ChevronRight, Check, X, 
  Library, Calendar, Play, MessageCircle, Globe, Heart 
} from "lucide-react";

const libraryItems = [
  { title: "Attack on Titan", desc: "Humanity fights for survival against giant humanoid Titans." },
  { title: "Demon Slayer", desc: "A boy hunts demons to cure his sister." },
  { title: "One Piece", desc: "Pirates search for the ultimate treasure." },
  { title: "Jujutsu Kaisen", desc: "Students battle curses using special techniques." },
  { title: "My Hero Academia", desc: "A boy without powers strives to be a hero." },
  { title: "Chainsaw Man", desc: "A devil hunter merges with his pet devil." },
  { title: "Spy x Family", desc: "A spy, assassin, and telepath form a fake family." }
];

const animeTitles = [
  "Solo Leveling ソロレベリング", "One Piece ワンピース", "Dragon Ball ドラゴンボール",
  "Attack on Titan 進撃の巨人", "Demon Slayer 鬼滅の刃", "Naruto ナルト",
  "Jujutsu Kaisen 呪術廻戦", "Death Note デスノート", "Bleach ブリーチ"
];

const NotificationItem = ({ title, time, desc, isNew }) => (
  <div className="notification-card">
    <div className="notif-icon-bg">
      <Bell className="notif-icon" />
    </div>
    <div className="notif-content">
      <div className="notif-header">
        <h4>{title} {isNew && <span className="badge-new">NEW</span>}</h4>
        <span className="notif-time">{time}</span>
      </div>
      <p className="notif-desc">{desc}</p>
      {isNew && (
        <div className="notif-actions">
          <button className="btn-mark"><Check className="h-3 w-3 mr-1" /> Mark read</button>
          <button className="btn-dismiss"><X className="h-3 w-3 mr-1" /> Dismiss</button>
        </div>
      )}
    </div>
  </div>
);

export default function SplashScreen() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Add font links
    const link = document.createElement("link");
    link.href = "https://fonts.cdnfonts.com/css/geist-mono";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="splash-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-video-container">
          <video 
            ref={videoRef}
            src="https://api.lunaranime.ru/static/intro.mp4" 
            autoPlay loop muted playsInline 
            className="hero-video"
          />
        </div>
        
        <div className="hero-overlay">
          <div className="status-pill">
            <span className="ping-dot"></span>
            0 users watching now
          </div>
          <h1 className="hero-title">LUNAR</h1>
          <div className="hero-content">
            <p className="hero-subtitle">Your Complete Anime Entertainment Platform</p>
            <p className="hero-small">Thousands of series in English & German and more</p>
            <div className="hero-btns">
              <button className="btn-primary"><Play className="h-4 w-4 fill-current" /> Start Watching</button>
              <button className="btn-outline"><MessageCircle className="h-4 w-4" /> Discord</button>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee-content">
              {animeTitles.map((title, idx) => (
                <React.Fragment key={idx}>
                  <span className="marquee-text">{title}</span>
                  <span className="marquee-dot"></span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <section className="overview-section">
        <h2 className="section-title"><span>Overview</span></h2>
        <p className="section-desc">Everything you need for your perfect anime experience</p>
        <div className="overview-grid">
          {[
            { icon: Library, title: "Massive Library", badge: "Popular", color: "blue" },
            { icon: Globe, title: "Global Content", badge: "International", color: "purple" },
            { icon: Heart, title: "Favorites List", badge: "Essential", color: "indigo" }
          ].map((item, i) => (
            <div key={i} className="overview-card">
              <span className={`card-badge ${item.color}`}>{item.badge}</span>
              <item.icon className="card-icon" />
              <h3>{item.title}</h3>
              <p>Explore thousands of anime from every genre and era</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="bento-section">
        <h2 className="section-title">Why Choose <span className="text-indigo">Lunar</span>?</h2>
        <div className="bento-grid">
          {/* Bento Card 1 */}
          <div className="bento-card bento-col-1">
            <div className="card-marquee">
              <div className="card-marquee-inner">
                {[...libraryItems, ...libraryItems].map((item, i) => (
                  <div key={i} className="mini-card">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer">
              <Library className="footer-icon" />
              <h3>Extensive Library</h3>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="bento-card bento-col-2">
            <div className="notif-wrapper">
              <NotificationItem title="Attack on Titan" time="Just now" desc="New Season available!" isNew={true} />
              <NotificationItem title="One Piece" time="Yesterday" desc="Episode 1067 is streaming" isNew={false} />
            </div>
            <div className="card-footer">
              <Bell className="footer-icon" />
              <h3>Smart Notifications</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
