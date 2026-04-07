import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HomeInfoProvider } from "./context/HomeInfoContext";
import { MultiplayerProvider } from "./context/MultiplayerContext";
import { MaintenanceProvider, useMaintenance } from "./context/MaintenanceContext";
import { AuthProvider } from "./context/AuthContext";
import { AniListProvider } from "./context/AniListContext";
import Home from "./pages/Home/Home";
import AnimeInfo from "./pages/animeInfo/AnimeInfo";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Error from "./components/error/Error";
import Category from "./pages/category/Category";
import AtoZ from "./pages/a2z/AtoZ";
import { azRoute, categoryRoutes } from "./utils/category.utils";
import "./App.css";
import Search from "./pages/search/Search";
import Watch from "./pages/watch/Watch";
import Producer from "./components/producer/Producer";
import SplashScreen from "./components/splashscreen/SplashScreen";
import Terms from "./pages/terms/Terms";
import DMCA from "./pages/dmca/DMCA";
import Contact from "./pages/contact/Contact";
import BottomNav from "./components/bottomnav/BottomNav";
import MaintenanceScreen from "./components/maintenance/MaintenanceScreen";
import AdminPage from "./pages/admin/AdminPage";
import { useDevToolsDetect } from "./hooks/useDevToolsDetect";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Users from "./pages/users/Users";
import About from "./pages/about/About";
import Manga from "./pages/manga/Manga";
import MangaDetail from "./pages/manga/MangaDetail";
import MangaReader from "./pages/manga/MangaReader";
import Movies from "./pages/movies/Movies";
import MovieDetail from "./pages/movies/MovieDetail";
import AniListCallback from "./pages/auth/AniListCallback";

function AppInner() {
  const location = useLocation();
  const { maintenance, isAdmin } = useMaintenance();
  useDevToolsDetect();

  useEffect(() => { window.scrollTo(0, 0); }, [location]);

  const isSplashScreen = location.pathname === "/";

  // Show maintenance screen to non-admins (but always allow /admin)
  if (maintenance && !isAdmin && location.pathname !== "/admin") return <MaintenanceScreen />;

  return (
    <div className={`app-container ${isSplashScreen ? '' : 'px-4 lg:px-10'}`}>
      <main className="content max-w-[2048px] mx-auto w-full">
        {!isSplashScreen && <Navbar />}
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/random" element={<AnimeInfo random={true} />} />
          <Route path="/404-not-found-page" element={<Error error="404" />} />
          <Route path="/error-page" element={<Error />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/producer/:id" element={<Producer />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/manga/:id/chapter/:chapterID" element={<MangaReader />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/auth/anilist" element={<AniListCallback />} />
          {categoryRoutes.map((path) => (
            <Route key={path} path={`/${path}`} element={<Category path={path} label={path.split("-").join(" ")} />} />
          ))}
          {azRoute.map((path) => (
            <Route key={path} path={`/${path}`} element={<AtoZ path={path} />} />
          ))}
          <Route path="/:id" element={<AnimeInfo />} />
          <Route path="*" element={<Error error="404" />} />
        </Routes>
        {!isSplashScreen && <Footer />}
      </main>
      <BottomNav />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <MaintenanceProvider>
      <AuthProvider>
        <AniListProvider>
          <HomeInfoProvider>
            <MultiplayerProvider>
              <AppInner />
            </MultiplayerProvider>
          </HomeInfoProvider>
        </AniListProvider>
      </AuthProvider>
    </MaintenanceProvider>
  );
}

export default App;

