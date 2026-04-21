/**
 * HeroBanner.jsx — KoT / DOT shared hero component
 * Import in any DOT tool App.jsx and pass props.
 *
 * Usage:
 *   <HeroBanner
 *     icon={<YourIconSVG />}
 *     titleStrong="Data"
 *     titleEm="on Tap"
 *     leadText="Are you unreasonably excited about data?"
 *     bodyText="A free library of..."
 *     heroImage="/monica-poling-dot-hero.png"
 *     heroImageAlt="Monica Poling"
 *     dimBarText="Let's build AI tools in an afternoon."
 *     // OR for multi-column dim bar:
 *     dimBarCols={["Prestige","Ownership","Wow Factor","Expertise","Reputation"]}
 *   />
 *
 * BANNER CSS LIVES HERE — this is the canonical source.
 * If you change hero styles, change BANNER_CSS below first,
 * then copy the block into App.jsx under the BANNER comment.
 */

// ── CANONICAL BANNER CSS ──────────────────────────────────────────────────────
// Keep this in sync with the /* BANNER */ block in App.jsx.
export const BANNER_CSS = `
  /* ── BANNER START ─────────────────────────────────────
     Source of truth: HeroBanner.jsx → BANNER_CSS
     Mirror copy in: App.jsx → BANNER comment block
     ───────────────────────────────────────────────── */
  .kot-hero {
    width: 100%;
    background: #111110;
    display: flex;
    align-items: stretch;
    height: 260px;
  }
  .kot-hero-inner {
    flex: 1 1 auto;
    max-width: 860px;
    margin: 0 auto 0 0;
    display: flex;
    align-items: stretch;
    padding: 0 clamp(16px,4vw,2rem);
    min-width: 0;
  }
  .kot-hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
    padding: 2rem 0;
    min-width: 0;
  }
  .kot-hero-logo {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .kot-hero-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(36px,6vw,52px);
    color: #f0ede8;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .kot-hero-title strong { font-weight: 700; font-style: normal; color: #f0ede8; }
  .kot-hero-title em    { font-weight: 300; font-style: italic; color: #be3650; }
  .kot-hero-sub {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
    color: rgba(255,255,255,0.6);
    max-width: 520px;
  }
  .kot-hero-sub .lead {
    font-weight: 500;
    color: #f0ede8;
    display: block;
    margin-bottom: 0.4rem;
  }
  .kot-hero-right {
    flex: 0 0 240px;
    width: 240px;
    position: relative;
    overflow: hidden;
    background: #111110;
  }
  .kot-hero-right img {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  @media (max-width: 500px) { .kot-hero-right { display: none; } }
  .kot-dim-bar {
    background: #111110;
    display: flex;
    align-items: center;
    border-top: 1.5px solid rgba(134,20,66,0.5);
    border-bottom: 1.5px solid rgba(134,20,66,0.5);
  }
  .kot-dim-col {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f0ede8;
  }
  .kot-dim-pipe {
    width: 1px;
    height: 18px;
    background: rgba(255,255,255,0.12);
    flex-shrink: 0;
  }
  /* ── BANNER END ── */
`;

export default function HeroBanner({
  icon,
  titleStrong,
  titleEm,
  leadText,
  bodyText,
  heroImage,
  heroImageAlt = "",
  dimBarCols,
  dimBarText,
}) {
  return (
    <>
      <style>{BANNER_CSS}</style>

      <section className="kot-hero">
        <div className="kot-hero-inner">
          <div className="kot-hero-left">
            <div className="kot-hero-logo">
              {icon && <div style={{ flexShrink: 0, lineHeight: 0 }}>{icon}</div>}
              <div className="kot-hero-title">
                <strong>{titleStrong}</strong>{" "}
                <em>{titleEm}</em>
              </div>
            </div>
            <div className="kot-hero-sub">
              {leadText && <span className="lead">{leadText}</span>}
              {bodyText}
            </div>
          </div>
        </div>

        {heroImage && (
          <div className="kot-hero-right">
            <img src={heroImage} alt={heroImageAlt} />
          </div>
        )}
      </section>

      {(dimBarCols || dimBarText) && (
        <div className="kot-dim-bar">
          {dimBarCols ? (
            dimBarCols.map((col, i) => (
              <span key={col}>
                {i > 0 && <span className="kot-dim-pipe" />}
                <span className="kot-dim-col">{col}</span>
              </span>
            ))
          ) : (
            <div className="kot-dim-col" style={{ padding: "8px clamp(16px,4vw,2rem)" }}>
              {dimBarText}
            </div>
          )}
        </div>
      )}
    </>
  );
}
