import { useState } from "react";
import HeroBanner from "./components/HeroBanner.jsx";

// ── TOOL DATA ─────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "power-score",
    name: "POWER Score",
    desc: "Share your URL and get a free competitive analysis across five dimensions — Prestige, Origin, Wow, Expertise, Reputation.",
    type: "pov",
    typeLabel: "POV",
    status: "live",
    url: "https://power-score.vercel.app/",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Power-Score-Hero-Image-300x157.png",
    date: "2026-03-01",
  },
  {
    id: "creative-industries",
    name: "Creative Industries Scorecard",
    desc: "Measure the economic impact of your state's creative industries against the national average. 50M+ jobs, 2× U.S. growth rate.",
    type: "data",
    typeLabel: "Data & Econ Dev",
    status: "live",
    url: "https://creative-industries.vercel.app/",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Creative-Industries-App-Cover-300x180.png",
    date: "2026-04-01",
  },
  {
    id: "nm-visitor-spending",
    name: "New Mexico Visitor Spending",
    desc: "42M visitors. Nearly $9B in spending. Explore how New Mexico tourism dollars flow through the state economy.",
    type: "data",
    typeLabel: "Data & Econ Dev",
    status: "live",
    url: "https://monicapoling.com/wp-content/uploads/apps/nmtrue/nm-visitor-spend.html",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/New-Mexico-Visitor-Spending-App-Cover-300x180.png",
    date: "2026-03-15",
  },
  {
    id: "wheels-quiz",
    name: "WHEELS Museum History Quiz",
    desc: "How well do you know Albuquerque's railroad and Route 66 story? 10 questions, each tied to a WHEELS Museum exhibit.",
    type: "quiz",
    typeLabel: "Quiz",
    status: "live",
    url: "https://monicapoling.com/wheels",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Wheels-Museum-App-Cover-300x180.png",
    date: "2026-04-05",
  },
  {
    id: "color-palette",
    name: "Color Palette Generator",
    desc: "Search any Pixabay image, pick the one that matches your brand mood, and generate an instant color palette.",
    type: "generator",
    typeLabel: "Generator",
    status: "live",
    url: "https://color-palette-dot.vercel.app/",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/color-palette-og-300x157.png",
    date: "2026-04-10",
  },
  {
    id: "shark-tank",
    name: "Shark Tank Explorer",
    desc: "Dive into the Shark Tank data. Match your business to the right shark and explore deal patterns.",
    type: "data",
    typeLabel: "Data & Econ Dev",
    status: "progress",
    url: "https://monicapoling.com/wp-content/uploads/apps/sharks/shark-tank-explorer.html",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Shark-Tank-App-Hero-Image.png",
    date: "2026-01-01",
  },
  {
    id: "community-builder",
    name: "Map Your Community",
    desc: "Zip-based community intelligence scorecard. Data-driven indicators, narrative, and action columns for EDOs and chambers.",
    type: "data",
    typeLabel: "Data & Econ Dev",
    status: "progress",
    url: "https://monicapoling.com/wp-content/uploads/apps/community/barelas-scorecard.html",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Map-Your-Community-App-Hero.png",
    date: "2026-01-02",
  },
  {
    id: "enchanted-artists",
    name: "Meet the Enchanted Artists",
    desc: "A searchable directory of New Mexico book artists — 68+ makers, Google Sheets backend, Cloudinary images.",
    type: "generator",
    typeLabel: "Generator",
    status: "progress",
    url: "https://monicapoling.com/wp-content/uploads/apps/book-arts/enchanted-artists.html",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Enchanted-Artists-OG.png",
    date: "2026-01-03",
  },
];

TOOLS.sort((a, b) => new Date(b.date) - new Date(a.date));

const TYPE_FILTERS = [
  { key: "all",       label: "All Tools",      desc: "Every tool in the library" },
  { key: "data",      label: "Data & Econ Dev", desc: "Economic & data intelligence" },
  { key: "quiz",      label: "Quiz & Trivia",   desc: "Test your knowledge" },
  { key: "generator", label: "Directories",     desc: "Search & explore" },
];

