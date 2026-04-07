import website_name from "@/src/config/website.js";

const SECTIONS = [
  {
    title: "1. Terms",
    body: `By accessing this website you agree to be bound by these Terms and Conditions and are responsible for compliance with applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. All materials on this site are protected by copyright and trademark law.`,
  },
  {
    title: "2. Use License",
    body: `Permission is granted to temporarily download one copy of the materials on ${website_name}'s website for personal, non-commercial transitory viewing only. Under this license you may not: modify or copy the materials; use them for any commercial purpose; attempt to reverse-engineer any software; remove any copyright notations; or transfer the materials to another person or mirror them on any other server. This license terminates automatically upon any violation.`,
  },
  {
    title: "3. Disclaimer",
    body: `All materials on ${website_name}'s website are provided "as is". ${website_name} makes no warranties, expressed or implied, and hereby disclaims all other warranties. ${website_name} does not make any representations concerning the accuracy or reliability of the materials on its website.`,
  },
  {
    title: "4. Limitations",
    body: `${website_name} or its suppliers will not be held accountable for any damages arising from the use or inability to use the materials on this website, even if ${website_name} or an authorized representative has been notified of the possibility of such damage.`,
  },
  {
    title: "5. Revisions and Errata",
    body: `The materials on ${website_name}'s website may include technical, typographical, or photographic errors. ${website_name} may change the materials at any time without notice and does not commit to keeping them current.`,
  },
  {
    title: "6. Links",
    body: `${website_name} has not reviewed all linked sites and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement. Use of any linked website is at the user's own risk.`,
  },
  {
    title: "7. Governing Law",
    body: `Any claim related to ${website_name}'s website shall be governed by applicable laws without regard to conflict of law provisions.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen pb-24" style={{ background: "#000", color: "#fff" }}>
      <div className="max-w-3xl mx-auto px-4 pt-24">
        <div className="mb-10">
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-black font-mono tracking-tighter text-white">Terms of Service</h1>
          <p className="text-white/30 text-sm mt-2 font-mono">Last updated: 2025</p>
        </div>

        <div className="flex flex-col gap-4">
          {SECTIONS.map((s, i) => (
            <div key={i} className="p-5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-bold text-white font-mono mb-3">{s.title}</h2>
              <p className="text-sm text-white/45 leading-relaxed font-mono">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
