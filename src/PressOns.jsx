import { useState } from "react";

const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";

const PRICES = { short: 20, medium: 25, long: 30, xl: 30 };
const ADDON_PRICE = 5;
const DELIVERY_FEE = 5;

const ADDONS = [
  { id: "3d_art", label: "3D Art", desc: "Sculpted dimensional designs" },
  { id: "charms", label: "Charms", desc: "Nail charms and decorations" },
  { id: "rhinestones", label: "Rhinestones", desc: "Crystal rhinestone accents" },
  { id: "chrome", label: "Chrome/Mirror", desc: "Chrome or mirror finish" },
  { id: "glitter", label: "Glitter/Foil", desc: "Glitter or foil accents" },
  { id: "handpainted", label: "Hand Painted Art", desc: "Custom hand painted designs" },
];

const SHAPES = ["Coffin", "Almond", "Stiletto", "Square", "Oval", "Squoval"];
const FINGERS = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
const SIZES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

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
  .page::before { content: ''; position: fixed; inset: 0; background-image: radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%), radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%), radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%), radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%); pointer-events: none; z-index: 0; opacity: 0.7; }
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

  .container { max-width: 820px; margin: 0 auto; padding: 48px 24px; }

  .steps-bar { display: flex; gap: 4px; margin-bottom: 40px; }
  .step-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .step-bar.done { background: var(--rose-dim); }
  .step-bar.active { background: var(--rose); }

  .section { background: var(--bg2); border: 1px solid var(--border); padding: 28px; margin-bottom: 20px; position: relative; }
  .section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .section-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose); margin-bottom: 16px; display: block; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--text); margin-bottom: 6px; }
  .section-sub { font-size: 12px; color: var(--dim); letter-spacing: 0.5px; margin-bottom: 20px; }

  .option-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .option-card { background: var(--bg); border: 1px solid var(--border); padding: 16px 14px; cursor: pointer; transition: all 0.2s; text-align: center; border-radius: 2px; position: relative; }
  .option-card:hover { border-color: var(--border2); background: var(--bg3); }
  .option-card.selected { background: #200e18; border-color: var(--rose); box-shadow: 0 0 16px #c4415a22; }
  .option-card.selected::after { content: '✓'; position: absolute; top: 8px; right: 10px; font-size: 10px; color: var(--rose); }
  .option-label { font-size: 13px; color: var(--text); font-weight: 400; margin-bottom: 4px; }
  .option-price { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--rose-lt); }
  .option-desc { font-size: 11px; color: var(--dim); margin-top: 4px; line-height: 1.4; }

  .addon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .addon-card { background: var(--bg); border: 1px solid var(--border); padding: 14px 16px; cursor: pointer; transition: all 0.2s; border-radius: 2px; position: relative; display: flex; align-items: flex-start; gap: 10px; }
  .addon-card:hover { border-color: var(--border2); }
  .addon-card.selected { background: #200e18; border-color: var(--rose); }
  .addon-check { width: 16px; height: 16px; border: 1px solid var(--border2); border-radius: 2px; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--rose); }
  .addon-card.selected .addon-check { background: var(--rose); border-color: var(--rose); color: white; }
  .addon-label { font-size: 13px; color: var(--text); font-weight: 400; }
  .addon-desc { font-size: 11px; color: var(--dim); margin-top: 2px; }
  .addon-price { font-size: 11px; color: var(--rose-lt); margin-top: 2px; }

  .sizes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 600px) { .sizes-grid { grid-template-columns: 1fr; } }
  .sizes-hand { }
  .sizes-hand-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: block; }
  .size-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .size-row:last-child { border-bottom: none; }
  .size-finger { font-size: 13px; color: var(--text); }
  .size-select { background: var(--bg); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 6px 12px; outline: none; border-radius: 2px; cursor: pointer; }
  .size-select:focus { border-color: var(--rose-dim); }

  .sizing-chart { background: var(--bg); border: 1px solid var(--border); padding: 16px 20px; margin-bottom: 20px; }
  .sizing-chart-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose); margin-bottom: 10px; display: block; }
  .sizing-chart-grid { display: flex; gap: 6px; flex-wrap: wrap; }
  .size-chip { padding: 4px 10px; background: var(--bg2); border: 1px solid var(--border); font-size: 11px; color: var(--muted); border-radius: 2px; }
  .size-mm { font-size: 10px; color: var(--dim); display: block; text-align: center; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .form-input { background: var(--bg); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 14px; outline: none; transition: border-color 0.2s; border-radius: 2px; }
  .form-input:focus { border-color: var(--rose-dim); box-shadow: 0 0 0 3px #c4415a18; }
  .form-input::placeholder { color: var(--dim); }
  textarea.form-input { resize: vertical; min-height: 80px; }

  .delivery-options { display: flex; gap: 10px; }
  .delivery-option { flex: 1; padding: 14px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; text-align: center; transition: all 0.2s; border-radius: 2px; }
  .delivery-option:hover { border-color: var(--border2); }
  .delivery-option.selected { background: #200e18; border-color: var(--rose); }
  .delivery-label { font-size: 13px; color: var(--text); font-weight: 400; }
  .delivery-sub { font-size: 11px; color: var(--dim); margin-top: 4px; }

  .inspo-drop { border: 1px dashed var(--border2); background: var(--bg); padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; border-radius: 2px; }
  .inspo-drop:hover { border-color: var(--rose-dim); background: var(--bg3); }
  .inspo-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .inspo-drop-text { font-size: 12px; color: var(--dim); letter-spacing: 1px; }
  .inspo-drop-text span { color: var(--rose-dim); }
  .inspo-previews { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .inspo-thumb-wrap { position: relative; }
  .inspo-thumb { width: 72px; height: 72px; object-fit: cover; border: 1px solid var(--border2); border-radius: 2px; }
  .inspo-remove { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%; background: var(--rose); border: none; color: white; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

  .order-summary { background: var(--bg2); border: 1px solid var(--border2); padding: 24px; margin-bottom: 24px; position: relative; }
  .order-summary::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-key { color: var(--muted); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
  .summary-val { color: var(--text); }
  .summary-total { display: flex; justify-content: space-between; padding-top: 16px; margin-top: 8px; border-top: 1px solid var(--border2); }
  .summary-total-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .summary-total-val { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: var(--rose-lt); }

  .btn-row { display: flex; justify-content: space-between; gap: 12px; margin-top: 32px; }
  .btn { padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; }
  .btn-primary { background: var(--rose); color: white; box-shadow: 0 4px 20px #c4415a44; }
  .btn-primary:hover { background: #d4506a; transform: translateY(-1px); }
  .btn-primary:disabled { background: var(--border2); color: var(--dim); cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }

  .footer { border-top: 1px solid var(--border); padding: 32px 24px; text-align: center; background: var(--bg2); }
  .footer-copy { font-size: 11px; color: var(--dim); }
  .footer-copy a { color: var(--rose-dim); text-decoration: none; }
`;

const STEPS = ["Material & Style", "Add-Ons", "Nail Sizes", "Your Info", "Review & Pay"];

export default function PressOns() {
  const [step, setStep] = useState(0);
  const [material, setMaterial] = useState("");
  const [shape, setShape] = useState("");
  const [length, setLength] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [delivery, setDelivery] = useState("pickup");
  const [nailSizes, setNailSizes] = useState({
    left: { thumb: "", index: "", middle: "", ring: "", pinky: "" },
    right: { thumb: "", index: "", middle: "", ring: "", pinky: "" },
  });
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [inspoFiles, setInspoFiles] = useState([]);
  const [inspoUploading, setInspoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function calcTotal() {
    const base = PRICES[length] || 0;
    const addons = selectedAddons.length * ADDON_PRICE;
    const del = delivery === "delivery" ? DELIVERY_FEE : 0;
    return base + addons + del;
  }

  function toggleAddon(id) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function setSize(hand, finger, val) {
    setNailSizes(prev => ({ ...prev, [hand]: { ...prev[hand], [finger]: val } }));
  }

  async function handleInspoUpload(files) {
    if (!files || files.length === 0) return;
    setInspoUploading(true);
    const newFiles = Array.from(files);
    const previews = newFiles.map(f => ({ preview: URL.createObjectURL(f), url: "", uploading: true }));
    setInspoFiles(prev => [...prev, ...previews]);
    const uploaded = await Promise.all(newFiles.map(async (file, i) => {
      try {
        const fileName = `pressons-${Date.now()}-${i}-${file.name.replace(/ /g, '-')}`;
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/inspo/${fileName}`, {
          method: "POST",
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": file.type },
          body: file,
        });
        if (res.ok) return { preview: URL.createObjectURL(file), url: `${SUPABASE_URL}/storage/v1/object/public/inspo/${fileName}`, uploading: false };
      } catch { }
      return { preview: URL.createObjectURL(file), url: "", uploading: false };
    }));
    setInspoFiles(prev => [...prev.slice(0, prev.length - newFiles.length), ...uploaded]);
    setInspoUploading(false);
  }

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      const total = calcTotal() * 100; // cents
      const res = await fetch("/api/create-pressons-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: form.name,
          clientEmail: form.email,
          clientPhone: form.phone,
          material, shape, length,
          addons: selectedAddons.map(id => ADDONS.find(a => a.id === id)?.label),
          nailSizes, notes: form.notes,
          inspoUrls: inspoFiles.map(f => f.url).filter(Boolean),
          total, delivery,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Something went wrong. Please try again.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canProceed = [
    material && shape && length,
    true, // addons optional
    Object.values(nailSizes.left).every(v => v) && Object.values(nailSizes.right).every(v => v),
    form.name && form.email && form.phone,
    true,
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          <div className="header-divider">Custom Press-On Nails</div>
        </div>

        <nav className="nav">
          <a href="/">Book Appointment</a>
          <a href="/portfolio">Gallery</a>
          <a href="/pressons" className="active">Press-Ons</a>
          <a href="/about">About</a>
        </nav>

        <div className="container">
          <div className="steps-bar">
            {STEPS.map((_, i) => <div key={i} className={`step-bar ${i < step ? "done" : i === step ? "active" : ""}`} />)}
          </div>

          {/* STEP 0 — MATERIAL & STYLE */}
          {step === 0 && (
            <>
              <div className="section">
                <span className="section-label">Step 1 of 5</span>
                <h2 className="section-title">Choose Your Material</h2>
                <div className="option-grid">
                  {["Builder Gel", "Acrylic"].map(m => (
                    <div key={m} className={`option-card ${material === m ? "selected" : ""}`} onClick={() => setMaterial(m)}>
                      <div className="option-label">{m}</div>
                      <div className="option-desc">{m === "Builder Gel" ? "Lightweight, flexible, natural feel" : "Durable, strong, long-lasting"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <span className="section-label">Shape</span>
                <div className="option-grid">
                  {SHAPES.map(s => (
                    <div key={s} className={`option-card ${shape === s ? "selected" : ""}`} onClick={() => setShape(s)}>
                      <div className="option-label">{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <span className="section-label">Length & Pricing</span>
                <div className="option-grid">
                  {[
                    { id: "short", label: "Short", price: "$20" },
                    { id: "medium", label: "Medium", price: "$25" },
                    { id: "long", label: "Long", price: "$30" },
                    { id: "xl", label: "XL", price: "$30" },
                  ].map(l => (
                    <div key={l.id} className={`option-card ${length === l.id ? "selected" : ""}`} onClick={() => setLength(l.id)}>
                      <div className="option-label">{l.label}</div>
                      <div className="option-price">{l.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 1 — ADD-ONS */}
          {step === 1 && (
            <div className="section">
              <span className="section-label">Step 2 of 5</span>
              <h2 className="section-title">Add-Ons</h2>
              <p className="section-sub">Each add-on is +$5 · Select as many as you like · All optional</p>
              <div className="addon-grid">
                {ADDONS.map(a => (
                  <div key={a.id} className={`addon-card ${selectedAddons.includes(a.id) ? "selected" : ""}`} onClick={() => toggleAddon(a.id)}>
                    <div className="addon-check">{selectedAddons.includes(a.id) ? "✓" : ""}</div>
                    <div>
                      <div className="addon-label">{a.label}</div>
                      <div className="addon-desc">{a.desc}</div>
                      <div className="addon-price">+$5</div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedAddons.length === 0 && <p style={{fontSize:12,color:"var(--dim)",marginTop:16,letterSpacing:1}}>No add-ons selected — click continue to skip</p>}
            </div>
          )}

          {/* STEP 2 — NAIL SIZES */}
          {step === 2 && (
            <div className="section">
              <span className="section-label">Step 3 of 5</span>
              <h2 className="section-title">Your Nail Sizes</h2>
              <p className="section-sub">Use the tape method to measure — sizes 0 (largest) to 9 (smallest)</p>

              <div className="sizing-chart">
                <span className="sizing-chart-title">Size Reference Chart</span>
                <div className="sizing-chart-grid">
                  {[
                    {n:"0",mm:"18"},{n:"1",mm:"16"},{n:"2",mm:"15"},{n:"3",mm:"14"},
                    {n:"4",mm:"13"},{n:"5",mm:"12"},{n:"6",mm:"11"},{n:"7",mm:"10"},
                    {n:"8",mm:"9"},{n:"9",mm:"8"}
                  ].map(s => (
                    <div key={s.n} className="size-chip">
                      <span style={{fontSize:14,color:"var(--text)",fontWeight:500}}>{s.n}</span>
                      <span className="size-mm">{s.mm}mm</span>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:11,color:"var(--dim)",marginTop:12,lineHeight:1.6}}>
                  📏 How to measure: Place tape over nail → press sidewalls → mark both sides → measure flat in mm
                </p>
              </div>

              <div className="sizes-grid">
                {["left", "right"].map(hand => (
                  <div key={hand} className="sizes-hand">
                    <span className="sizes-hand-title">{hand === "left" ? "Left Hand" : "Right Hand"}</span>
                    {FINGERS.map(finger => (
                      <div key={finger} className="size-row">
                        <span className="size-finger">{finger}</span>
                        <select
                          className="size-select"
                          value={nailSizes[hand][finger.toLowerCase()]}
                          onChange={e => setSize(hand, finger.toLowerCase(), e.target.value)}
                        >
                          <option value="">Pick</option>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — INFO */}
          {step === 3 && (
            <div className="section">
              <span className="section-label">Step 4 of 5</span>
              <h2 className="section-title">Your Information</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">First & Last Name</label>
                  <input className="form-input" placeholder="Jane Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="(210) 555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-field full">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="jane@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-field full">
                  <label className="form-label">Pickup or Delivery</label>
                  <div className="delivery-options">
                    <div className={`delivery-option ${delivery === "pickup" ? "selected" : ""}`} onClick={() => setDelivery("pickup")}>
                      <div className="delivery-label">Pickup</div>
                      <div className="delivery-sub">Free · San Antonio</div>
                    </div>
                    <div className={`delivery-option ${delivery === "delivery" ? "selected" : ""}`} onClick={() => setDelivery("delivery")}>
                      <div className="delivery-label">Delivery</div>
                      <div className="delivery-sub">+$5 · San Antonio only</div>
                    </div>
                  </div>
                </div>
                <div className="form-field full">
                  <label className="form-label">Design Notes (optional)</label>
                  <textarea className="form-input" placeholder="Describe your vision, colors, vibe, any specific details..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
                <div className="form-field full">
                  <label className="form-label">Inspo Photos (optional)</label>
                  <div className="inspo-drop">
                    <input type="file" accept="image/*" multiple onChange={e => e.target.files.length > 0 && handleInspoUpload(e.target.files)} />
                    <p className="inspo-drop-text">Tap to upload · <span>Browse photos</span></p>
                    <p style={{fontSize:11,color:"var(--dim)",marginTop:4}}>Select multiple photos · JPG, PNG, HEIC</p>
                  </div>
                  {inspoUploading && <p style={{fontSize:11,color:"var(--muted)",marginTop:6}}>Uploading...</p>}
                  {inspoFiles.length > 0 && (
                    <div className="inspo-previews">
                      {inspoFiles.map((f, i) => (
                        <div key={i} className="inspo-thumb-wrap">
                          <img src={f.preview} alt="" className="inspo-thumb" style={{opacity:f.uploading?0.5:1}} />
                          <button className="inspo-remove" onClick={() => setInspoFiles(prev => prev.filter((_, j) => j !== i))}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — REVIEW */}
          {step === 4 && (
            <>
              <div className="order-summary">
                <div className="summary-row"><span className="summary-key">Material</span><span className="summary-val">{material}</span></div>
                <div className="summary-row"><span className="summary-key">Shape</span><span className="summary-val">{shape}</span></div>
                <div className="summary-row"><span className="summary-key">Length</span><span className="summary-val">{length?.charAt(0).toUpperCase() + length?.slice(1)}</span></div>
                {selectedAddons.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-key">Add-ons</span>
                    <span className="summary-val">{selectedAddons.map(id => ADDONS.find(a => a.id === id)?.label).join(", ")}</span>
                  </div>
                )}
                <div className="summary-row"><span className="summary-key">Pickup/Delivery</span><span className="summary-val">{delivery === "delivery" ? "Delivery (+$5)" : "Pickup (Free)"}</span></div>
                <div className="summary-row"><span className="summary-key">Name</span><span className="summary-val">{form.name}</span></div>
                <div className="summary-row"><span className="summary-key">Email</span><span className="summary-val">{form.email}</span></div>
                <div className="summary-row"><span className="summary-key">Phone</span><span className="summary-val">{form.phone}</span></div>
                {form.notes && <div className="summary-row"><span className="summary-key">Notes</span><span className="summary-val">{form.notes}</span></div>}
                <div className="summary-total">
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-val">${calcTotal()}.00</span>
                </div>
              </div>
              {error && <p style={{color:"#e87a7a",fontSize:13,marginBottom:16,textAlign:"center"}}>{error}</p>}
              <div style={{background:"#200e18",border:"1px solid var(--rose-dim)",padding:"14px 18px",marginBottom:16,borderRadius:2}}>
                <p style={{fontSize:13,color:"var(--rose-lt)",lineHeight:1.7}}>✦ You will be redirected to Stripe to complete your payment securely. Your order is confirmed once payment is complete.</p>
              </div>
            </>
          )}

          <div className="btn-row">
            {step > 0 ? <button className="btn btn-ghost" onClick={() => setStep(s => s-1)}>← Back</button> : <span />}
            {step < 4
              ? <button className="btn btn-primary" disabled={!canProceed[step]} onClick={() => setStep(s => s+1)}>Continue →</button>
              : <button className="btn btn-primary" disabled={submitting} onClick={handleCheckout}>{submitting ? "Redirecting..." : "Pay Now ✦"}</button>
            }
          </div>
        </div>

        <div className="footer">
          <p className="footer-copy">© 2026 Acrylic Faerie · <a href="/">acrylicfaerie.com</a></p>
        </div>
      </div>
    </>
  );
}
