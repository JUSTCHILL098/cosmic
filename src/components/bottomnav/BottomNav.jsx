import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, RotateCw, House,
  Search, Settings, X, Shuffle, ChevronRight,
  Moon, FileText, Mail, Shield, Info, Flame, User, LogIn,
  Compass, Tv, Film, BookOpen,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/components/ui/sheet';
import { AnimatePresence, motion } from 'framer-motion';
import getSearch from '@/src/utils/getSearch.utils';
import { useAuth } from '@/src/context/AuthContext';

const SETTINGS_LINKS = [
  { icon: House,    label: 'Home',             path: '/home' },
  { icon: Shuffle,  label: 'Random Anime',     path: '/random' },
  { icon: Flame,    label: 'Most Popular',     path: '/most-popular' },
  { icon: Moon,     label: 'Top Upcoming',     path: '/top-upcoming' },
  { icon: FileText, label: 'Terms of Service', path: '/terms-of-service' },
  { icon: Shield,   label: 'DMCA',             path: '/dmca' },
  { icon: Mail,     label: 'Contact',          path: '/contact' },
  { icon: Info,     label: 'About',            path: '/about' },
];

const SearchModal = ({ onClose, navigate }) => {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getSearch(query.trim(), 1);
        setResults(data?.data?.slice(0, 8) || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const submit = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    navigate(`/search?keyword=${encodeURIComponent(q)}`);
    onClose();
  }, [query, navigate, onClose]);

  const goTo = (path) => { navigate(path); onClose(); };
  const onKey = (e) => { if (e.key === 'Enter') submit(); };

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 2147483646,
        }}
      />
      {/* Modal — dead centre via margin auto trick */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2147483647,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{ width: 'min(94vw, 620px)', pointerEvents: 'all' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <Search className="w-5 h-5 text-white/30 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search anime, movies, OVAs..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKey}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 text-base font-mono outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors ml-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-10">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                </div>
              )}
              {!loading && results.length > 0 && (
                <div className="p-2">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-3 py-2">Results</p>
                  {results.map(item => (
                    <button key={item.id} onClick={() => goTo(`/${item.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left group">
                      <img src={item.poster} alt={item.title}
                        className="w-10 h-14 object-cover rounded-md flex-shrink-0 border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate font-mono">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.tvInfo?.sub && <span className="text-[10px] text-zinc-500 font-mono">SUB {item.tvInfo.sub}</span>}
                          {item.tvInfo?.dub && <span className="text-[10px] text-zinc-500 font-mono">DUB {item.tvInfo.dub}</span>}
                          {item.tvInfo?.eps && <span className="text-[10px] text-zinc-500 font-mono">{item.tvInfo.eps} eps</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                  <button onClick={submit}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-white/[0.06] text-xs text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors font-mono text-center">
                    See all results for &quot;{query}&quot; →
                  </button>
                </div>
              )}
              {!loading && query && results.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-white/30 font-mono text-sm">No results for &quot;{query}&quot;</p>
                </div>
              )}
              {!loading && !query && (
                <div className="p-4">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-1 mb-3">Quick Links</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Most Popular',   path: '/most-popular' },
                      { label: 'Recently Added', path: '/recently-added' },
                      { label: 'Top Upcoming',   path: '/top-upcoming' },
                      { label: 'Movies',         path: '/movie' },
                    ].map(({ label, path }) => (
                      <button key={path} onClick={() => goTo(path)}
                        className="px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-sm text-white/60 hover:text-white transition-colors font-mono text-left">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-4">
              <span className="text-[10px] text-white/20 font-mono">↵ to search</span>
              <span className="text-[10px] text-white/20 font-mono">ESC to close</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
};

const BottomNav = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exploreOpen,  setExploreOpen]  = useState(false);
  const exploreRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setSearchOpen(false); setSettingsOpen(false); setExploreOpen(false); }
      if (exploreOpen && exploreRef.current && !exploreRef.current.contains(e.target)) setExploreOpen(false);
    };
    window.addEventListener('keydown', handler);
    document.addEventListener('mousedown', handler);
    return () => { window.removeEventListener('keydown', handler); document.removeEventListener('mousedown', handler); };
  }, [exploreOpen]);

  return (
    <>
      {/* ── FLOATING NAV BAR ── */}
      <div className="fixed bottom-4 z-[99999] left-1/2 -translate-x-1/2">
        <div className="flex h-[54px] w-max items-center gap-0.5 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl px-2 shadow-2xl">
          <Button aria-label="Go Back" variant="ghost" size="icon" className="rounded-xl text-white/60 hover:text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
          </Button>
          <Button aria-label="Forward" variant="ghost" size="icon" className="rounded-xl text-white/60 hover:text-white hover:bg-white/10" onClick={() => navigate(1)}>
            <ArrowRight className="size-4" />
          </Button>
          <Button aria-label="Reload" variant="ghost" size="icon" className="rounded-xl text-white/60 hover:text-white hover:bg-white/10" onClick={() => window.location.reload()}>
            <RotateCw className="size-4" />
          </Button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <Button aria-label="Home" variant="ghost" size="icon" className="rounded-xl text-white/60 hover:text-white hover:bg-white/10" onClick={() => navigate('/home')}>
            <House className="size-4" />
          </Button>
          {/* Explore */}
          <div className="relative" ref={exploreRef}>
            <Button
              aria-label="Explore" variant="ghost" size="icon"
              className={`rounded-xl transition-colors ${exploreOpen ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              onClick={() => { setExploreOpen(v => !v); setSearchOpen(false); setSettingsOpen(false); }}
            >
              <Compass className="size-4" />
            </Button>
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity:0, y:8, scale:0.96 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:8, scale:0.96 }}
                  transition={{ duration:0.15 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2"
                  style={{ zIndex: 99999, width: 180 }}
                >
                  <div style={{ background:'#0a0a0a', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, overflow:'hidden', boxShadow:'0 16px 40px rgba(0,0,0,0.8)' }}>
                    <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest px-4 pt-3 pb-1">Browse</p>
                    {[
                      { icon: Tv,       label: 'Anime',  path: '/home' },
                      { icon: Film,     label: 'Movies', path: '/movies' },
                      { icon: BookOpen, label: 'Manga',  path: '/manga' },
                    ].map(({ icon: Icon, label, path }) => (
                      <button key={label} onClick={() => { navigate(path); setExploreOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors text-left">
                        <Icon className="w-3.5 h-3.5 text-white/30" />
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            aria-label="Search" variant="ghost" size="icon"
            className={`rounded-xl transition-colors ${searchOpen ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            onClick={() => { setSearchOpen(v => !v); setSettingsOpen(false); }}
          >
            <Search className="size-4" />
          </Button>
          <Button
            aria-label="Settings" variant="ghost" size="icon"
            className={`rounded-xl transition-colors ${settingsOpen ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            onClick={() => { setSettingsOpen(true); setSearchOpen(false); }}
          >
            <Settings className="size-4" />
          </Button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          {/* Auth button */}
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-8 h-8 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              aria-label="Profile"
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center">
                    <User className="size-3.5 text-indigo-300" />
                  </div>}
            </button>
          ) : (
            <Button
              aria-label="Sign In" variant="ghost" size="icon"
              className="rounded-xl text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              <LogIn className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── SEARCH MODAL (portal → dead centre) ── */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal onClose={() => setSearchOpen(false)} navigate={navigate} />
        )}
      </AnimatePresence>

      {/* ── SETTINGS SHEET ── */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="w-[300px] bg-[#0a0a0a] border-l border-white/10 backdrop-blur-xl p-0 flex flex-col">
          <SheetHeader className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
            <SheetTitle className="text-white font-mono text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-white/40" /> Navigation
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
            {SETTINGS_LINKS.map(({ icon: Icon, label, path }) => (
              <button key={label} onClick={() => { navigate(path); setSettingsOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.06] transition-all text-left group w-full">
                <Icon className="w-4 h-4 text-white/30 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors font-mono">{label}</span>
              </button>
            ))}
            {/* Admin Panel link */}
            <div className="my-2 border-t border-white/[0.06]" />
            <button onClick={() => { navigate('/admin'); setSettingsOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-500/10 transition-all text-left group w-full">
              <Shield className="w-4 h-4 text-indigo-500/50 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
              <span className="text-sm text-white/40 group-hover:text-indigo-300 transition-colors font-mono">Admin Panel</span>
            </button>
          </div>
          <div className="p-4 border-t border-white/[0.06] flex flex-col gap-2">
            <Button variant="ghost" className="w-full rounded-xl border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.06] font-mono text-xs h-10 justify-start"
              onClick={() => { navigate(-1); setSettingsOpen(false); }}>
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Go Back
            </Button>
            <Button variant="ghost" className="w-full rounded-xl border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.06] font-mono text-xs h-10 justify-start"
              onClick={() => window.location.reload()}>
              <RotateCw className="w-3.5 h-3.5 mr-2" /> Reload Page
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNav;
