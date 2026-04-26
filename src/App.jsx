import { useState, useRef, useCallback } from 'react';

const LOGGER = 'https://script.google.com/macros/s/AKfycbxtCPP6q6wqCUYlSEtNdyQxFF_22K94lvgP4MJytXYX-kWqpCYkZnXG7tYV5fSZThYj/exec';
const SESSION_ID = Math.random().toString(36).slice(2, 10);
const IS_ME = new URLSearchParams(window.location.search).has('me');

// ── Color Engine ────────────────────────────────────────────────────────────
function luminance([r, g, b]) { return 0.299 * r + 0.587 * g + 0.114 * b; }
function hueDistance(h1, h2) { const d = Math.abs(h1 - h2); return Math.min(d, 360 - d); }
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''); }
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function contrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 148 ? '#111111' : '#f5f5f0';
}
function kmeans(pixels, k) {
  const used = new Set(); let centroids = [];
  while (centroids.length < k) { const idx = Math.floor(Math.random() * pixels.length); if (!used.has(idx)) { used.add(idx); centroids.push([...pixels[idx]]); } }
  for (let iter = 0; iter < 22; iter++) {
    const clusters = Array.from({ length: k }, () => []);
    pixels.forEach(p => { let best = 0, bestD = Infinity; centroids.forEach((c, i) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < bestD) { bestD = d; best = i; } }); clusters[best].push(p); });
    centroids = clusters.map((cl, i) => cl.length ? [Math.round(cl.reduce((s, p) => s + p[0], 0) / cl.length), Math.round(cl.reduce((s, p) => s + p[1], 0) / cl.length), Math.round(cl.reduce((s, p) => s + p[2], 0) / cl.length)] : centroids[i]);
  }
  return centroids;
}
function findAccent(pixels, domHsl) {
  let best = null, bestScore = 0;
  const step = Math.max(1, Math.floor(pixels.length / 600));
  for (let i = 0; i < pixels.length; i += step) {
    const hsl = rgbToHsl(...pixels[i]);
    const sat = hsl[1], dist = hueDistance(domHsl[0], hsl[0]);
    if (sat > 40 && dist > 35) {
      const score = sat * (dist / 180) * (1 + Math.random() * 0.15);
      if (score > bestScore) { bestScore = score; best = pixels[i]; }
    }
  }
  return best;
}
function buildColorSystem(data) {
  const pixels = [];
  for (let i = 0; i < data.length; i += 20) { if (data[i + 3] > 128) pixels.push([data[i], data[i + 1], data[i + 2]]); }
  const subsample = pixels.map(p => ({ p, sort: Math.random() })).sort((a, b) => a.sort - b.sort).slice(0, Math.floor(pixels.length * 0.7)).map(x => x.p);
  const clusters = kmeans(subsample, 6);
  const byLum = clusters.slice().sort((a, b) => luminance(a) - luminance(b));
  const offset = Math.floor(Math.random() * 3);
  const get = i => byLum[(i + offset) % byLum.length];
  const dominantHsl = rgbToHsl(...get(2));
  const accent = findAccent(pixels, dominantHsl) || get(4);
  const mc = (rgb, role) => ({ hex: rgbToHex(...rgb), rgb, hsl: rgbToHsl(...rgb), role });
  const sys = { nav: mc(get(1), 'nav bar'), hero: mc(get(2), 'hero bg'), background: mc(get(5), 'section bg'), card: mc(get(4), 'content cards'), accent: mc(accent, 'cta / accent'), text: mc(get(0), 'body text') };
  sys.all = Object.values(sys).filter(v => v && v.hex);
  return sys;
}
function buildFromTags(tags) {
  const w = tags.toLowerCase();
  const warm = ['sunset', 'golden', 'autumn', 'fire', 'desert', 'sand', 'warm', 'orange', 'red', 'rust', 'field', 'wheat'];
  const cool = ['ocean', 'sea', 'water', 'sky', 'blue', 'winter', 'ice', 'cool', 'teal', 'night', 'rain'];
  const green = ['forest', 'nature', 'garden', 'green', 'grass', 'leaf', 'spring', 'tropical'];
  let bH = Math.floor(Math.random() * 360), bS = 60, bL = 50;
  if (warm.some(x => w.includes(x))) { bH = 25 + Math.random() * 20; bS = 72; bL = 55; }
  else if (cool.some(x => w.includes(x))) { bH = 200 + Math.random() * 30; bS = 65; bL = 48; }
  else if (green.some(x => w.includes(x))) { bH = 110 + Math.random() * 40; bS = 55; bL = 42; }
  const aH = (bH + 150 + Math.random() * 60) % 360;
  const mc = (h, s, l, role) => { const hex = hslToHex(h, s, l); return { hex, rgb: [0, 0, 0], hsl: [Math.round(h), Math.round(s), Math.round(l)], role }; };
  const sys = { nav: mc(bH, bS, bL, 'nav bar'), hero: mc((bH + 12) % 360, bS - 8, bL + 10, 'hero bg'), background: mc(bH, 18, 93, 'section bg'), card: mc(bH, 14, 88, 'content cards'), accent: mc(aH, 82, 52, 'cta / accent'), text: mc(bH, 22, 14, 'body text') };
  sys.all = Object.values(sys).filter(v => v && v.hex);
  return sys;
}

