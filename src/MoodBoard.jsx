import { useState } from "react";

const OPTIONS = {
  colors: [
    { id: "nude", label: "Nude & Neutrals", color: "#d4b89a", emoji: "🤎" },
    { id: "pink", label: "Pinks", color: "#e8829a", emoji: "🩷" },
    { id: "red", label: "Reds & Berries", color: "#c4415a", emoji: "❤️" },
    { id: "dark", label: "Darks & Blacks", color: "#2a1525", emoji: "🖤" },
    { id: "neon", label: "Neons & Brights", color: "#39ff14", emoji: "💚" },
    { id: "pastel", label: "Pastels", color: "#b8d4f0", emoji: "🩵" },
    { id: "white", label: "White & Chrome", color: "#f0ebe3", emoji: "🤍" },
    { id: "multi", label: "Multicolor", color: "linear-gradient(135deg, #e8829a, #c4415a, #7a2840)", emoji: "🌈" },
  ],
  vibe: [
    { id: "minimal", label: "Minimalist", desc: "Clean, simple, understated", emoji: "✨" },
    { id: "glam", label: "Glam", desc: "Bold, sparkly, statement", emoji: "💎" },
    { id: "edgy", label: "Edgy", desc: "Dark, sharp, avant-garde", emoji: "🖤" },
    { id: "cute", label: "Cute & Girly", desc: "Sweet, fun, playful", emoji: "🎀" },
    { id: "elegant", label: "Elegant", desc: "Sophisticated, timeless", emoji: "🌹" },
    { id: "artsy", label: "Artsy", desc: "Creative, unique, detailed", emoji: "🎨" },
  ],
  style: [
    { id: "solid", label: "Solid Color", emoji: "⬛" },
    { id: "french", label: "French / Ombre Tips", emoji: "🌅" },
    { id: "marble", label: "Marble / Abstract", emoji: "🌊" },
    { id: "floral", label: "Floral", emoji: "🌸" },
    { id: "3d", label: "3D Art / Charms", emoji: "💫" },
    { id: "chrome", label: "Chrome / Mirror", emoji: "🪞" },
    { id: "glitter", label: "Glitter / Foil", emoji: "✨" },
    { id: "handpainted", label: "Hand Painted", emoji: "🖌️" },
  ],
  shape: [
    { id: "coffin", label: "Coffin", emoji: "⬡" },
    { id: "stiletto", label: "Stiletto", emoji: "▲" },
    { id: "almond", label: "Almond", emoji: "🥚" },
    { id: "square", label: "Square", emoji: "⬜" },
    { id: "oval", label: "Oval", emoji: "⭕" },
    { id: "squoval", label: "Squoval", emoji: "🔲" },
  ],
  length: [
    { id: "short", label: "Short", desc: "XS–S", emoji: "▪️" },
    { id: "medium", label: "Medium", desc: "M", emoji: "▫️" },
    { id: "long", label: "Long", desc: "L", emoji: "◻️" },
    { id: "xl", label: "Extra Long", desc: "XL", emoji: "⬜" },
  ],
};