// ── DOT ICON SVG (bubble-gradient style from current home page) ───────────────
function DotIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#111110" rx="8"/>
      <circle cx="32" cy="6"  r="2"   fill="#ffffff" opacity="0.18"/>
      <circle cx="26" cy="13" r="2.5" fill="#ffffff" opacity="0.22"/>
      <circle cx="37" cy="15" r="2"   fill="#ffffff" opacity="0.18"/>
      <circle cx="31" cy="20" r="3"   fill="#ffffff" opacity="0.28"/>
      <circle cx="41" cy="19" r="2"   fill="#ffffff" opacity="0.18"/>
      <circle cx="22" cy="19" r="2"   fill="#ffffff" opacity="0.2"/>
      <circle cx="18" cy="27" r="3"   fill="#ffffff" opacity="0.42"/>
      <circle cx="28" cy="24" r="3.5" fill="#ffffff" opacity="0.5"/>
      <circle cx="38" cy="25" r="3"   fill="#ffffff" opacity="0.45"/>
      <circle cx="46" cy="28" r="2.5" fill="#ffffff" opacity="0.35"/>
      <circle cx="15" cy="35" r="3.5" fill="#ffffff" opacity="0.45"/>
      <circle cx="25" cy="31" r="4"   fill="#ffffff" opacity="0.52"/>
      <circle cx="35" cy="30" r="4"   fill="#861442" opacity="0.42"/>
      <circle cx="45" cy="33" r="3.5" fill="#861442" opacity="0.38"/>
      <circle cx="51" cy="38" r="2.5" fill="#861442" opacity="0.28"/>
      <circle cx="14" cy="43" r="4"   fill="#861442" opacity="0.55"/>
      <circle cx="24" cy="39" r="5"   fill="#861442" opacity="0.7"/>
      <circle cx="34" cy="38" r="5.5" fill="#861442" opacity="0.82"/>
      <circle cx="44" cy="40" r="4.5" fill="#861442" opacity="0.72"/>
      <circle cx="52" cy="45" r="3"   fill="#861442" opacity="0.45"/>
      <circle cx="18" cy="51" r="4.5" fill="#861442" opacity="0.88"/>
      <circle cx="28" cy="47" r="5.5" fill="#861442" opacity="1"/>
      <circle cx="38" cy="46" r="6"   fill="#861442" opacity="1"/>
      <circle cx="48" cy="49" r="4.5" fill="#861442" opacity="0.9"/>
      <circle cx="23" cy="58" r="4"   fill="#861442" opacity="0.85"/>
      <circle cx="33" cy="56" r="5"   fill="#861442" opacity="1"/>
      <circle cx="43" cy="57" r="4"   fill="#861442" opacity="0.78"/>
    </svg>
  );
}

// ── KOT LOGO (C-variant) ──────────────────────────────────────────────────────
function KotLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
      <rect x="0"  y="0"  width="24" height="24" fill="#861442"/>
      <rect x="30" y="0"  width="24" height="24" fill="#ffffff" opacity="0.6"/>
      <rect x="0"  y="30" width="24" height="24" fill="#ffffff" opacity="0.25"/>
      <rect x="30" y="30" width="24" height="24" fill="#861442" opacity="0.25"/>
    </svg>
  );
}

