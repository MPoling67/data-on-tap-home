// ── DOT ICON SVG ─────────────────────────────────────────────────────────────
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

export default function DotHero() {
  return (
    <>
      <style>{`
        .dh-hero { width: 100%; background: #111110; display: flex; align-items: stretch; min-height: 220px; max-height: 280px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .dh-hero-left { flex: 3; padding: 2rem clamp(16px,4vw,2rem); display: flex; flex-direction: column; justify-content: center; gap: 14px; }
        .dh-logo-row { display: flex; align-items: center; gap: 14px; }
        .dh-title { font-family: 'Fraunces', Georgia, serif; font-size: clamp(36px,6vw,52px); color: #f0ede8; line-height: 1; letter-spacing: -0.02em; }
        .dh-title strong { font-weight: 700; font-style: normal; color: #f0ede8; }
        .dh-title em { font-weight: 300; font-style: italic; color: #be3650; }
        .dh-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 300; line-height: 1.7; color: rgba(255,255,255,0.6); max-width: 520px; }
        .dh-sub .lead { font-weight: 500; color: #f0ede8; display: block; margin-bottom: 0.4rem; }
        .dh-hero-right { flex: 0 0 230px; min-width: 200px; max-width: 230px; position: relative; overflow: hidden; background: #111110; }
        .dh-hero-right img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        .dh-dim-bar { background: #111110; display: flex; align-items: center; border-top: 1.5px solid rgba(134,20,66,0.5); border-bottom: 1.5px solid rgba(134,20,66,0.5); }
        .dh-dim-col { flex: 1; text-align: center; padding: 14px clamp(16px,4vw,2rem); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #f0ede8; line-height: 1.6; }
        .dh-dim-pipe { width: 1px; height: 18px; background: rgba(255,255,255,0.12); flex-shrink: 0; align-self: center; }
        @media (max-width: 600px) { .dh-hero-right { display: none; } }
      `}</style>

      {/* Hero */}
      <section className="dh-hero">
        <div className="dh-hero-left">
          <div className="dh-logo-row">
            <div style={{ flexShrink: 0, lineHeight: 0 }}>
              <DotIcon size={52} />
            </div>
            <div className="dh-title">
              <strong>Data</strong> <em>on Tap</em>
            </div>
          </div>
          <div className="dh-sub">
            <span className="lead">Your business deserves more than generic AI output.</span>
            Data on Tap is a series of business intelligence tools that turn your data, knowledge, and ideas into beautiful content — no design skills, no software, no data team. Because AI should be used to do more than generate generic social media content. Follow along as I launch new tools every week.
          </div>
        </div>
        <div className="dh-hero-right">
          <img src="/monica-poling-dot-hero.png" alt="Monica Poling, founder of Data on Tap" />
        </div>
      </section>

      {/* Dim bar */}
      <div className="dh-dim-bar">
        <div className="dh-dim-col">Data &<br />Economic Development</div>
        <div className="dh-dim-pipe" />
        <div className="dh-dim-col">Business<br />Intelligence</div>
        <div className="dh-dim-pipe" />
        <div className="dh-dim-col">Custom<br />Tools</div>
      </div>
    </>
  );
}