// ── Icon ────────────────────────────────────────────────────────────────────
function SkylineIcon({ size = 54 }) {
  return <img src="/images/skyline-icon.png" alt="" width={size} height={size} />;
}

// ── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${message ? 0 : '60px'})`,
      background: '#be3650', color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 12, fontWeight: 500, padding: '8px 20px', borderRadius: 99,
      opacity: message ? 1 : 0, transition: 'all 0.25s', zIndex: 200, whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}>{message}</div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState('landing');
  const [query, setQuery] = useState('');
  const [imgType, setImgType] = useState('photo');
  const [hits, setHits] = useState([]);
  const [currentHit, setCurrentHit] = useState(null);
  const [colorSystem, setColorSystem] = useState(null);
  const [toast, setToast] = useState('');
  const [regenSpinning, setRegenSpinning] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerFirst, setFooterFirst] = useState('');
  const [footerThanks, setFooterThanks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState('');
  const [lastType, setLastType] = useState('photo');

  const canvasRef = useRef(null);
  const stripRef = useRef(null);
  const pixelDataRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  // ── Search ───────────────────────────────────────────────────────────────
  async function doSearch(q = query, type = imgType, append = false, autoSelect = false) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const page = append ? currentPage + 1 : 1;

    if (!append) {
      setHits([]);
      setCurrentHit(null);
      setColorSystem(null);
      pixelDataRef.current = null;
      setPhase('results');
      setLastQuery(trimmed);
      setLastType(type);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }

    try {
      const res = await fetch(`/api/pixabay?q=${encodeURIComponent(trimmed)}&image_type=${type}&page=${page}&per_page=24`);
      const data = await res.json();
      if (!data.hits?.length) return;
      if (append) {
        setHits(prev => [...prev, ...data.hits]);
      } else {
        setHits(data.hits);
        if (autoSelect && data.hits.length) selectImage(data.hits[0]);
      }
      if (!append && !IS_ME) {
        fetch(LOGGER, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timestamp: new Date().toISOString(), event: 'search', app: 'Color Palette Generator', query: trimmed, imgType: type, sessionId: SESSION_ID })
        }).catch(() => {});
      }
    } catch (e) { }
  }

  // ── Extract colors ───────────────────────────────────────────────────────
  function extractAndApply(hit) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const size = 220;
      canvas.width = size; canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
      try {
        pixelDataRef.current = ctx.getImageData(0, 0, size, size).data;
        setColorSystem(buildColorSystem(pixelDataRef.current));
      } catch (e) {
        pixelDataRef.current = null;
        setColorSystem(buildFromTags(hit.tags));
      }
    };
    img.onerror = () => { pixelDataRef.current = null; setColorSystem(buildFromTags(hit.tags)); };
    img.src = hit.webformatURL;
  }

  function selectImage(hit) {
    setCurrentHit(hit);
    setPhase('palette');
    pixelDataRef.current = null;
    setColorSystem(null);
    extractAndApply(hit);
  }

  function regenerate() {
    setRegenSpinning(true);
    setTimeout(() => setRegenSpinning(false), 420);
    if (pixelDataRef.current) setColorSystem(buildColorSystem(pixelDataRef.current));
    else if (currentHit) setColorSystem(buildFromTags(currentHit.tags));
  }

  function resetApp() {
    setPhase('landing');
    setQuery('');
    setHits([]);
    setCurrentHit(null);
    setColorSystem(null);
    pixelDataRef.current = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function copyHex(hex) {
    navigator.clipboard.writeText(hex.toUpperCase()).then(() => showToast('Copied ' + hex.toUpperCase()));
  }

  function downloadSVG() {
    if (!colorSystem || !currentHit) { showToast('Generate a palette first'); return; }
    const palette = colorSystem.all.slice(0, 6);
    const imageName = currentHit.tags.split(',')[0].trim();
    const svgW = 560, pad = 16, swatchW = (svgW - pad * 2 - 20) / 3;
    const swatchH = 60, paletteH = 2 * (swatchH + 36) + pad * 2, totalH = paletteH + 36;
    const swatches = palette.map((c, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = pad + col * (swatchW + 10), y = pad + row * (swatchH + 42);
      return `<rect x="${x}" y="${y}" width="${swatchW}" height="${swatchH}" rx="6" fill="${c.hex}"/>`
        + `<text x="${x + swatchW / 2}" y="${y + swatchH + 16}" font-family="monospace" font-size="12" font-weight="600" text-anchor="middle" fill="#111">${c.hex.toUpperCase()}</text>`
        + `<text x="${x + swatchW / 2}" y="${y + swatchH + 30}" font-family="monospace" font-size="11" text-anchor="middle" fill="#666">${c.role || ''}</text>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${totalH}" style="background:#fff">`
      + `<rect x="0" y="0" width="${svgW}" height="${paletteH}" fill="#fff"/>${swatches}`
      + `<text x="${pad}" y="${paletteH + 22}" font-family="monospace" font-size="11" fill="#be3650">Color Palette Generator · Data on Tap · monicapoling.com</text>`
      + `</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = imageName.replace(/\s+/g, '-') + '-palette.svg'; a.click();
    showToast('Palette downloaded');
  }

  function submitFooterEmail() {
    if (!footerEmail || !footerEmail.includes('@')) { showToast('Please enter a valid email'); return; }
    const humanTime = new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    fetch(LOGGER, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: humanTime, event: 'footer_subscribe', app: 'Color Palette Generator', url: window.location.href, firstName: footerFirst, email: footerEmail, subscribe: 'yes' })
    }).catch(() => {});
    setFooterThanks(true);
    showToast('Welcome aboard!');
  }

  const cs = colorSystem;

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #1a1a18; --surface: #242422; --surface2: #2e2e2b;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.14);
          --text: #f0ede8; --muted: #c8c4bc; --dim: #5a5a56;
          --accent: #861442; --accent2: #be3650; --radius: 10px;
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --strip-h: 100px; --pad: clamp(16px,4vw,2rem); --max: 860px;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-weight: 300; min-height: 100vh; }
        canvas { display: none; }
        .seo-h1 { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .dot-anim { animation: fadeUp 0.5s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { display:inline-block; animation: spin 0.4s linear; }

        /* Buttons */
        .btn-primary { background:var(--accent); color:#fff; border:none; font-family:var(--font-body); font-size:13px; font-weight:500; padding:10px 22px 13px; border-radius:var(--radius); cursor:pointer; transition:opacity .15s,transform .1s; white-space:nowrap; }
        .btn-primary:hover { opacity:.88; }
        .btn-primary:active { transform:scale(.97); }
        .btn-ghost { background:transparent; color:var(--text); border:1px solid var(--border2); font-family:var(--font-body); font-size:13px; font-weight:400; padding:9px 16px 12px; border-radius:var(--radius); cursor:pointer; transition:color .2s,border-color .2s; white-space:nowrap; }
        .btn-ghost:hover { color:var(--accent2); border-color:var(--accent2); }

        /* Footer rule */
        .page-footer-rule { width:100%; height:1.5px; background:rgba(134,20,66,0.5); }

        /* Hero */
        .dot-hero { background:#111110; width:100%; display:flex; align-items:stretch; border-bottom:1px solid rgba(255,255,255,0.06); transition: min-height 0.3s; }
        .dot-hero-inner { display:flex; align-items:stretch; width:100%; }
        .dot-hero-left { flex:3; padding:2rem clamp(16px,4vw,2rem); display:flex; flex-direction:column; justify-content:center; gap:14px; }
        .dot-hero-logo { display:flex; align-items:center; gap:14px; }
        .dot-hero-title { font-family:var(--font-display); font-size:42px; color:#f0ede8; line-height:1; letter-spacing:-0.02em; }
        .dot-hero-title strong { font-weight:700; color:#f0ede8; }
        .dot-hero-title em { font-weight:300; font-style:italic; color:#be3650; }
        .dot-hero-sub { font-size:14px; font-weight:300; line-height:1.5; color:rgba(255,255,255,0.6); max-width:520px; }
        .dot-hero-sub p { margin-bottom: 0.4rem; }
        .dot-hero-right { flex:0 0 230px; min-width:200px; max-width:230px; overflow:hidden; background:#1a1a18; }
        .dot-hero-right img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; }
        @media (max-width:500px) { .dot-hero-right { display:none; } }

        /* Input zone */
        .dot-input-zone { background:var(--bg); padding:0 var(--pad) 1.5rem; }
        .dot-input-card { background:var(--bg); border:1.5px solid rgba(134,20,66,0.5); border-radius:var(--radius); padding:1rem 1.25rem; display:flex; gap:8px; align-items:center; flex-wrap:wrap; max-width:var(--max); margin:0 auto; }
        .dot-input-card input[type=text] { flex:1; min-width:180px; background:#111110; border:1px solid rgba(255,255,255,0.4); color:var(--text); -webkit-text-fill-color:var(--text); font-family:var(--font-body); font-weight:300; font-size:14px; padding:10px 14px; border-radius:var(--radius); outline:none; transition:border-color .2s; }
        .dot-input-card input[type=text]:focus { border-color:var(--accent); }
        .dot-input-card input[type=text]::placeholder { color:var(--dim); }
        .dot-input-card select { background:#111110; border:1px solid rgba(255,255,255,0.12); color:var(--text); font-family:var(--font-body); font-size:13px; font-weight:300; padding:10px 12px; border-radius:var(--radius); outline:none; cursor:pointer; }

        /* Film strip */
        .strip-zone { border-bottom:1px solid rgba(255,255,255,0.06); background:var(--bg); position:relative; }
        #film-strip { display:flex; gap:3px; padding:10px var(--pad); overflow-x:auto; height:calc(var(--strip-h) + 20px); scrollbar-width:none; }
        #film-strip::-webkit-scrollbar { display:none; }
        .strip-thumb { flex-shrink:0; width:var(--strip-h); height:var(--strip-h); overflow:hidden; cursor:pointer; border-radius:6px; background:var(--surface); outline:2px solid transparent; transition:opacity .2s,outline .1s; }
        .strip-thumb.active { outline:2px solid var(--accent2); }
        .strip-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .strip-thumb:hover { opacity:.82; }
        .strip-arrow { position:absolute; top:50%; transform:translateY(-50%); z-index:10; width:28px; height:44px; display:flex; align-items:center; justify-content:center; background:#861442; border:1px solid #861442; border-radius:6px; cursor:pointer; color:#f0ede8; font-size:18px; line-height:1; transition:background .2s,color .2s; padding:0; }
        .strip-arrow.left { left:8px; }
        .strip-arrow.right { right:8px; }
        .strip-arrow:hover { background:#111110; border-color:#111110; }

        /* Preset grid */
        .preset-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:0 var(--pad) 1.25rem; max-width:var(--max); margin:0 auto; }
        .preset-card { position:relative; border-radius:var(--radius); overflow:hidden; cursor:pointer; border:1px solid var(--border); transition:border-color .2s,transform .15s; aspect-ratio:4/3; background:var(--surface); }
        .preset-card:hover { border-color:var(--accent2); transform:translateY(-2px); }
        .preset-card img { width:100%; height:100%; object-fit:cover; display:block; }
        .preset-overlay { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 100%); padding:20px 10px 8px; }
        .preset-swatches { display:flex; gap:3px; margin-bottom:6px; }
        .preset-swatch { flex:1; height:8px; border-radius:3px; border:1px solid rgba(255,255,255,0.12); }
        .preset-meta { display:flex; align-items:baseline; justify-content:space-between; gap:6px; }
        .preset-name { font-size:10px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.9); }
        .preset-credit { font-size:9px; color:rgba(255,255,255,.4); }
        @media (max-width:600px) { .preset-grid { grid-template-columns:repeat(2,1fr); } }

        /* Content zone */
        #content-zone { display:flex; align-items:flex-start; background:var(--bg); max-width:var(--max); margin:0 auto; }
        #selected-col { width:280px; flex-shrink:0; border-right:1px solid var(--border); padding:1.25rem var(--pad); }
        .selected-col-label { font-size:11px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:var(--accent2); margin-bottom:10px; }
        #selected-img { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; border-radius:8px; border:1px solid var(--border); }
        .mini-palette { display:flex; height:5px; border-radius:3px; overflow:hidden; margin-top:6px; }
        .mini-swatch { flex:1; transition:background .5s ease; }
        .color-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-top:14px; }
        .color-grid-cell { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; }
        .color-grid-swatch { width:100%; aspect-ratio:2/1; border-radius:5px; border:1px solid var(--border); transition:transform .15s; }
        .color-grid-cell:hover .color-grid-swatch { transform:scale(1.05); }
        .color-grid-hex { font-size:12px; font-weight:500; color:var(--text); }
        .color-grid-role { font-size:11px; font-weight:400; color:var(--muted); text-align:center; }
        .regen-row { display:flex; gap:8px; margin-top:14px; }
        .regen-row .btn-primary { flex:1; font-size:12px; padding:8px 12px 10px; display:flex; align-items:center; justify-content:center; gap:5px; }
        .regen-row .btn-ghost { flex:1; font-size:12px; padding:7px 12px; }

        /* Mockup */
        #mockup-col { flex:1; overflow-y:auto; padding:0; min-width:0; }
        .newsletter-mockup { border-radius:var(--radius); overflow:hidden; border:1px solid var(--border); }
        .mock-nav { padding:14px 24px; display:flex; align-items:center; justify-content:space-between; transition:background .5s ease; }
        .mock-nav-logo { font-size:1rem; font-weight:700; font-family:Georgia,serif; transition:color .5s ease; }
        .mock-nav-links { display:flex; gap:16px; font-size:12px; opacity:.7; font-family:Georgia,serif; transition:color .5s ease; }
        .mock-hero { padding:40px 32px 36px; transition:background .5s ease; }
        .mock-eyebrow { font-size:10px; letter-spacing:.14em; text-transform:uppercase; margin-bottom:12px; transition:color .5s ease; font-family:var(--font-body); }
        .mock-headline { font-size:1.8rem; font-weight:700; line-height:1.2; margin-bottom:12px; transition:color .5s ease; font-family:Georgia,serif; }
        .mock-subhead { font-size:14px; line-height:1.6; opacity:.75; margin-bottom:22px; max-width:380px; transition:color .5s ease; font-family:Georgia,serif; }
        .mock-btn { padding:10px 20px; border-radius:7px; border:none; cursor:pointer; font-size:13px; font-weight:700; font-family:Georgia,serif; transition:background .5s ease,color .5s ease; }
        .mock-body { padding:24px 32px; display:grid; grid-template-columns:1fr 1fr; gap:14px; transition:background .5s ease; }
        .mock-card { padding:16px; border-radius:8px; transition:background .5s ease; }
        .mock-card-label { font-size:9px; letter-spacing:.1em; text-transform:uppercase; margin-bottom:6px; transition:color .5s ease; font-family:var(--font-body); }
        .mock-card-title { font-size:15px; font-weight:700; line-height:1.3; margin-bottom:5px; transition:color .5s ease; font-family:Georgia,serif; }
        .mock-card-text { font-size:12px; line-height:1.5; opacity:.7; transition:color .5s ease; font-family:Georgia,serif; }
        .mock-footer-bar { padding:12px 32px; display:flex; align-items:center; justify-content:space-between; font-size:10px; font-family:var(--font-body); transition:background .5s ease,color .5s ease; }

        /* Skeleton */
        .skel-bar { background:#3e3e3b; border-radius:4px; }

        /* Newsletter */
        .nl-zone { background: #111110; padding: 2.5rem var(--pad); border-top: 1.5px solid rgba(134,20,66,0.5); }
        .nl-card { max-width: 640px; margin: 0 auto; }
        .nl-eyebrow { font-family: var(--font-body); font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent2); margin-bottom: 8px; }
        .nl-heading { font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #f0ede8; line-height: 1.65; margin-bottom: 2px; }
        .nl-body { font-family: var(--font-body); font-size: 13px; font-weight: 300; color: var(--muted); line-height: 1.65; margin-bottom: 1.25rem; }
        .nl-form { display: flex; gap: 8px; flex-wrap: wrap; }
        .nl-field { flex: 1; min-width: 120px; background: #1a1a18; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 9px 12px; font-family: var(--font-body); font-size: 13px; font-weight: 300; color: #f0ede8; -webkit-text-fill-color: #f0ede8; outline: none; transition: border-color 0.2s; }
        .nl-field:focus { border-color: #861442; }
        .nl-field::placeholder { color: #5a5a56; }
        .nl-field:-webkit-autofill,
        .nl-field:-webkit-autofill:hover,
        .nl-field:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0 1000px #1a1a18 inset !important; -webkit-text-fill-color: #f0ede8 !important; caret-color: #f0ede8; border-color: #861442; }
        .nl-btn { background: #861442; color: #fff; border: none; border-radius: var(--radius); padding: 10px 22px; font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; letter-spacing: 0.04em; transition: opacity 0.15s; white-space: nowrap; }
        .nl-btn:hover { opacity: 0.88; }
        .nl-thanks { font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #4caf8a; margin-top: 10px; }

        /* Page footer */
        .page-footer { background:#111110; padding:1.25rem var(--pad); font-family:var(--font-body); font-size:11px; font-weight:400; color:rgba(255,255,255,0.25); line-height:2; text-align:center; }
        .page-footer a { color:rgba(255,255,255,0.3); text-decoration:none; }
        .page-footer a:hover { color:#be3650; }

        @media (max-width:600px) { #content-zone { flex-direction:column; } #selected-col { width:100%; border-right:none; border-bottom:1px solid var(--border); } .regen-row { flex-direction:column; } }
        @media print { .no-print { display:none !important; } }
      `}</style>

      <canvas ref={canvasRef} />
      <h1 className="seo-h1">Color Palette Generator — Free Brand Color Mini-App | Data on Tap</h1>

      <div style={{ maxWidth: 860, margin: '0 auto', overflow: 'hidden' }}>

        {/* ── HERO ── */}
        <div className="dot-hero" style={{ minHeight: phase === 'landing' ? 220 : 100, maxHeight: phase === 'landing' ? 280 : 120 }}>
          <div className="dot-hero-inner">
            <div className="dot-hero-left">
              <div className="dot-hero-logo">
                <SkylineIcon size={54} />
                <div className="dot-hero-title"><strong>Color Palette</strong> <em>Generator</em></div>
              </div>
              {phase === 'landing' && (
                <div className="dot-hero-sub">
                  <p style={{ fontWeight: 500, color: '#f0ede8' }}>Pick any image. Get an instant color palette.</p>
                  <p>Search millions of royalty-free Pixabay photos, illustrations, and textures. Select the image that fits your brand vibe, and get six brand colors in seconds. Don't like the first option? Click "Refresh" to get more options.</p>
                </div>
              )}
              {phase !== 'landing' && (
                <button className="btn-primary no-print" onClick={resetApp} style={{ alignSelf: 'flex-start', fontSize: 12, padding: '7px 16px 9px' }}>← Start over</button>
              )}
            </div>
            {phase === 'landing' && (
              <div className="dot-hero-right">
                <img src="/images/color-palette-hero.png" alt="Color Palette Generator" />
              </div>
            )}
          </div>
        </div>
        <div className="page-footer-rule" />

        {/* ── INPUT ZONE ── */}
        <div className="dot-input-zone" style={{ paddingTop: '1.5rem' }}>
          <div className="dot-input-card">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') doSearch(); }}
              placeholder="Try: golden hour, moody ocean, vintage roadster…"
            />
            <select value={imgType} onChange={e => setImgType(e.target.value)}>
              <option value="photo">Photos</option>
              <option value="illustration">Illustrations</option>
              <option value="vector">Vectors</option>
            </select>
            <button className="btn-primary" onClick={() => doSearch()}>Search Images</button>
          </div>
        </div>

        {/* ── LANDING ── */}
        {phase === 'landing' && (
          <div className="dot-anim">
            <div style={{ textAlign: 'center', padding: '3rem var(--pad) 2rem', maxWidth: 'var(--max)', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: 20, color: 'var(--text)', lineHeight: 1.3 }}>
                Search a theme. Pick an image.<br /><em style={{ fontStyle: 'italic', color: '#be3650' }}>Watch your color palette come to life.</em>
              </h2>
            </div>
            <div className="preset-grid">
              {[
                { label: 'California Sunset', credit: 'diego_torres', src: '/images/diego_torres-sunset-815270.jpg', query: 'poppy field sunset', swatches: ['#e8823a','#d4a882','#c4604a','#f0c878','#7a8c6a'] },
                { label: 'Ancient Monument', credit: 'arttower', src: '/images/arttower-monument-valley-51576_1280.jpg', query: 'monument valley desert', swatches: ['#b85c30','#d4aa78','#7ab0cc','#e8d8b8','#4a2e1a'] },
                { label: 'Moody Ocean', credit: 'dimitrisvetsikas1969', src: '/images/dimitrisvetsikas1969-wave-5959087_1280.jpg', query: 'ocean wave storm', swatches: ['#1e2e40','#3a5a6e','#7a9aaa','#c8d4d8','#e8ece8'] },
                { label: 'Vintage Roadster', credit: 'noel_bauza', src: '/images/noel_bauza-oldtimer-1197800.jpg', query: 'vintage classic car cuba', swatches: ['#b83020','#c8a860','#8a8272','#d8cbb0','#3a3028'] },
                { label: 'Pretty in Pink', credit: 'jillwellington', src: '/images/jillwellington-pink-lemonade-795029.jpg', query: 'pink flowers summer garden', swatches: ['#e8a0b8','#f0c8d4','#f5e8e0','#e8d0c0','#c87890'] },
                { label: 'Enchanted Forest', credit: 'felix_mittermeier', src: '/images/felix-mittermeier-sunrise-3447463.jpg', query: 'forest mountain sunrise', swatches: ['#1e3a28','#4a6e50','#8aaa7a','#d4b878','#a8b8c8'] },
              ].map(p => (
                <div className="preset-card" key={p.label} onClick={() => { setQuery(p.query); doSearch(p.query, imgType, false, true); }}>
                  <img src={p.src} alt={p.label} loading="lazy" />
                  <div className="preset-overlay">
                    <div className="preset-swatches">{p.swatches.map(s => <div className="preset-swatch" key={s} style={{ background: s }} />)}</div>
                    <div className="preset-meta"><div className="preset-name">{p.label}</div><div className="preset-credit">{p.credit}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FILM STRIP ── */}
        {(phase === 'results' || phase === 'palette') && (
          <div className="strip-zone">
            {hits.length > 5 && (
              <button className="strip-arrow left" onClick={() => stripRef.current?.scrollBy({ left: -320, behavior: 'smooth' })} aria-label="Scroll left">‹</button>
            )}
            <div id="film-strip" ref={stripRef}>
              {hits.map((hit) => (
                <div
                  key={hit.id}
                  className={`strip-thumb${currentHit?.id === hit.id ? ' active' : ''}`}
                  onClick={() => selectImage(hit)}
                >
                  <img src={hit.previewURL} alt={hit.tags} loading="lazy" crossOrigin="anonymous" />
                </div>
              ))}
            </div>
            {hits.length > 5 && (
              <button className="strip-arrow right" onClick={() => stripRef.current?.scrollBy({ left: 320, behavior: 'smooth' })} aria-label="Scroll right">›</button>
            )}
          </div>
        )}

        {/* ── SELECT PROMPT / SKELETON ── */}
        {phase === 'results' && (
          <>
            <div style={{ padding: '0.5rem var(--pad) 0.25rem' }}>
              <span style={{ fontSize: 12, fontWeight: 300, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#f0ede8' }}>↓ Select an image to generate your palette</span>
            </div>
            <div style={{ maxWidth: 'var(--max)', margin: '0 auto', display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '1.25rem var(--pad)' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#be3650', marginBottom: 10 }}>selected image</div>
                <div className="skel-bar" style={{ width: '100%', aspectRatio: '4/3', borderRadius: 8 }} />
                <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', marginTop: 6 }}>
                  {[1, 0.7, 0.5, 0.35, 0.25, 0.2].map((o, i) => <div key={i} className="skel-bar" style={{ flex: 1, height: 5, borderRadius: 0, opacity: o }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 14 }}>
                  {[1, 0.8, 0.6, 0.5, 0.4, 0.3].map((o, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div className="skel-bar" style={{ width: '100%', aspectRatio: '2/1', borderRadius: 5, opacity: o }} />
                      <div className="skel-bar" style={{ width: '60%', height: 9, marginTop: 2 }} />
                      <div className="skel-bar" style={{ width: '80%', height: 8, opacity: 0.6 }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <div className="skel-bar" style={{ flex: 1, height: 36, borderRadius: 'var(--radius)' }} />
                  <div className="skel-bar" style={{ flex: 1, height: 36, borderRadius: 'var(--radius)', opacity: 0.5 }} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#be3650', padding: '1.25rem 0 1rem var(--pad)' }}>website preview</div>
                <div style={{ margin: '0 var(--pad)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', opacity: 0.45 }}>
                  <div style={{ background: '#2e2e2b', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="skel-bar" style={{ width: 120, height: 14 }} />
                    <div style={{ display: 'flex', gap: 12 }}>{[36, 36, 36].map((w, i) => <div key={i} className="skel-bar" style={{ width: w, height: 10 }} />)}</div>
                  </div>
                  <div style={{ background: '#242422', padding: '40px 32px 36px' }}>
                    <div className="skel-bar" style={{ width: 60, height: 9, marginBottom: 12 }} />
                    <div className="skel-bar" style={{ width: 220, height: 22, marginBottom: 10 }} />
                    <div className="skel-bar" style={{ width: '90%', height: 12, marginBottom: 6 }} />
                    <div className="skel-bar" style={{ width: '75%', height: 12, marginBottom: 22 }} />
                    <div className="skel-bar" style={{ width: 100, height: 34, borderRadius: 7 }} />
                  </div>
                  <div style={{ background: '#1e1e1c', padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[0, 1].map(i => (
                      <div key={i} style={{ background: '#2a2a28', borderRadius: 8, padding: 16 }}>
                        <div className="skel-bar" style={{ width: 120, height: 14, marginBottom: 6 }} />
                        <div className="skel-bar" style={{ width: '100%', height: 10, marginBottom: 4 }} />
                        <div className="skel-bar" style={{ width: '75%', height: 10 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#2e2e2b', padding: '12px 32px', display: 'flex', justifyContent: 'space-between' }}>
                    <div className="skel-bar" style={{ width: 100, height: 9 }} />
                    <div className="skel-bar" style={{ width: 80, height: 9 }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PALETTE / MOCKUP ── */}
        {phase === 'palette' && cs && currentHit && (
          <div id="content-zone" className="dot-anim">
            <div id="selected-col">
              <div className="selected-col-label">{currentHit.tags.split(',')[0].trim().toLowerCase()}</div>
              <img id="selected-img" src={currentHit.webformatURL} alt={currentHit.tags} crossOrigin="anonymous" />
              <div className="mini-palette">
                {cs.all.slice(0, 6).map((c, i) => <div key={i} className="mini-swatch" style={{ background: c.hex, flex: c.role === 'cta / accent' ? 0.5 : 1 }} />)}
              </div>
              <div className="color-grid">
                {cs.all.slice(0, 6).map((c, i) => (
                  <div key={i} className="color-grid-cell" onClick={() => copyHex(c.hex)}>
                    <div className="color-grid-swatch" style={{ background: c.hex }} />
                    <div className="color-grid-hex">{c.hex.toUpperCase()}</div>
                    <div className="color-grid-role">{c.role}</div>
                  </div>
                ))}
              </div>
              <div className="regen-row no-print">
                <button className="btn-primary regen-btn" onClick={regenerate} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className={regenSpinning ? 'spinning' : ''}>↻</span> New mood
                </button>
                <button className="btn-primary" onClick={downloadSVG}>↓ Export</button>
              </div>
            </div>

            <div id="mockup-col">
              <div className="selected-col-label" style={{ padding: '1.25rem var(--pad) 1rem' }}>website preview</div>
              <div className="newsletter-mockup" style={{ margin: '0 var(--pad)' }}>
                <div className="mock-nav" style={{ background: cs.nav.hex }}>
                  <div className="mock-nav-logo" style={{ color: contrastColor(cs.nav.hex) }}>MyWebsite.com</div>
                  <div className="mock-nav-links" style={{ color: contrastColor(cs.nav.hex) }}><span>About</span><span>Archive</span><span>Subscribe</span></div>
                </div>
                <div className="mock-hero" style={{ background: cs.hero.hex }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div className="mock-eyebrow" style={{ color: cs.accent.hex }}>Latest Issue</div>
                      <div className="mock-headline" style={{ color: contrastColor(cs.hero.hex) }}>The Big Idea</div>
                      <div className="mock-subhead" style={{ color: contrastColor(cs.hero.hex) }}>Every week — one big idea, two news items, and one great question.</div>
                      <button className="mock-btn" style={{ background: cs.accent.hex, color: '#ffffff' }}>Subscribe →</button>
                    </div>
                    <img src={currentHit.webformatURL} alt="" crossOrigin="anonymous" style={{ width: 160, aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8, flexShrink: 0, opacity: 0.9 }} />
                  </div>
                </div>
                <div className="mock-body" style={{ background: cs.background.hex }}>
                  {['This week', 'The Big Reveal'].map((label, i) => (
                    <div key={i} className="mock-card" style={{ background: cs.card.hex }}>
                      <div className="mock-card-label" style={{ color: contrastColor(cs.card.hex) }}>{label}</div>
                      <div className="mock-card-title" style={{ color: contrastColor(cs.card.hex) }}>{i === 0 ? 'Did You See the News?' : 'Two links, no clickbait'}</div>
                      <div className="mock-card-text" style={{ color: contrastColor(cs.card.hex) }}>{i === 0 ? "Everyone's talking about this." : "Here's the latest news."}</div>
                    </div>
                  ))}
                </div>
                <div className="mock-footer-bar" style={{ background: cs.nav.hex, color: contrastColor(cs.nav.hex) }}>
                  <span>© 2026 MyWebsite.com</span>
                  <span style={{ opacity: 0.6 }}>Unsubscribe · Privacy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER RULE ── */}
        <div className="page-footer-rule" />

      </div>{/* /860px wrapper */}

      {/* ── SUBSCRIBE ZONE ── */}
      <div className="nl-zone">
        <div className="nl-card">
          <div className="nl-eyebrow">Subscribe Now</div>
          <div className="nl-heading">Turn what you know into what you're known for.</div>
          <p className="nl-body">Weekly tips on using AI to organize, share, and monetize your expertise.</p>
          {footerThanks ? (
            <div className="nl-thanks">✓ You've been subscribed. Watch your email for a welcome note from Monica.</div>
          ) : (
            <div className="nl-form">
              <input type="text" className="nl-field" placeholder="First name" value={footerFirst} onChange={e => setFooterFirst(e.target.value)} />
              <input type="email" className="nl-field" placeholder="your@email.com" value={footerEmail} onChange={e => setFooterEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitFooterEmail()} />
              <button className="nl-btn" onClick={submitFooterEmail}>Subscribe Now →</button>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="page-footer-rule" />
      <div className="page-footer">
        © 2026 Color Palette Generator &nbsp;◆&nbsp; <a href="https://dataontap.dev" target="_blank" rel="noopener noreferrer">Data on Tap</a> &nbsp;◆&nbsp; <a href="https://monicapoling.com/data-on-tap" target="_blank" rel="noopener noreferrer">monicapoling.com/data-on-tap</a>
        &nbsp;◆&nbsp; Photos © {currentHit ? <a href={currentHit.pageURL} target="_blank" rel="noopener noreferrer">{currentHit.user}</a> : <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer">Pixabay</a>}
      </div>

      <Toast message={toast} />
    </>
  );
}
