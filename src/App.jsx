import { useState } from "react";
import DotHero from "./DotHero";
import SubscribeBar from "./SubscribeBar";

// ── TOOL DATA ─────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "money-moves",
    name: "Money Moves",
    desc: "Is your website leaving money on the table? The Money Moves brief provides a free, instant AI-generated website analysis that shows you exactly where you're underselling what you do — and how to fix it.",
    type: "bizintel",
    typeLabel: "Biz Intel",
    status: "live",
    url: "https://money.dataontap.dev/",
    img: "https://money.dataontap.dev/money-moves-social.png",
    date: "2026-04-19",
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
    url: "https://wheels.dataontap.dev",
    img: "https://wheels.dataontap.dev/wheels-museum-social.png",
    date: "2026-05-01",
  },
  {
    id: "color-palette",
    name: "Color Palette Generator",
    desc: "Search any Pixabay image, pick the one that matches your brand mood, and generate an instant color palette.",
    type: "design",
    typeLabel: "Design & Directories",
    status: "live",
    url: "https://colorpalette.dataontap.dev/",
    img: "https://colorpalette.dataontap.dev/color-palette-social.png",
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

  const filtered = activeType === "all"
    ? TOOLS
    : TOOLS.filter((t) => t.type === activeType);

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
          color: var(--text);
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
          font-weight: 600;
          color: #f0ede8;
          line-height: 1.2;
        }
        .featured-desc {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 300;
          color: #f0ede8;
          line-height: 24px;
        }
        .featured-link {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: #861442;
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
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .tool-desc {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 300;
          color: #f0ede8;
        }
        .tool-link {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: #861442;
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
          font-size: 12px;
          font-weight: 300;
          line-height: 20px;
          color: #f0ede8;
          max-width: var(--inner-max);
          margin: 0 auto;
          text-align: center;
        }
        .footer-copy a {
          font-weight: 500;
          color: #861442;
          text-decoration: none;
        }
        .footer-copy a:hover { font-weight: 300; color: var(--accent2); }
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

      {/* ── HERO + DIM BAR ── */}
      <DotHero />

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
              href="https://money.dataontap.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="featured-thumb"
                src="https://money.dataontap.dev/money-moves-social.png"
                alt="Money Moves Brief"
              />
              <div className="featured-body">
                <div className="featured-name">Money Moves Brief</div>
                <div className="featured-desc">
                  Is your website leaving money on the table? The Money Moves brief is a free 
                  AI-generated website analysis that shows you exactly where you're 
                  underselling what you do — and how to fix it.
                </div>
                <div className="featured-link">Get Your Money Moves Brief →</div>
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

      {/* ── SUBSCRIBE ── */}
      <SubscribeBar appName="Data on Tap" url={window.location.href} />

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
