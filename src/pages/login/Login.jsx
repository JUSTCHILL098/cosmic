import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { useAniList } from "@/src/context/AniListContext";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X, Link2 } from "lucide-react";

const pwChecks = (pw) => [
  { label: "8+ characters",    pass: pw.length >= 8 },
  { label: "Uppercase letter", pass: /[A-Z]/.test(pw) },
  { label: "Number",           pass: /\d/.test(pw) },
  { label: "Special char",     pass: /[^A-Za-z0-9]/.test(pw) },
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const list  = pwChecks(password);
  const score = list.filter(c => c.pass).length;
  const bar   = ["#ef4444","#f97316","#eab308","#22c55e"][score - 1] || "#333";
  const lbl   = ["Weak","Fair","Good","Strong"][score - 1] || "";
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? bar : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {score > 0 && <span className="text-[10px] font-mono" style={{ color: bar }}>{lbl}</span>}
        <div className="flex gap-3 ml-auto">
          {list.map(c => (
            <span key={c.label} className="flex items-center gap-1 text-[10px] font-mono"
              style={{ color: c.pass ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)" }}>
              {c.pass ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {(label || hint) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-white">{label}</label>}
          {hint}
        </div>
      )}
      {children}
    </div>
  );
}

function Input({ icon: Icon, type = "text", placeholder, value, onChange, right, autoFocus }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus}
        className="w-full py-2.5 text-sm text-white font-mono outline-none transition-colors placeholder:text-white/20"
        style={{
          background: "#000",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          paddingLeft: Icon ? 36 : 12,
          paddingRight: right ? 36 : 12,
        }}
        onFocus={e  => e.target.style.borderColor = "rgba(255,255,255,0.5)"}
        onBlur={e   => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
      />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { login: alLogin } = useAniList();
  const [mode,      setMode]      = useState("login");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [username,  setUsername]  = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [checkMail, setCheckMail] = useState(false);

  const switchMode = (m) => { setMode(m); setError(""); setCheckMail(false); };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "signup" && !username.trim()) { setError("Username is required"); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate("/profile");
      } else {
        const data = await signUp(email, password, username.trim());
        if (data?.user && !data?.session) setCheckMail(true);
        else navigate("/profile");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#000" }}>

      {/* ── LEFT — image panel (hidden on mobile) ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://files.catbox.moe/h9y5ny.webp"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
        />
        {/* overlay text */}
        <div className="absolute inset-0 flex flex-col justify-end p-10"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }}>
          <h2 className="text-white font-black font-mono text-4xl tracking-tighter mb-2">COSMIC</h2>
          <p className="text-white/50 font-mono text-sm">Your complete anime entertainment platform.</p>
        </div>
      </div>

      {/* ── RIGHT — form panel ── */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ width: "min(100%, 360px)", paddingTop: "2rem", paddingBottom: "2rem" }}
        >
          <AnimatePresence mode="wait">
            {checkMail ? (
              <motion.div key="mail" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center text-center gap-5">
                <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg mb-1">Check your inbox</h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Confirmation sent to <span className="text-white/70">{email}</span>
                  </p>
                </div>
                <button onClick={() => switchMode("login")}
                  className="text-xs text-white/40 hover:text-white transition-colors font-mono">
                  ← Back to sign in
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col gap-4">

                {/* Header */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold text-white">
                    {mode === "login" ? "Login to your account" : "Create an account"}
                  </h1>
                  <p className="text-sm text-white/40">
                    {mode === "login"
                      ? "Enter your email below to login"
                      : "Fill in the details below to get started"}
                  </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4">
                  <AnimatePresence>
                    {mode === "signup" && (
                      <motion.div key="uname"
                        initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                        exit={{ opacity:0, height:0 }} style={{ overflow:"hidden" }}>
                        <Field label="Username">
                          <Input icon={User} placeholder="your_username" value={username}
                            onChange={e => setUsername(e.target.value)} autoFocus />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Field label="Email">
                    <Input icon={Mail} type="email" placeholder="m@example.com" value={email}
                      onChange={e => setEmail(e.target.value)} />
                  </Field>

                  <Field
                    label="Password"
                    hint={mode === "login" && (
                      <a href="#" className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4">
                        Forgot password?
                      </a>
                    )}
                  >
                    <Input
                      icon={Lock}
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      right={
                        <button type="button" onClick={() => setShowPw(v => !v)}
                          className="text-white/25 hover:text-white/60 transition-colors">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                    {mode === "signup" && <PasswordStrength password={password} />}
                  </Field>

                  {error && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs font-mono text-red-400"
                      style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)" }}>
                      <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {error}
                    </div>
                  )}

                  {/* White submit button */}
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    style={{ background: "#fff", color: "#000", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.88)"; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#fff"; }}
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                      : <>{mode === "login" ? "Login" : "Create Account"} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                {/* Separator */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                  <span className="text-xs text-white/30 font-mono">or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                </div>

                {/* AniList login */}
                <button type="button" onClick={alLogin}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-mono text-sm font-semibold transition-all"
                  style={{ background:"rgba(2,169,132,0.12)", border:"1px solid rgba(2,169,132,0.3)", color:"#02a984" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(2,169,132,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(2,169,132,0.12)"}
                >
                  <Link2 className="w-4 h-4" /> Continue with AniList
                </button>

                {/* Switch mode */}
                <p className="text-center text-sm text-white/40">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                    className="text-white hover:text-white/70 transition-colors underline underline-offset-4">
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>

                <p className="text-center">
                  <Link to="/" className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-mono">← Back to home</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
