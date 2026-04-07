import website_name from "@/src/config/website.js";
import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";

const DiscordSVG = () => (
  <svg width={18} height={18} viewBox="0 0 71 55" fill="currentColor">
    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
  </svg>
);

export default function Contact() {
  const { user } = useAuth();
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) { setError("Please fill in all required fields."); return; }
    setLoading(true); setError("");
    try {
      const { error: err } = await supabase.from("contact_messages").insert({
        name, email, subject, message,
        user_id: user?.id || null,
        created_at: new Date().toISOString(),
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send. Try Discord instead.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 14,
    outline: "none",
    width: "100%",
    padding: "10px 14px",
    transition: "border-color 0.2s",
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#000", color: "#fff" }}>
      <div className="max-w-3xl mx-auto px-4 pt-24">
        <div className="mb-10">
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Support</p>
          <h1 className="text-3xl font-black font-mono tracking-tighter text-white">Contact Us</h1>
          <p className="text-white/30 text-sm mt-2 font-mono">Get in touch with the {website_name} team</p>
        </div>

        <div className="grid md:grid-cols-[1fr,220px] gap-4">

          {/* Form */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {sent ? (
              <div className="flex flex-col items-center text-center gap-4 py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Check className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold mb-1">Message sent</h3>
                  <p className="text-white/35 font-mono text-xs">We'll get back to you soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white/30" /> Send a Message
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Email *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Subject</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's this about?"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Message *</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                    placeholder="Describe your issue or question..."
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-400"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 8, padding: "8px 12px" }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-sm font-semibold transition-all"
                  style={{ background: "#fff", color: "#000", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading
                    ? <div className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Quick Links</p>
              <a href="https://discord.com/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                <DiscordSVG />
                <div>
                  <p className="text-xs font-mono text-white/70 font-semibold">Discord</p>
                  <p className="text-[10px] font-mono text-white/25">Join our server</p>
                </div>
              </a>
            </div>

            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Response Time</p>
              <p className="text-xs font-mono text-white/40 leading-relaxed">We typically respond within 24–48 hours.</p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">DMCA</p>
              <p className="text-xs font-mono text-white/40 leading-relaxed">
                For copyright issues, see our{" "}
                <a href="/dmca" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors">DMCA page</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