const STEPS = [
  { key: "colors", title: "Pick Your Colors", sub: "Select all that speak to you", multi: true },
  { key: "vibe", title: "What's Your Vibe?", sub: "Pick the energy you're going for", multi: false },
  { key: "style", title: "Choose Your Style", sub: "Select all styles you love", multi: true },
  { key: "shape", title: "Pick Your Shape", sub: "What shape are you feeling?", multi: false },
  { key: "length", title: "How Long?", sub: "Pick your preferred length", multi: false },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #0f0a0c; --bg2: #1a1015; --bg3: #221520;
    --border: #3a1f2e; --border2: #4d2a3d;
    --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840;
    --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; position: relative; overflow-x: hidden; }
  .page::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%),
      radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 17px 12px at 55% 38%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.7;
  }
  .page > * { position: relative; z-index: 1; }

  .header { text-align: center; padding: 48px 24px 36px; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, #1e0d16 0%, transparent 100%); }
  .header-sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 18px; display: block; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(36px, 7vw, 58px); font-weight: 700; font-style: italic; color: var(--text); line-height: 1; text-shadow: 0 0 60px #c4415a55; }
  .header h1 span { color: var(--rose-lt); }
  .header-sub { margin-top: 10px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); }
  .header-divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; color: var(--rose-dim); font-size: 11px; letter-spacing: 3px; }
  .header-divider::before, .header-divider::after { content: ''; width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-dim)); }
  .header-divider::after { transform: scaleX(-1); }

  .nav { display: flex; justify-content: center; padding: 16px 24px; border-bottom: 1px solid var(--border); background: var(--bg2); flex-wrap: wrap; gap: 4px; }
  .nav a { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); text-decoration: none; padding: 8px 16px; border: 1px solid transparent; transition: all 0.2s; }
  .nav a:hover { color: var(--rose-lt); border-color: var(--border2); }
  .nav a.active { color: var(--rose-lt); border-color: var(--rose-dim); }

  .container { max-width: 760px; margin: 0 auto; padding: 48px 24px; }

  /* PROGRESS */
  .progress-bar { display: flex; gap: 4px; margin-bottom: 40px; }
  .progress-step { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .progress-step.done { background: var(--rose-dim); }
  .progress-step.active { background: var(--rose); }

  /* STEP */
  .step-header { margin-bottom: 32px; }
  .step-tag { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rose); margin-bottom: 10px; display: block; }
  .step-title { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 6px; }
  .step-sub { font-size: 12px; color: var(--dim); letter-spacing: 1px; }

  /* OPTIONS GRID */
  .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 32px; }
  .option-card {
    background: var(--bg2); border: 1px solid var(--border);
    padding: 16px 14px; cursor: pointer; transition: all 0.2s;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    text-align: center; position: relative; border-radius: 2px;
  }
  .option-card:hover { border-color: var(--border2); background: var(--bg3); }
  .option-card.selected { background: #200e18; border-color: var(--rose); box-shadow: 0 0 16px #c4415a22; }
  .option-card.selected::before { content: '✓'; position: absolute; top: 8px; right: 10px; font-size: 10px; color: var(--rose); }
  .option-emoji { font-size: 24px; }
  .option-color { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border2); flex-shrink: 0; }
  .option-label { font-size: 12px; color: var(--text); font-weight: 400; line-height: 1.3; }
  .option-desc { font-size: 10px; color: var(--dim); letter-spacing: 0.5px; }

  /* MOOD BOARD PREVIEW */
  .moodboard-preview {
    background: var(--bg2); border: 1px solid var(--border);
    padding: 20px; margin-bottom: 32px; position: relative;
  }
  .moodboard-preview::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .preview-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose); margin-bottom: 14px; }
  .preview-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .preview-tag { padding: 5px 12px; background: var(--bg3); border: 1px solid var(--border2); font-size: 11px; color: var(--muted); border-radius: 20px; }
  .preview-empty { font-size: 12px; color: var(--dim); letter-spacing: 1px; }

  /* RESULT */
  .result-card { background: var(--bg2); border: 1px solid var(--border); padding: 28px; position: relative; margin-bottom: 24px; }
  .result-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .result-title { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--text); margin-bottom: 16px; }
  .result-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .result-row:last-child { border-bottom: none; }
  .result-key { color: var(--muted); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
  .result-val { color: var(--text); text-align: right; max-width: 60%; }
  .result-colors { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap; }
  .result-color-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--border2); }

  /* BUTTONS */
  .btn-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .btn { padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; text-decoration: none; display: inline-block; }
  .btn-primary { background: var(--rose); color: white; box-shadow: 0 4px 20px #c4415a44; }
  .btn-primary:hover { background: #d4506a; transform: translateY(-1px); }
  .btn-primary:disabled { background: var(--border2); color: var(--dim); cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }
  .btn-secondary { background: var(--bg2); border: 1px solid var(--rose-dim); color: var(--rose-lt); }
  .btn-secondary:hover { background: #200e18; }

  .footer { border-top: 1px solid var(--border); padding: 32px 24px; text-align: center; background: var(--bg2); }
  .footer-copy { font-size: 11px; color: var(--dim); }
  .footer-copy a { color: var(--rose-dim); text-decoration: none; }
`;

export default function MoodBoard() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({ colors: [], vibe: [], style: [], shape: [], length: [] });
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  function toggle(key, id, multi) {
    setSelections(prev => {
      if (multi) {
        const already = prev[key].includes(id);
        return { ...prev, [key]: already ? prev[key].filter(x => x !== id) : [...prev[key], id] };
      } else {
        return { ...prev, [key]: [id] };
      }
    });
  }

  function isSelected(key, id) {
    return selections[key].includes(id);
  }

  function canProceed() {
    return selections[current.key].length > 0;
  }

  function getLabel(key, id) {
    return OPTIONS[key].find(o => o.id === id)?.label || id;
  }

  function buildNotes() {
    const parts = [];
    if (selections.colors.length) parts.push(`Colors: ${selections.colors.map(id => getLabel('colors', id)).join(', ')}`);
    if (selections.vibe.length) parts.push(`Vibe: ${selections.vibe.map(id => getLabel('vibe', id)).join(', ')}`);
    if (selections.style.length) parts.push(`Style: ${selections.style.map(id => getLabel('style', id)).join(', ')}`);
    if (selections.shape.length) parts.push(`Shape: ${selections.shape.map(id => getLabel('shape', id)).join(', ')}`);
    if (selections.length.length) parts.push(`Length: ${selections.length.map(id => getLabel('length', id)).join(', ')}`);
    return parts.join(' | ');
  }

  function buildBookingUrl() {
    const notes = encodeURIComponent(`🎨 Mood Board: ${buildNotes()}`);
    return `/?moodboard=${notes}`;
  }

  const allTags = Object.entries(selections).flatMap(([key, ids]) => ids.map(id => getLabel(key, id)));

  if (done) {
    return (
      <>
        <style>{styles}</style>
        <div className="page">
          <div className="header">
            <span className="header-sparkle">✦ ✦ ✦</span>
            <h1><span>Acrylic</span> Faerie</h1>
            <p className="header-sub">Your Nail Mood Board</p>
          </div>
          <div className="container">
            <div style={{textAlign:"center",marginBottom:32}}>
              <span style={{fontSize:13,letterSpacing:4,color:"var(--rose)",display:"block",marginBottom:12}}>Your Vibe is Ready</span>
              <h2 style={{fontFamily:"Playfair Display, serif",fontSize:28,fontStyle:"italic",fontWeight:400,color:"var(--text)"}}>Here's Your Mood Board ✦</h2>
            </div>

            <div className="result-card">
              <div className="result-title">Your Nail Vision</div>
              {selections.colors.length > 0 && (
                <div className="result-row">
                  <span className="result-key">Colors</span>
                  <div className="result-colors">
                    {selections.colors.map(id => {
                      const opt = OPTIONS.colors.find(o => o.id === id);
                      return <span key={id} style={{fontSize:11,color:"var(--muted)",background:"var(--bg3)",border:"1px solid var(--border2)",padding:"3px 10px",borderRadius:20}}>{opt?.emoji} {opt?.label}</span>;
                    })}
                  </div>
                </div>
              )}
              {selections.vibe.length > 0 && (
                <div className="result-row">
                  <span className="result-key">Vibe</span>
                  <span className="result-val">{selections.vibe.map(id => getLabel('vibe', id)).join(', ')}</span>
                </div>
              )}
              {selections.style.length > 0 && (
                <div className="result-row">
                  <span className="result-key">Style</span>
                  <span className="result-val">{selections.style.map(id => getLabel('style', id)).join(', ')}</span>
                </div>
              )}
              {selections.shape.length > 0 && (
                <div className="result-row">
                  <span className="result-key">Shape</span>
                  <span className="result-val">{selections.shape.map(id => getLabel('shape', id)).join(', ')}</span>
                </div>
              )}
              {selections.length.length > 0 && (
                <div className="result-row">
                  <span className="result-key">Length</span>
                  <span className="result-val">{selections.length.map(id => getLabel('length', id)).join(', ')}</span>
                </div>
              )}
            </div>

            <div style={{background:"var(--bg2)",border:"1px solid var(--border)",padding:"16px 20px",marginBottom:24,fontSize:12,color:"var(--muted)",lineHeight:1.8}}>
              <p style={{color:"var(--rose-lt)",marginBottom:6,fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>Your selections will be sent to Angie</p>
              <p>When you click "Book This Vibe", your mood board selections will automatically fill in the notes field so Angie knows exactly what you want before you arrive! 💕</p>
            </div>

            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <a href={buildBookingUrl()} className="btn btn-primary" style={{flex:2,textAlign:"center"}}>Book This Vibe ✦</a>
              <button className="btn btn-ghost" style={{flex:1}} onClick={() => { setDone(false); setStep(0); setSelections({ colors: [], vibe: [], style: [], shape: [], length: [] }); }}>Start Over</button>
            </div>
          </div>
          <div className="footer"><p className="footer-copy">© 2026 Acrylic Faerie · <a href="/">acrylicfaerie.com</a></p></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          <div className="header-divider">Nail Mood Board</div>
        </div>

        <nav className="nav">
          <a href="/">Book Now</a>
          <a href="/portfolio">Gallery</a>
          <a href="/moodboard" className="active">Mood Board</a>
          <a href="/about">About</a>
        </nav>

        <div className="container">
          <div className="progress-bar">
            {STEPS.map((s, i) => (
              <div key={i} className={`progress-step ${i < step ? "done" : i === step ? "active" : ""}`} />
            ))}
          </div>

          <div className="step-header">
            <span className="step-tag">Step {step + 1} of {STEPS.length}</span>
            <h2 className="step-title">{current.title}</h2>
            <p className="step-sub">{current.sub}{current.multi ? " — pick as many as you like" : ""}</p>
          </div>

          <div className="options-grid">
            {OPTIONS[current.key].map(opt => (
              <div
                key={opt.id}
                className={`option-card ${isSelected(current.key, opt.id) ? "selected" : ""}`}
                onClick={() => toggle(current.key, opt.id, current.multi)}
              >
                {current.key === "colors" ? (
                  <div className="option-color" style={{ background: opt.color }} />
                ) : (
                  <span className="option-emoji">{opt.emoji}</span>
                )}
                <div>
                  <div className="option-label">{opt.label}</div>
                  {opt.desc && <div className="option-desc">{opt.desc}</div>}
                </div>
              </div>
            ))}
          </div>

          {allTags.length > 0 && (
            <div className="moodboard-preview">
              <div className="preview-title">Your Mood Board So Far</div>
              <div className="preview-tags">
                {allTags.map((tag, i) => <span key={i} className="preview-tag">{tag}</span>)}
              </div>
            </div>
          )}

          <div className="btn-row">
            {step > 0
              ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
              : <span />}
            {step < STEPS.length - 1
              ? <button className="btn btn-primary" disabled={!canProceed()} onClick={() => setStep(s => s + 1)}>Next →</button>
              : <button className="btn btn-primary" disabled={!canProceed()} onClick={() => setDone(true)}>See My Mood Board ✦</button>
            }
          </div>
        </div>

        <div className="footer"><p className="footer-copy">© 2026 Acrylic Faerie · <a href="/">acrylicfaerie.com</a></p></div>
      </div>
    </>
  );
}
