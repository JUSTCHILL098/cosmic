import website_name from "@/src/config/website.js";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const REQUIREMENTS = [
  "A description of the copyrighted work you claim is being infringed.",
  "A description of the infringing material and its URL or location on the site.",
  "Your name, title (if acting as agent), address, phone number, and email address.",
  'The statement: "I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law."',
  'The statement: "The information in this notice is accurate and, under penalty of perjury, I am the owner or authorized to act on behalf of the owner of the copyright or exclusive right allegedly infringed."',
  "An electronic or physical signature of the copyright owner or authorized person.",
];

export default function DMCA() {
  return (
    <div className="min-h-screen pb-24" style={{ background: "#000", color: "#fff" }}>
      <div className="max-w-3xl mx-auto px-4 pt-24">
        <div className="mb-10">
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-black font-mono tracking-tighter text-white">DMCA Policy</h1>
          <p className="text-white/30 text-sm mt-2 font-mono">Digital Millennium Copyright Act</p>
        </div>

        {/* Intro */}
        <div className="p-5 rounded-xl mb-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm text-white/45 leading-relaxed font-mono">
            {website_name} respects the intellectual property rights of others. If you believe content on this site infringes your copyright, please submit a DMCA takedown request via our contact page. We will review and take appropriate action, including removal of the content.
          </p>
        </div>

        {/* Requirements */}
        <div className="p-5 rounded-xl mb-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-white/40" /> DMCA Report Requirements
          </h2>
          <div className="flex flex-col gap-3">
            {REQUIREMENTS.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-white/25 mt-0.5 flex-shrink-0 w-5">{i + 1}.</span>
                <p className="text-sm text-white/45 leading-relaxed font-mono">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="p-5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold text-white font-mono mb-3">Submit a Request</h2>
          <p className="text-sm text-white/45 font-mono leading-relaxed">
            Send your DMCA takedown request via our{" "}
            <Link to="/contact" className="text-white/70 hover:text-white underline underline-offset-4 transition-colors">
              Contact page
            </Link>
            . We will review and respond promptly.
          </p>
        </div>
      </div>
    </div>
  );
}
