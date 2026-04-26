import { useState } from "react";

// ── TOOL DATA ─────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "power-score",
    name: "POWER Score",
    desc: "Is your website leaving money on the table? The POWER Score is a free AI-generated website analysis that shows you exactly where you're underselling what you do — and how to fix it.",
    type: "bizintel",
    typeLabel: "Biz Intel",
    status: "live",
    url: "https://power.dataontap.dev/",
    img: "https://power.dataontap.dev/power-score-social.png",
    date: "2026-01-01",
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
    typeLabel: "Quizzes & Trivia",
    status: "live",
    url: "https://monicapoling.com/wheels",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Wheels-Museum-App-Cover-300x180.png",
    date: "2026-04-05",
  },
  {
    id: "color-palette",
    name: "Color Palette Generator",
    desc: "Search any Pixabay image, pick the one that matches your brand mood, and generate an instant color palette.",
    type: "design",
    typeLabel: "Design & Directories",
    status: "live",
    url: "https://colorpalette.dataontap.dev/",
    img: "https://colorpalette.dataontap.dev/images/color-palette-social.png",
    date: "2026-04-20",
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
    date: "2026-01-05",
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
    type: "design",
    typeLabel: "Design & Directories",
    status: "progress",
    url: "https://monicapoling.com/wp-content/uploads/apps/book-arts/enchanted-artists.html",
    img: "https://monicapoling.com/wp-content/uploads/2026/04/Enchanted-Artists-OG.png",
    date: "2026-01-03",
  },
];

TOOLS.sort((a, b) => new Date(b.date) - new Date(a.date));

const TYPE_FILTERS = [
  { key: "all",     label: "All Tools" },
  { key: "bizintel", label: "Biz Intel" },
  { key: "data",    label: "Data & Econ Dev" },
  { key: "quiz",    label: "Quizzes & Trivia" },
  { key: "design",  label: "Design & Directories" },
];

const NL_LOGGER = "https://script.google.com/macros/s/AKfycbwvztxaVKSDYhevhsjQ7LowAMvjBu4ONs2AqXytbNflmEJ_mfBF7mI54fgyhBZzhU8M/exec";

// ── DOT ICON SVG ──────────────────────────────────────────────────────────────
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