// ── TOOL CARD ─────────────────────────────────────────────────────────────────
function ToolCard({ tool }) {
  const isLive = tool.status === "live";
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="tool-card kot-anim"
    >
      {tool.img ? (
        <img
          className="tool-thumb"
          src={tool.img}
          alt={tool.name}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div className="tool-thumb-placeholder" style={{ display: tool.img ? "none" : "flex" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f0ede8" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      </div>
      <div className="tool-body">
        <div className="tool-meta">
          <span className="badge badge-type">{tool.typeLabel}</span>
          {isLive
            ? <span className="badge badge-live">Live</span>
            : <span className="badge badge-progress">In Progress</span>
          }
        </div>
        <div className="tool-name">{tool.name}</div>
        <div className="tool-desc">{tool.desc}</div>
        <div className="tool-link">View tool →</div>
      </div>
    </a>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeType, setActiveType] = useState("all");
  const [nlFirstName, setNlFirstName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlSubmitted, setNlSubmitted] = useState(false);

  const filtered = activeType === "all"
    ? TOOLS
    : TOOLS.filter((t) => t.type === activeType);

  const handleSubscribe = () => {
    if (!nlEmail.trim()) return;
    setNlSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a18", color: "#f0ede8" }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #1a1a18;
          --surface: #242422;
          --surface2: #2e2e2b;
          --border: rgba(255,255,255,0.08);
          --border2: rgba(255,255,255,0.14);
          --text: #f0ede8;
          --muted: #c8c4bc;
          --dim: #5a5a56;
          --accent: #861442;
          --accent2: #be3650;
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --radius: 10px;
          --inner-max: 860px;
          --px: clamp(16px, 4vw, 2rem);
        }
        body {
          font-family: var(--font-body);
          font-weight: 300;
          background: var(--bg);
          color: var(--text);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kot-anim { animation: fadeUp 0.5s ease both; }

        /* ── BANNER — rendered by HeroBanner.jsx, CSS lives there ── */

        /* ── BANNER END ── */

        /* ── MAIN INNER ── */
        .kot-inner {
          max-width: var(--inner-max);
          margin: 0 auto;
          width: 100%;
          padding: 0 var(--px);
        }

        /* ── SECTION ── */
        .section { padding: 2rem 0 0.5rem; }
        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .section-title {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent2);
        }
        .section-count {
          font-family: var(--font-body);
          font-size: 10px;
          color: var(--dim);
        }
        .section-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 1.5rem 0 0;
        }

        /* ── TYPE FILTER ── */
        .type-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 0.5rem;
        }
        @media (max-width: 600px) { .type-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .type-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 14px 12px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          user-select: none;
        }
        .type-card:hover { border-color: var(--border2); }
        .type-card.active {
          border-color: var(--accent);
          background: rgba(134,20,66,0.12);
        }
        .type-rule {
          height: 2px;
          width: 20px;
          background: var(--accent);
          border-radius: 1px;
          margin-bottom: 10px;
          transition: width 0.2s;
        }
        .type-card.active .type-rule { width: 32px; }
        .type-name {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: #f0ede8;
          margin-bottom: 3px;
        }
        .type-desc {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.4;
        }

        /* ── FEATURED CARD ── */
        .featured-card {
          background: var(--surface);
          border: 1px solid rgba(134,20,66,0.3);
          border-radius: var(--radius);
          overflow: hidden;
          display: flex;
          text-decoration: none;
          transition: border-color 0.15s;
          margin-bottom: 2rem;
        }
        .featured-card:hover { border-color: rgba(134,20,66,0.6); }
        .featured-thumb {
          width: 280px;
          min-height: 160px;
          object-fit: cover;
          flex-shrink: 0;
          display: block;
        }
        .featured-body {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }
        .featured-eyebrow {
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent2);
        }
        .featured-name {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 300;
          color: #fff;
          line-height: 1.2;
        }
        .featured-desc {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.65;
        }
        .featured-link {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          color: var(--accent2);
          letter-spacing: 0.04em;
          margin-top: 4px;
        }
        @media (max-width: 600px) {
          .featured-card { flex-direction: column; }
          .featured-thumb { width: 100%; min-height: 180px; }
        }

        /* ── TOOLS GRID ── */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 3rem;
        }
        @media (max-width: 560px) { .tools-grid { grid-template-columns: 1fr; } }

        /* ── TOOL CARD ── */
        .tool-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          transition: border-color 0.15s;
        }
        .tool-card:hover { border-color: var(--border2); }
        .tool-thumb {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }
        .tool-thumb-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--surface2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tool-body {
          padding: 14px 16px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .tool-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 9px;
        }
        .badge {
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 500;
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: 0.04em;
        }
        .badge-type     { background: rgba(134,20,66,0.2);  color: var(--accent2); border: 1px solid rgba(134,20,66,0.3); }
        .badge-live     { background: rgba(76,175,138,0.12); color: #4caf8a;        border: 1px solid rgba(76,175,138,0.2); }
        .badge-progress { background: rgba(255,200,80,0.1);  color: #d4a84b;        border: 1px solid rgba(255,200,80,0.18); }
        .tool-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 300;
          color: var(--text);
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .tool-desc {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.65;
          flex: 1;
        }
        .tool-link {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          color: var(--accent2);
          margin-top: 12px;
          letter-spacing: 0.04em;
        }

        /* ── NO RESULTS ── */
        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--dim);
          font-size: 13px;
          font-family: var(--font-body);
        }

        /* ── NEWSLETTER ── */
        .nl-zone {
          background: #1a1a18;
          padding: 2rem var(--px);
        }
        .nl-card {
          max-width: var(--inner-max);
          margin: 0 auto;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem 1.75rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .nl-copy { flex: 1; min-width: 200px; }
        .nl-eyebrow {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent2);
          margin-bottom: 6px;
        }
        .nl-body {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.65;
        }
        .nl-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 220px;
          flex: 0 0 260px;
        }
        .nl-field {
          background: #111110;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 9px 12px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 300;
          color: #f0ede8;
          -webkit-text-fill-color: #f0ede8;
          outline: none;
          transition: border-color 0.2s;
        }
        .nl-field:focus { border-color: #861442; }
        .nl-field::placeholder { color: #5a5a56; }
        .btn-primary {
          background: #861442;
          color: #fff;
          border: none;
          border-radius: var(--radius);
          padding: 10px 22px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: opacity 0.15s;
        }
        .btn-primary:hover { opacity: 0.88; }
        .nl-thanks {
          font-family: var(--font-body);
          font-size: 13px;
          color: #4caf8a;
          align-self: center;
        }

        /* ── FOOTER RULE ── */
        .page-footer-rule {
          width: 100%;
          height: 1.5px;
          background: rgba(134,20,66,0.5);
        }

        /* ── FOOTER ── */
        .page-footer {
          background: #111110;
          padding: 2.5rem var(--px) 2rem;
        }
        .footer-inner {
          max-width: var(--inner-max);
          margin: 0 auto;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .footer-brand { display: flex; flex-direction: column; gap: 8px; }
        .footer-logo  { display: flex; align-items: center; gap: 8px; }
        .footer-logo-text {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .footer-tagline {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.25);
          max-width: 260px;
          line-height: 1.6;
        }
        .footer-links { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .footer-links a {
          font-family: var(--font-body);
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          letter-spacing: 0.04em;
        }
        .footer-links a:hover { color: var(--accent2); }
        .footer-copy {
          font-family: var(--font-body);
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          max-width: var(--inner-max);
          margin: 0 auto;
        }
        @media (max-width: 560px) {
          .footer-inner { flex-direction: column; }
          .footer-links { align-items: flex-start; }
        }
      `}</style>

      {/* ── HIDDEN SEO H1 ── */}
      <h1 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
        overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        Data on Tap — Free AI-Powered Business Intelligence Tools
      </h1>

      <div style={{ maxWidth: 860, margin: "0 auto", overflow: "hidden" }}>
        <HeroBanner
          icon={<DotIcon size={52} />}
          titleStrong="Data"
          titleEm="on Tap"
          leadText="Are you unreasonably excited about data?"
          bodyText="A free library of AI-powered mini Business Intelligence Tools for people who want to use data to tell smarter stories — and AI to close the gap between idea and execution."
          heroImage="/monica-poling-dot-hero.png"
          heroImageAlt="Monica Poling, founder of Data on Tap"
          dimBarText="Let's build AI tools in an afternoon."
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ background: "var(--bg)", paddingBottom: "1rem" }}>
        <div className="kot-inner">

          {/* TYPE FILTER */}
          <section className="section">
            <div className="section-header">
              <span className="section-title">Browse by Tool Type</span>
            </div>
            <div className="type-grid">
              {TYPE_FILTERS.map((f) => (
                <div
                  key={f.key}
                  className={`type-card${activeType === f.key ? " active" : ""}`}
                  onClick={() => setActiveType(f.key)}
                >
                  <div className="type-rule" />
                  <div className="type-name">{f.label}</div>
                  <div className="type-desc">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="section-divider" />
          </section>

          {/* FEATURED TOOL */}
          <section className="section">
            <div className="section-header">
              <span className="section-title">Featured Tool</span>
            </div>
            <a
              className="featured-card kot-anim"
              href="https://power-score.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="featured-thumb"
                src="https://monicapoling.com/wp-content/uploads/2026/04/Power-Score-Hero-Image-300x157.png"
                alt="POWER Score"
              />
              <div className="featured-body">
                <div className="featured-eyebrow">POV · Free Tool</div>
                <div className="featured-name">POWER Score</div>
                <div className="featured-desc">
                  Share your URL and get a free competitive analysis across five dimensions —
                  Prestige, Origin, Wow, Expertise, Reputation. Built on Monica's proprietary
                  positioning framework.
                </div>
                <div className="featured-link">Try the POWER Score →</div>
              </div>
            </a>
          </section>

          {/* TOOLS GRID */}
          <section className="section">
            <div className="section-header">
              <span className="section-title" id="toolsSectionTitle">
                {activeType === "all" ? "Recent Tools" :
                  TYPE_FILTERS.find((f) => f.key === activeType)?.label || "Tools"}
              </span>
              <span className="section-count">
                {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="no-results">No tools in this category yet — check back soon.</div>
            ) : (
              <div className="tools-grid">
                {filtered.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ── NEWSLETTER ── */}
      <div className="nl-zone">
        <div className="nl-card">
          <div className="nl-copy">
            <div className="nl-eyebrow">Subscribe Now</div>
            <p className="nl-body">
              Turn what you know into what you're known for. Weekly ideas on using AI to
              organize, share, and monetize your expertise.
            </p>
          </div>
          {nlSubmitted ? (
            <div className="nl-thanks">✓ You're in! Watch for Let's Make Some Noise.</div>
          ) : (
            <div className="nl-form">
              <input
                type="text"
                className="nl-field"
                placeholder="First name"
                value={nlFirstName}
                onChange={(e) => setNlFirstName(e.target.value)}
              />
              <input
                type="email"
                className="nl-field"
                placeholder="your@email.com"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button className="btn-primary" onClick={handleSubscribe}>
                Subscribe Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="page-footer-rule" />
      <footer className="page-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <KotLogo size={18} />
              <span className="footer-logo-text">Data on Tap</span>
            </div>
            <p className="footer-tagline">
              A working library of AI-powered business tools. Built to show what's possible.
            </p>
          </div>
          <div className="footer-links">
            <a href="https://monicapoling.com">monicapoling.com</a>
            <a href="https://monicapoling.com/speaking">Speaking & Workshops</a>
            <a href="https://linkedin.com/in/monicapoling" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <p className="footer-copy">
          © 2026 Monica Poling · Data on Tap · Built with Claude API, Google Sheets & Vercel
        </p>
      </footer>

    </div>
  );
}
