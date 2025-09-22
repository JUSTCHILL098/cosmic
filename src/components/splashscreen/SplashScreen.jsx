import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white px-[5%] md:px-[10%] lg:px-[15%]">
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden" style={{opacity: 1}}></div>
      
      <div className="flex flex-col min-h-screen" style={{opacity: 0}}>
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center space-y-4 py-12 md:py-24 lg:py-32 border-b border-zinc-800 -mx-[5%] md:-mx-[10%] lg:-mx-[15%] px-[5%] md:px-[10%] lg:px-[15%] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.15),rgba(0,0,0,0)_50%)]"></div>
          
          <div className="space-y-4 max-w-4xl mx-auto relative z-10" style={{opacity: 0}}>
            <div style={{opacity: 0, transform: 'translateY(20px)'}}>
              <div className="rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 bg-indigo-500/20 text-indigo-500 border border-indigo-500 px-2 py-1 text-xs inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                0 users watching now
              </div>
            </div>
            
            <div className="relative h-[100px] w-full overflow-hidden">
              <div className="relative size-full">
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden video-mask">
                  <video className="w-full h-full object-cover" autoPlay muted loop preload="auto" playsInline>
                    <source src="https://api.lunaranime.ru/static/intro.mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <span className="sr-only">LUNAR</span>
              </div>
            </div>
            
            <p className="mx-auto max-w-[700px] text-sm text-zinc-400 sm:text-base md:text-lg" style={{opacity: 0, transform: 'translateY(20px)'}}>
              Your Ultimate Anime Streaming Platform
            </p>
            <p className="mx-auto max-w-[700px] text-xs text-zinc-500 sm:text-sm" style={{opacity: 0, transform: 'translateY(20px)'}}>
              Thousands of anime series and movies in English and German
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row" style={{opacity: 0, transform: 'translateY(20px)'}}>
            <button className="btn-primary">
              <div className="flex items-center" tabIndex="0">Start Watching</div>
            </button>
            <button className="btn-secondary">
              <div className="flex items-center" tabIndex="0">Discord</div>
            </button>
          </div>
          
          <div className="w-full max-w-5xl mt-12 rounded-lg overflow-hidden border border-zinc-800 relative z-10" style={{opacity: 0, transform: 'translateY(40px)'}}>
            <div className="bg-zinc-900 flex items-center px-4 py-2 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              </div>
              <div className="flex-1 mx-auto max-w-md">
                <div className="bg-zinc-800 rounded-md px-3 py-1 text-xs text-zinc-400 flex items-center justify-center">
                  https://lunar.animes
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 p-4">
              <img 
                alt="Lunar Animes Interface" 
                loading="lazy" 
                width="2190" 
                height="1080" 
                decoding="async" 
                className="w-full rounded border border-zinc-800" 
                srcSet="/_next/image?url=https%3A%2F%2Fi.imgur.com%2FJp9w4wF.png&amp;w=3840&amp;q=75 1x" 
                src="_next/Jp9w4wF0add.png?url=https%3A%2F%2Fi.imgur.com%2FJp9w4wF.png&amp;w=3840&amp;q=75" 
              />
            </div>
          </div>
        </section>

        {/* Anime Marquee */}
        <div className="py-3 -mx-[5%] md:-mx-[10%] lg:-mx-[15%] px-[5%] md:px-[10%] lg:px-[15%] overflow-hidden border-b border-gray-800">
          <div className="marquee-container">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="marquee-track">
                <AnimeList />
              </div>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <section id="overview" className="container mx-auto max-w-7xl space-y-6 py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center" style={{opacity: 0, transform: 'translateY(20px)'}}>
            <h2 className="section-title">
              <span className="highlight">Overview</span>
            </h2>
            <p className="section-subtitle">Everything you need for your perfect anime experience</p>
          </div>
          
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3" style={{opacity: 0}}>
            <OverviewCard 
              badge="Popular"
              icon="library"
              title="Massive Library"
              description="Explore thousands of anime from every genre and era"
            />
            <OverviewCard 
              badge="International"
              icon="globe"
              title="Global Content"
              description="Access anime from Japan, with English and German localization"
            />
            <OverviewCard 
              badge="Essential"
              icon="heart"
              title="Favorites List"
              description="Create your personal watchlist of favorite anime series"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-zinc-800 bg-zinc-950/50 -mx-[5%] md:-mx-[10%] lg:-mx-[15%] px-[5%] md:px-[10%] lg:px-[15%]">
          <div className="container mx-auto max-w-7xl space-y-6 py-12 md:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center" style={{opacity: 0}}>
              <h2 className="section-title">
                Our <span className="text-indigo-500">Features</span>
              </h2>
              <p className="section-subtitle">Everything you need for the ultimate anime experience</p>
            </div>
            
            <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3" style={{opacity: 0}}>
              <FeatureCard 
                title="Social Features"
                subtitle="Connect with other anime fans"
                features={[
                  "Watch Together - Synchronized viewing with friends",
                  "Live Time Chatbox - Chat while watching",
                  "Comment Section - With GIF, timestamp, replies & mentions support",
                  "Notifications - Stay updated on replies and mentions",
                  "Community Events - Join watch parties and discussions"
                ]}
              />
              
              <FeatureCard 
                title="Personalization"
                subtitle="Make your experience unique"
                features={[
                  "Profile Customization - Picture, banner & name",
                  "Avatar Decoration - Show off your style",
                  "Leveling Up - Earn XP by watching and engaging",
                  "Save Subtitle Preference - Remember your language settings",
                  "Easily change between providers - Switch seamlessly"
                ]}
              />
              
              <FeatureCard 
                title="Technical Features"
                subtitle="Advanced tools for anime lovers"
                features={[
                  "Torrent Streamer - Stream directly from torrents",
                  "Clip Anime - Create and share your favorite moments",
                  "Multi-language Support - Subtitles in various languages",
                  "High Quality Streaming - Up to 4K resolution",
                  "Quests - Earn exclusive avatar decoration by doing quests"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="border-t border-zinc-800 -mx-[5%] md:-mx-[10%] lg:-mx-[15%] px-[5%] md:px-[10%] lg:px-[15%]">
          <div className="container mx-auto max-w-7xl space-y-6 py-12 md:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center" style={{opacity: 0}}>
              <h2 className="section-title">
                Why Choose <span className="text-indigo-500">Lunar</span>?
              </h2>
              <p className="section-subtitle">The best anime streaming platform available</p>
            </div>
            
            <div className="grid w-full auto-rows-[22rem] grid-cols-3 gap-4">
              <Card 
                title="Extensive Anime Library"
                description="Access thousands of anime titles from every genre imaginable."
                icon="document"
              />
              
              <Card 
                title="Anime Notifications"
                description="Get notified when new episodes of your favorite anime are released."
                icon="bell"
                large
              />
              
              <Card 
                title="Cross-Device Sync"
                description="Continue watching from where you left off on any device."
                icon="share"
                large
              />
              
              <Card 
                title="Release Calendar"
                description="Never miss a new episode with our integrated calendar."
                icon="calendar"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper Components
const AnimeList = () => {
  const animes = [
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
    <div className="flex items-center gap-8 w-full">
      {animes.map((anime, index) => (
        <div key={index} className="flex items-center gap-4 whitespace-nowrap mx-2">
          <span className="text-sm font-medium">{anime}</span>
          <span className="h-4 w-[1px] bg-gray-700"></span>
        </div>
      ))}
    </div>
  );
};

const OverviewCard = ({ badge, icon, title, description }) => {
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'library':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library h-12 w-12 text-indigo-500" aria-hidden="true">
            <path d="m16 6 4 14"></path>
            <path d="M12 6v14"></path>
            <path d="M8 8v12"></path>
            <path d="M4 4v16"></path>
          </svg>
        );
      case 'globe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe h-12 w-12 text-indigo-500" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
        );
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-12 w-12 text-indigo-500" aria-hidden="true">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Popular': return 'bg-indigo-500/20 text-indigo-500 border-indigo-500';
      case 'International': return 'bg-indigo-400/20 text-indigo-400 border-indigo-400';
      case 'Essential': return 'bg-indigo-600/20 text-indigo-600 border-indigo-600';
      default: return 'bg-indigo-500/20 text-indigo-500 border-indigo-500';
    }
  };

  return (
    <div style={{opacity: 0, transform: 'translateY(20px)'}}>
      <div className="overview-card">
        <span className="absolute top-2 right-2">
          <div className={`badge ${getBadgeColor(badge)}`}>{badge}</div>
        </span>
        <div className="flex flex-col items-center space-y-4">
          <div>{getIcon(icon)}</div>
          <div className="space-y-2 text-center">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, subtitle, features }) => (
  <div className="flex" style={{opacity: 0, transform: 'translateY(20px)'}}>
    <div className="feature-card">
      <div className="p-6 flex flex-col h-full">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-subtitle">{subtitle}</p>
        <ul className="feature-list">
          {features.map((feature, index) => (
            <li key={index} className="feature-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="0.00024" width="24" height="24" className="feature-icon">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 13.1448 2.95764 14.2397 3.33685 15.25H12.8489C10.1562 14.1916 8.25 11.5684 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157ZM18.1508 15.25H20.6631C20.9324 14.5327 21.1151 13.7727 21.1985 12.9825C20.4085 13.9854 19.359 14.7751 18.1508 15.25ZM22.2375 15.2884C22.5704 14.2513 22.75 13.1461 22.75 12C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 13.1461 1.4296 14.2513 1.76248 15.2884C1.46468 15.3877 1.25 15.6688 1.25 16C1.25 16.4142 1.58579 16.75 2 16.75H22C22.4142 16.75 22.75 16.4142 22.75 16C22.75 15.6688 22.5353 15.3877 22.2375 15.2884ZM4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19ZM7.25 22C7.25 21.5858 7.58579 21.25 8 21.25H16C16.4142 21.25 16.75 21.5858 16.75 22C16.75 22.4142 16.4142 22.75 16 22.75H8C7.58579 22.75 7.25 22.4142 7.25 22Z" fill="currentColor"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M20.3655 2.12433C20.0384 1.29189 18.8624 1.29189 18.5353 2.12433L18.1073 3.21354L17.0227 3.6429C16.1933 3.97121 16.1933 5.14713 17.0227 5.47544L18.1073 5.90481L18.5353 6.99401C18.8624 7.82645 20.0384 7.82646 20.3655 6.99402L20.7935 5.90481L21.8781 5.47544C22.7075 5.14714 22.7075 3.97121 21.8781 3.6429L20.7935 3.21354L20.3655 2.12433ZM19.4504 2.52989L19.8651 3.58533C19.9648 3.83891 20.165 4.04027 20.4188 4.14073L21.4759 4.55917L20.4188 4.97762C20.165 5.07808 19.9648 5.27943 19.8651 5.53301L19.4504 6.58846L19.0357 5.53301C18.936 5.27943 18.7358 5.07808 18.482 4.97762L17.4249 4.55917L18.482 4.14073C18.7358 4.04027 18.936 3.83891 19.0357 3.58533L19.4504 2.52989ZM16.4981 7.94681C16.171 7.11437 14.9951 7.11437 14.668 7.94681L14.5134 8.34008L14.1222 8.49497C13.2928 8.82328 13.2928 9.9992 14.1222 10.3275L14.5134 10.4824L14.668 10.8757C14.9951 11.7081 16.171 11.7081 16.4981 10.8757L16.6527 10.4824L17.0439 10.3275C17.8733 9.9992 17.8733 8.82328 17.0439 8.49497L16.6527 8.34008L16.4981 7.94681ZM15.583 8.35237L15.7243 8.71188C15.824 8.96545 16.0242 9.16681 16.278 9.26727L16.6417 9.41124L16.278 9.55521C16.0242 9.65567 15.824 9.85703 15.7243 10.1106L15.583 10.4701L15.4418 10.1106C15.3421 9.85703 15.1419 9.65567 14.8881 9.55521L14.5244 9.41124L14.8881 9.26727C15.1419 9.16681 15.3421 8.96545 15.4418 8.71188L15.583 8.35237Z" fill="currentColor"></path>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const Card = ({ title, description, icon, large = false }) => {
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'document':
        return (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75">
            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        );
      case 'bell':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" aria-hidden="true">
            <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
          </svg>
        );
      case 'share':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" aria-hidden="true">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
          </svg>
        );
      case 'calendar':
        return (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75">
            <path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`card group relative flex flex-col justify-between overflow-hidden rounded-xl ${large ? 'col-span-3 lg:col-span-2' : 'col-span-3 lg:col-span-1'}`}>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        {getIcon(icon)}
        <h3 className="card-heading">{title}</h3>
        <p className="card-text">{description}</p>
      </div>
      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <a href="#" className="card-link">
          Learn More
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 h-4 w-4 rtl:rotate-180">
            <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </a>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10"></div>
    </div>
  );
};

export default App;