// ── DOT LOGO (C-variant) ──────────────────────────────────────────────────────
function DotLogo({ size = 18 }) {
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
      className="tool-card dot-anim"
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

  const handleSubscribe = async () => {
    if (!nlEmail.trim()) return;
    setNlSubmitted(true);
    try {
      const params = new URLSearchParams({
        timestamp: new Date().toISOString(),
        event: "subscribe",
        app: "Data on Tap",
        firstName: nlFirstName.trim(),
        email: nlEmail.trim(),
      });
      await fetch(`${NL_LOGGER}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });
    } catch (_) {
      // silent
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a18", color: "#f0ede8", maxWidth: "860px", margin: "0 auto", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #1a1a18; --surface: #242422; --surface2: #2e2e2b;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.14);
          --text: #f0ede8; --muted: #c8c4bc; --dim: #5a5a56;
          --accent: #861442; --accent2: #be3650;
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --radius: 10px;
          --inner-max: 860px;
          --px: clamp(16px, 4vw, 2rem);
        }
        body { font-family: var(--font-body); font-weight: 300; background: var(--bg); color: var(--text); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dot-anim { animation: fadeUp 0.5s ease both; }

        /* ── HERO ── */
        .dot-hero { width: 100%; background: #111110; display: flex; align-items: stretch; min-height: 220px; max-height: 280px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .dot-hero-left { flex: 3; padding: 2rem var(--px); display: flex; flex-direction: column; justify-content: center; gap: 14px; }
        .dot-hero-logo { display: flex; align-items: center; gap: 14px; }
        .dot-hero-title { font-family: var(--font-display); font-size: clamp(36px,6vw,52px); color: #f0ede8; line-height: 1; letter-spacing: -0.02em; }
        .dot-hero-title strong { font-weight: 700; font-style: normal; color: #f0ede8; }
        .dot-hero-title em { font-weight: 300; font-style: italic; color: #be3650; }
        .dot-hero-sub { font-family: var(--font-body); font-size: 14px; font-weight: 300; line-height: 1.7; color: rgba(255,255,255,0.6); max-width: 520px; }
        .dot-hero-sub .lead { font-weight: 500; color: #f0ede8; display: block; margin-bottom: 0.4rem; }
        .dot-hero-right { flex: 0 0 230px; min-width: 200px; max-width: 230px; position: relative; overflow: hidden; background: #111110; }
        .dot-hero-right img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        @media (max-width: 600px) { .dot-hero-right { display: none; } }

        /* ── DIM BAR ── */
        .dot-dim-bar { background: #111110; display: flex; align-items: center; border-top: 1.5px solid rgba(134,20,66,0.5); border-bottom: 1.5px solid rgba(134,20,66,0.5); }
        .dot-dim-col { flex: 1; text-align: center; padding: 14px var(--px); font-family: var(--font-body); font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #f0ede8; line-height: 1.6; }
        .dot-dim-pipe { width: 1px; height: 18px; background: rgba(255,255,255,0.12); flex-shrink: 0; align-self: center; }

        /* ── MAIN INNER ── */
        .dot-inner {
          max-width: 860px;
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
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 0.5rem;
        }
        @media (max-width: 700px) { .type-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
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
        

        /* ── FEATURED CARD ── */
        .featured-card {
          background: var(--surface);
          border: 1px solid rgba(134,20,66,0.3);
          border-radius: var(--radius);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          text-decoration: none;
          transition: border-color 0.15s;
          margin-bottom: 2rem;
        }
        .featured-card:hover { border-color: rgba(134,20,66,0.6); }
        .featured-thumb {
          width: 100%;
          aspect-ratio: 1200/620;
          object-fit: cover;
          display: block;
        }
        @media (max-width: 560px) {
          .featured-card { grid-template-columns: 1fr; }
        }.featured-body {
          padding: 20px 24px;
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
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.714;
        }
        .featured-link {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--accent2);
          margin-top: 4px;
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
          font-size: 20px;
          font-weight: 300;
          color: var(--text);
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .tool-desc {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.714;
          flex: 1;
        }
        .tool-link {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--accent2);
          margin-top: 12px;
        }

        /* ── NO RESULTS ── */
        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--dim);
          font-size: 13px;
          font-family: var(--font-body);
        }

        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         * NEWSLETTER — pull into SubscribeBar.jsx when ready
         * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .nl-zone {
          background: #111110;
          padding: 2.5rem var(--px);
          border-top: 1.5px solid rgba(134,20,66,0.5);
        }
        .nl-card {
          max-width: 640px;
          margin: 0 auto;
        }
        .nl-eyebrow {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent2);
          margin-bottom: 8px;
        }
        .nl-heading {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: #f0ede8;
          line-height: 1.65;
          margin-bottom: 2px;
        }
        .nl-body {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.65;
          margin-bottom: 1.25rem;
        }
        .nl-form {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .nl-field {
          flex: 1;
          min-width: 120px;
          background: #1a1a18;
          border: 1px solid rgba(255,255,255,0.4);
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
        .nl-field:-webkit-autofill,
        .nl-field:-webkit-autofill:hover,
        .nl-field:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #1a1a18 inset !important;
          -webkit-text-fill-color: #f0ede8 !important;
          caret-color: #f0ede8;
          border-color: #861442;
        }
        .nl-btn {
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
          white-space: nowrap;
        }
        .nl-btn:hover { opacity: 0.88; }
        
        .nl-thanks {
          font-family: var(--font-body);
          font-size: 13px;
          color: #4caf8a;
          margin-top: 10px;
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
          padding: 1.25rem var(--px);
        }
        .footer-copy {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.7);
          max-width: var(--inner-max);
          margin: 0 auto;
          line-height: 1.8;
          text-align: center;
        }
        .footer-copy a {
          color: #861442;
          text-decoration: none;
        }
        .footer-copy a:hover { color: var(--accent2); }
        .footer-sep {
          color: var(--accent2);
          margin: 0 6px;
          font-size: 7px;
          vertical-align: middle;
        }
      `}</style>

      {/* ── HIDDEN SEO H1 ── */}
      <h1 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
        overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        Data on Tap — Free AI-Powered Business Intelligence Tools
      </h1>

      {/* ── HERO ── */}
      <section className="dot-hero">
        <div className="dot-hero-left">
          <div className="dot-hero-logo">
            <div style={{ flexShrink: 0, lineHeight: 0 }}>
              <DotIcon size={52} />
            </div>
            <div className="dot-hero-title">
              <strong>Data</strong>{" "}
              <em>on Tap</em>
            </div>
          </div>
          <div className="dot-hero-sub">
            <span className="lead">Your business deserves more than generic AI output.</span>
            Data on Tap is a series of business intelligence tools that turn your data, knowledge, and ideas into beautiful content — no design skills, no software, no data team. Because AI should be used to do more than generate generic social media content. Follow along as I launch new tools every week.
          </div>
        </div>
        <div className="dot-hero-right">
          <img src="/monica-poling-dot-hero.png" alt="Monica Poling, founder of Data on Tap" />
        </div>
      </section>

      {/* ── DIM BAR ── */}
      <div className="dot-dim-bar">
        <div className="dot-dim-col">Data &<br/>Economic Development</div>
        <div className="dot-dim-pipe" />
        <div className="dot-dim-col">Business<br/>Intelligence</div>
        <div className="dot-dim-pipe" />
        <div className="dot-dim-col">Custom<br/>Tools</div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ background: "var(--bg)", paddingBottom: "1rem" }}>
        <div className="dot-inner">

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
              className="featured-card dot-anim"
              href="https://power.dataontap.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="featured-thumb"
                src="https://power.dataontap.dev/power-score-social.png"
                alt="POWER Score"
              />
              <div className="featured-body">
                <div className="featured-name">POWER Score</div>
                <div className="featured-desc">
                  Is your website leaving money on the table? The POWER Score is a free 
                  AI-generated website analysis that shows you exactly where you're 
                  underselling what you do — and how to fix it.
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
          <div className="nl-eyebrow">Subscribe Now</div>
          <div className="nl-heading">Turn what you know into what you're known for.</div>
          <p className="nl-body">Weekly tips on using AI to organize, share, and monetize your expertise.</p>
          {nlSubmitted ? (
            <div className="nl-thanks">✓ You've been subscribed. Watch your email for a welcome note from Monica.</div>
          ) : (
            <>
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
                <button className="nl-btn" onClick={handleSubscribe}>
                  Subscribe Now →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="page-footer-rule" />
      <footer className="page-footer">
        <p className="footer-copy">
          © 2026 Data on Tap
          <span className="footer-sep">◆</span>
          <a href="https://monicapoling.com" target="_blank" rel="noopener noreferrer">Monica Poling</a>
        </p>
      </footer>

    </div>
  );
}
