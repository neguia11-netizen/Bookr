import { useState, useEffect } from "react";
const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";

async function getBookedSlots() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=date,time&status=neq.cancelled&status=neq.null`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function fetchAvailability() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/availability?select=date,time`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function fetchBlockedDates() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blocked_dates?select=date`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function saveBooking(booking) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error("Failed to save booking");
}

const STRIPE_DEPOSIT_LINK = "https://book.stripe.com/8x29AS728g7V7iAfiI1ck00";

const EMAILJS_SERVICE_ID = "service_qj22hlr";
const EMAILJS_TEMPLATE_ID = "template_pp8uavo";
const EMAILJS_CLIENT_TEMPLATE_ID = "template_0az8fc7";
const EMAILJS_PUBLIC_KEY = "ga_ZOXpSGY692r6cR";

const SERVICES = [
  { id: 1, category: "Acrylic Sets", icon: "✦", name: "XS-S Acrylic Full Set", description: "Perfect for those who want strength and style without the extra length. Includes detailed cuticle prep, classic acrylic application with tips, finished with a high-shine gel top coat. Prices vary depending on design.", duration: 150, priceLabel: "Starting at $40+" },
  { id: 2, category: "Acrylic Sets", icon: "✦", name: "Medium Acrylic Full Set", description: "A chic, elongated aesthetic tailored to your hand shape. Includes detailed cuticle prep, professional acrylic application, and a high-shine gel finish. Prices vary by design.", duration: 165, priceLabel: "Starting at $50+" },
  { id: 3, category: "Acrylic Sets", icon: "✦", name: "Long-XL Acrylic Full Set", description: "For the ultimate statement look. Extra length and high impact style with structural integrity and a perfect apex. Detailed cuticle prep and precision shaping included. Prices vary by design.", duration: 180, priceLabel: "Starting at $65+" },
  { id: 4, category: "Acrylic Sets", icon: "✦", name: "Acrylic Overlay", description: "Durability of acrylic without the added length. Includes a dry manicure, detailed cuticle prep and a thin acrylic layer applied to the natural nail for added strength. Does not include tips.", duration: 45, priceLabel: "$35.00" },
  { id: 5, category: "Acrylic Sets", icon: "✦", name: "Acrylic Fill", description: "For existing acrylic sets that have grown out (recommended every 2-3 weeks). Includes a structure rebalance and shape refinement. NOTE: If missing more than 3 nails, please book a full set instead.", duration: 150, priceLabel: "$35.00 + varies by design" },
  { id: 6, category: "Acrylic Sets", icon: "✦", name: "Acrylic Soak Off", description: "Professional soak off using professional-grade acetone and careful filing. Includes product removal, nail trimming, shaping, and a hydrating treatment with cuticle oil. No foreign soak offs.", duration: 30, priceLabel: "$20.00" },
  { id: 7, category: "Manicures", icon: "◈", name: "Gel Manicure", description: "Flawless, long-lasting glow with high quality natural nail care. Includes a thorough dry manicure, cuticle detailing, natural nail shaping, and your choice of premium gel polish with a high-shine top coat.", duration: 40, priceLabel: "$30.00" },
  { id: 8, category: "Manicures", icon: "◈", name: "Manicure (No Polish)", description: "Focusing on the health and beauty of your natural nails. Includes detailed cuticle work, nail trimming, shaping, and a soothing buff to a natural shine. Finished with cuticle oil and a hydrating hand massage.", duration: 40, priceLabel: "$20.00" },
  { id: 9, category: "Add-Ons", icon: "✿", name: "Simple Nail Art (Add-On)", description: "Minimalist designs to elevate your set. Ex: Single color french tips, full cat eye set, chrome finish, minimalist dots or lines, basic ombre.", duration: 20, priceLabel: "$15.00" },
  { id: 10, category: "Add-Ons", icon: "✿", name: "Detailed Nail Art (Add-On)", description: "For the girls who want the most! Ex: 3D structural art, hand painted themes, multi-layered designs, charms, etc.", duration: 45, priceLabel: "$25.00" },
  { id: 11, category: "Add-Ons", icon: "✿", name: "Nail Fix (Add-On)", description: "$5 per nail. Accidents happen! Add this if you have a cracked, lifted, or missing nail that needs repair. If you have 3 or more broken nails, please book a full set instead.", duration: 10, priceLabel: "$5.00 per nail" },
];

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }
function formatDuration(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h} hr`;
  return `${h} hr ${m} min`;
}

async function sendEmailToTemplate(templateId, params) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: params,
    }),
  });
  if (!res.ok) throw new Error("Email failed");
}

async function sendEmail(params) {
  await sendEmailToTemplate(EMAILJS_TEMPLATE_ID, params);
  await sendEmailToTemplate(EMAILJS_CLIENT_TEMPLATE_ID, params);
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0f0a0c; --bg2: #1a1015; --bg3: #221520;
    --border: #3a1f2e; --border2: #4d2a3d;
    --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840;
    --pink: #f0b8c8; --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .app { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; position: relative; overflow-x: hidden; }
  .app::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%),
      radial-gradient(ellipse 10px 16px at 18% 8%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 20px 13px at 45% 6%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 18px at 60% 15%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 16px 10px at 75% 9%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 11px 15px at 88% 18%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 15px 11px at 95% 8%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 19px 11px at 22% 40%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 10px 14px at 38% 32%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 17px 12px at 55% 38%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 16px at 70% 30%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 15px 10px at 85% 42%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 11px 13px at 12% 58%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 18px 12px at 28% 62%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 48% 55%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 16px 11px at 65% 65%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 15px at 80% 58%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 14px 10px at 93% 62%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 17px 13px at 8% 80%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 11px 16px at 25% 85%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 15px 10px at 42% 78%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 17px at 75% 82%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 16px 11px at 90% 90%, #2a0f1a44 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.7;
  }
  .app > * { position: relative; z-index: 1; }

  .header { text-align: center; padding: 48px 24px 36px; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, #1e0d16 0%, transparent 100%); position: relative; }
  .header-sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 18px; display: block; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(40px, 8vw, 68px); font-weight: 700; font-style: italic; letter-spacing: 2px; color: var(--text); line-height: 1; text-shadow: 0 0 60px #c4415a55; }
  .header h1 span { color: var(--rose-lt); }
  .header-sub { margin-top: 12px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); }
  .header-divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; color: var(--rose-dim); font-size: 11px; letter-spacing: 3px; }
  .header-divider::before, .header-divider::after { content: ''; width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-dim)); }
  .header-divider::after { transform: scaleX(-1); }

  .steps { display: flex; justify-content: center; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border); background: var(--bg2); flex-wrap: wrap; gap: 4px; }
  .step { display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); cursor: pointer; transition: color 0.3s; padding: 6px 14px; }
  .step:not(:last-child)::after { content: '›'; margin-left: 14px; color: var(--border2); font-size: 14px; }
  .step.active { color: var(--rose-lt); }
  .step.done { color: var(--muted); cursor: pointer; }
  .step-num { width: 20px; height: 20px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
  .step.active .step-num { background: var(--rose); border-color: var(--rose); color: white; }

  .container { max-width: 880px; margin: 0 auto; padding: 44px 24px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 400; font-style: italic; color: var(--text); margin-bottom: 6px; }
  .section-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--dim); margin-bottom: 32px; }

  .category-label { display: flex; align-items: center; gap: 12px; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rose); margin: 32px 0 10px; }
  .category-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--rose-dim), transparent); }

  .services-grid { display: grid; gap: 3px; }
  .service-card { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 20px; background: var(--bg2); border: 1px solid var(--border); cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; gap: 16px; }
  .service-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #c4415a08 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
  .service-card:hover { border-color: var(--border2); background: var(--bg3); }
  .service-card:hover::after { opacity: 1; }
  .service-card.selected { background: #200e18; border-color: var(--rose-dim); box-shadow: inset 3px 0 0 var(--rose), 0 0 20px #c4415a18; }
  .service-card.selected::after { opacity: 1; }
  .service-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; }
  .service-icon { color: var(--rose); font-size: 13px; width: 18px; text-align: center; padding-top: 3px; flex-shrink: 0; }
  .service-info { flex: 1; }
  .service-name { font-size: 14px; font-weight: 400; color: var(--text); margin-bottom: 6px; letter-spacing: 0.3px; }
  .service-desc { font-size: 12px; color: var(--muted); line-height: 1.65; margin-bottom: 8px; }
  .service-dur { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); }
  .service-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
  .service-price { font-family: 'Playfair Display', serif; font-style: italic; font-size: 17px; color: var(--rose-lt); white-space: nowrap; }
  .check { width: 20px; height: 20px; border-radius: 50%; background: var(--rose); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; box-shadow: 0 0 12px #c4415a66; }

  .calendar-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  @media (max-width: 600px) { .calendar-wrap { grid-template-columns: 1fr; } }
  .cal-box { background: var(--bg2); border: 1px solid var(--border); padding: 20px; }
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .cal-header h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 400; font-style: italic; color: var(--text); }
  .cal-nav { background: none; border: 1px solid var(--border2); color: var(--muted); width: 28px; height: 28px; cursor: pointer; font-size: 15px; transition: all 0.2s; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cal-nav:hover { border-color: var(--rose); color: var(--rose-lt); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-day-name { text-align: center; font-size: 9px; letter-spacing: 1px; color: var(--dim); text-transform: uppercase; padding: 4px 0 10px; }
  .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 50%; border: 1px solid transparent; transition: all 0.15s; color: var(--dim); }
  .cal-day.current-month { color: var(--text); cursor: pointer; }
  .cal-day.current-month:hover { background: var(--bg3); border-color: var(--border2); }
  .cal-day.today { border-color: var(--rose-dim); }
  .cal-day.selected { background: var(--rose); color: white; border-color: var(--rose); box-shadow: 0 0 14px #c4415a55; }

  .times-box { background: var(--bg2); border: 1px solid var(--border); padding: 20px; }
  .times-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--dim); margin-bottom: 14px; }
  .times-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .time-slot { padding: 10px 8px; border: 1px solid var(--border); background: var(--bg); font-size: 12px; letter-spacing: 0.5px; text-align: center; cursor: pointer; transition: all 0.15s; color: var(--muted); border-radius: 2px; }
  .time-slot:hover { border-color: var(--border2); color: var(--text); }
  .time-slot.selected { border-color: var(--rose); background: #200e18; color: var(--rose-lt); box-shadow: 0 0 10px #c4415a22; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .form-input { background: var(--bg2); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 13px 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-weight: 300; border-radius: 2px; }
  .form-input:focus { border-color: var(--rose-dim); box-shadow: 0 0 0 3px #c4415a18; }
  .form-input::placeholder { color: var(--dim); }
  textarea.form-input { resize: vertical; min-height: 90px; }

  .summary-card { background: var(--bg2); border: 1px solid var(--border); padding: 28px; margin-bottom: 24px; position: relative; overflow: hidden; }
  .summary-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .summary-row { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; gap: 16px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-key { color: var(--muted); letter-spacing: 1px; font-size: 11px; text-transform: uppercase; flex-shrink: 0; }
  .summary-val { color: var(--text); text-align: right; }
  .summary-total { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; margin-top: 12px; border-top: 1px solid var(--border2); }
  .summary-total-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .summary-total-val { font-family: 'Playfair Display', serif; font-size: 26px; font-style: italic; color: var(--rose-lt); }

  .btn-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 36px; }
  .btn { padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; }
  .btn-primary { background: var(--rose); color: white; box-shadow: 0 4px 20px #c4415a44; }
  .btn-primary:hover { background: #d4506a; box-shadow: 0 4px 28px #c4415a66; transform: translateY(-1px); }
  .btn-primary:disabled { background: var(--border2); color: var(--dim); cursor: not-allowed; box-shadow: none; transform: none; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }

  .success-wrap { text-align: center; padding: 72px 24px; }
  .success-icon { font-size: 48px; color: var(--rose); margin-bottom: 28px; display: block; text-shadow: 0 0 40px #c4415a88; animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
  .success-wrap h2 { font-family: 'Playfair Display', serif; font-size: 40px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 14px; }
  .success-wrap p { font-size: 14px; color: var(--muted); line-height: 1.8; letter-spacing: 0.3px; }
  .success-detail { display: inline-block; margin-top: 36px; padding: 20px 40px; border: 1px solid var(--border2); background: var(--bg2); font-size: 13px; letter-spacing: 1px; color: var(--rose-lt); font-family: 'Playfair Display', serif; font-style: italic; }
  .error-msg { margin-top: 14px; font-size: 12px; color: #e87a7a; letter-spacing: 1px; text-align: center; }

  .modal-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(15, 10, 12, 0.92); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .modal { background: var(--bg2); border: 1px solid var(--border2); max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto; position: relative; }
  .modal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .modal-header { padding: 28px 28px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg2); z-index: 1; }
  .modal-header h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 4px; }
  .modal-header p { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); }
  .modal-body { padding: 20px 28px 28px; }
  .policy-section { margin-bottom: 24px; }
  .policy-section:last-child { margin-bottom: 0; }
  .policy-section h3 { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .policy-section h3::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .policy-item { display: flex; gap: 10px; margin-bottom: 8px; font-size: 13px; color: var(--muted); line-height: 1.65; }
  .policy-item:last-child { margin-bottom: 0; }
  .policy-dot { color: var(--rose); flex-shrink: 0; margin-top: 2px; }
  .modal-footer { padding: 20px 28px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 10px; position: sticky; bottom: 0; background: var(--bg2); }
  .modal-agree { display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: var(--muted); cursor: pointer; margin-bottom: 4px; }
  .modal-agree input { accent-color: var(--rose); margin-top: 2px; flex-shrink: 0; width: 14px; height: 14px; cursor: pointer; }
  .modal-buttons { display: flex; gap: 10px; }
  .no-date-msg { font-size: 12px; color: var(--dim); letter-spacing: 1px; margin-top: 10px; }
  .inspo-upload { margin-top: 16px; }
  .inspo-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; }
  .inspo-drop {
    border: 1px dashed var(--border2); background: var(--bg);
    padding: 20px; text-align: center; cursor: pointer;
    transition: all 0.2s; position: relative; border-radius: 2px;
  }
  .inspo-drop:hover { border-color: var(--rose-dim); background: var(--bg3); }
  .inspo-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .inspo-drop-text { font-size: 12px; color: var(--dim); letter-spacing: 1px; }
  .inspo-drop-text span { color: var(--rose-dim); }
  .inspo-preview { margin-top: 10px; position: relative; display: inline-block; }
  .inspo-preview img { max-width: 100%; max-height: 200px; object-fit: cover; border: 1px solid var(--border2); display: block; }
  .inspo-remove { position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; border-radius: 50%; background: var(--rose); border: none; color: white; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .inspo-uploading { font-size: 11px; color: var(--muted); letter-spacing: 1px; margin-top: 8px; }

  .footer { border-top: 1px solid var(--border); padding: 40px 24px; text-align: center; background: var(--bg2); position: relative; z-index: 1; }
  .footer-sparkle { font-size: 11px; letter-spacing: 6px; color: var(--rose); margin-bottom: 16px; display: block; }
  .footer-title { font-family: 'Playfair Display', serif; font-size: 14px; font-style: italic; color: var(--muted); margin-bottom: 20px; letter-spacing: 2px; }
  .footer-icons { display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
  .footer-icon { display: flex; flex-direction: column; align-items: center; gap: 6px; text-decoration: none; color: var(--muted); transition: all 0.2s; padding: 10px 14px; border: 1px solid transparent; border-radius: 4px; }
  .footer-icon:hover { color: var(--rose-lt); border-color: var(--border2); background: var(--bg3); }
  .footer-icon svg { width: 22px; height: 22px; fill: currentColor; }
  .footer-icon span { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; }
  .footer-email { font-size: 12px; color: var(--dim); letter-spacing: 1px; }
  .footer-email a { color: var(--rose-dim); text-decoration: none; }
  .footer-email a:hover { color: var(--rose-lt); }

`;

export default function BeautyBooking() {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [showPolicy, setShowPolicy] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [inspoFiles, setInspoFiles] = useState([]); // [{preview, url, uploading}]
  const [inspoUploading, setInspoUploading] = useState(false);

  useEffect(() => {
    getBookedSlots().then(slots => setBookedSlots(slots));
    fetchBlockedDates().then(dates => setBlockedDates(dates));
    fetchAvailability().then(avail => setAvailabilityData(avail));
  }, []);

  async function handleInspoUpload(files) {
    if (!files || files.length === 0) return;
    setInspoUploading(true);
    const newFiles = Array.from(files);
    // Add previews immediately
    const previews = newFiles.map(f => ({ preview: URL.createObjectURL(f), url: "", uploading: true }));
    setInspoFiles(prev => [...prev, ...previews]);
    // Upload each file
    const uploaded = await Promise.all(newFiles.map(async (file, i) => {
      try {
        const fileName = `inspo-${Date.now()}-${i}-${file.name.replace(/ /g, '-')}`;
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/inspo/${fileName}`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": file.type,
          },
          body: file,
        });
        if (res.ok) {
          return { preview: URL.createObjectURL(file), url: `${SUPABASE_URL}/storage/v1/object/public/inspo/${fileName}`, uploading: false };
        }
      } catch { }
      return { preview: URL.createObjectURL(file), url: "", uploading: false };
    }));
    setInspoFiles(prev => {
      const existing = prev.slice(0, prev.length - newFiles.length);
      return [...existing, ...uploaded];
    });
    setInspoUploading(false);
  }

  function removeInspo(index) {
    setInspoFiles(prev => prev.filter((_, i) => i !== index));
  }

  function getAvailableTimesFromData(year, month, day) {
    const dateStr = `${MONTHS[month]} ${day}, ${year}`;
    return availabilityData
      .filter(a => a.date === dateStr)
      .map(a => a.time)
      .sort((a, b) => {
        const toMin = t => {
          const [time, period] = t.split(' ');
          let [h, m] = time.split(':').map(Number);
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
          return h * 60 + m;
        };
        return toMin(a) - toMin(b);
      });
  }

  function isAvailableDayFromData(year, month, day) {
    const dateStr = `${MONTHS[month]} ${day}, ${year}`;
    return availabilityData.some(a => a.date === dateStr);
  }

  function isBlocked(year, month, day) {
    const date = `${MONTHS[month]} ${day}, ${year}`;
    return blockedDates.some(b => b.date === date);
  }

  function isSlotBooked(year, month, day, time) {
    const date = `${MONTHS[month]} ${day}, ${year}`;
    return bookedSlots.some(s => s.date === date && s.time === time);
  }

  function isDayFullyBooked(year, month, day) {
    const times = getAvailableTimesFromData(year, month, day);
    return times.length > 0 && times.every(t => isSlotBooked(year, month, day, t));
  }

  const categories = [...new Set(SERVICES.map(s => s.category))];
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) calDays.push({ day: d, current: true });

  const isToday = (d) => d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
  const isPast = (d) => new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const canProceed = [
    selectedServices.length > 0,
    !!selectedDay && !!selectedTime,
    !!(form.first && form.last && form.email && form.phone),
    true,
  ];

  function handleConfirm() {
    const bookingDate = `${MONTHS[calMonth]} ${selectedDay}, ${calYear}`;
    localStorage.setItem("bookingService", selectedServices.map(s => s.name).join(', '));
    localStorage.setItem("bookingDate", bookingDate);
    localStorage.setItem("bookingTime", selectedTime);
    localStorage.setItem("bookingDuration", formatDuration(selectedServices.reduce((acc, s) => acc + s.duration, 0)));
    localStorage.setItem("bookingPrice", selectedServices.some(s => !s.price) ? 'Price varies' : '$' + selectedServices.reduce((acc, s) => acc + (s.price || 0), 0).toFixed(2));
    localStorage.setItem("bookingName", `${form.first} ${form.last}`);
    localStorage.setItem("bookingEmail", form.email);
    localStorage.setItem("bookingPhone", form.phone);
    localStorage.setItem("bookingNotes", form.notes || "");
    localStorage.setItem("bookingInspo", inspoFiles.map(f => f.url).filter(Boolean).join(","));
    setStep(4);
  }

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <span className="header-sparkle">✦ ✦ ✦</span>
            <h1><span>Acrylic</span> Faerie</h1>
            <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          </div>
          <div className="container">
            <div className="success-wrap">
              <span className="success-icon">✦</span>
              <h2>You're All Set!</h2>
              <p>Your appointment has been booked.<br />A confirmation has been sent to {form.email}.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          <div className="header-divider">Book Your Appointment</div>
          <div style={{marginTop:18,display:"flex",justifyContent:"center"}}>
            <a href="/portfolio" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--rose-lt)",textDecoration:"none",padding:"10px 24px",border:"1px solid var(--rose-dim)",background:"#200e18"}}>✦ View Gallery ✦</a>
          </div>
        </div>

        <div className="steps">
          {["Service","Date & Time","Your Info","Review","Deposit"].map((label, i) => (
            <div key={i} className={`step ${i === step ? "active" : i < step ? "done" : ""}`} onClick={() => i < step && setStep(i)}>
              <div className="step-num">{i < step ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="container">

          {step === 0 && (
            <>
              <h2 className="section-title">Choose a Service</h2>
              <p className="section-sub">Select one or more services to continue</p>
              {categories.map(cat => (
                <div key={cat}>
                  <div className="category-label">{cat}</div>
                  <div className="services-grid">
                    {SERVICES.filter(s => s.category === cat).map(s => (
                      <div key={s.id} className={`service-card ${selectedServices.find(x => x.id === s.id) ? "selected" : ""}`} onClick={() => {
                        setSelectedServices(prev =>
                          prev.find(x => x.id === s.id)
                            ? prev.filter(x => x.id !== s.id)
                            : [...prev, s]
                        );
                      }}>
                        <div className="service-left">
                          <div className="service-icon">{s.icon}</div>
                          <div className="service-info">
                            <div className="service-name">{s.name}</div>
                            <div className="service-desc">{s.description}</div>
                            <div className="service-dur">⏱ {formatDuration(s.duration)}</div>
                          </div>
                        </div>
                        <div className="service-right">
                          <div className="service-price">{s.priceLabel}</div>
                          {selectedServices.find(x => x.id === s.id) && <div className="check">✓</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="section-title">Pick a Date & Time</h2>
              <p className="section-sub">{selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected · {formatDuration(selectedServices.reduce((acc, s) => acc + s.duration, 0))} total</p>
              <div className="calendar-wrap">
                <div className="cal-box">
                  <div className="cal-header">
                    <button className="cal-nav" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }}>‹</button>
                    <h3>{MONTHS[calMonth]} {calYear}</h3>
                    <button className="cal-nav" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }}>›</button>
                  </div>
                  <div className="cal-grid">
                    {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
                    {calDays.map((cell, i) => (
                      <div key={i}
                        className={`cal-day ${cell.current ? "current-month" : ""} ${cell.current && isToday(cell.day) ? "today" : ""} ${selectedDay === cell.day && cell.current ? "selected" : ""}`}
                        onClick={() => { if (cell.current && !isPast(cell.day) && isAvailableDayFromData(calYear, calMonth, cell.day) && !isDayFullyBooked(calYear, calMonth, cell.day) && !isBlocked(calYear, calMonth, cell.day)) { setSelectedDay(cell.day); setSelectedTime(null); } }}
                        style={{ opacity: cell.current && (isPast(cell.day) || !isAvailableDayFromData(calYear, calMonth, cell.day) || isDayFullyBooked(calYear, calMonth, cell.day) || isBlocked(calYear, calMonth, cell.day)) ? 0.2 : 1, cursor: cell.current && !isPast(cell.day) && isAvailableDayFromData(calYear, calMonth, cell.day) && !isDayFullyBooked(calYear, calMonth, cell.day) && !isBlocked(calYear, calMonth, cell.day) ? "pointer" : "default" }}
                      >{cell.day || ""}</div>
                    ))}
                  </div>
                </div>
                <div className="times-box">
                  <div className="times-label">{selectedDay ? `${MONTHS[calMonth]} ${selectedDay} — Pick a time` : "Select a date first"}</div>
                  {selectedDay ? (
                    <div className="times-grid">
                      {getAvailableTimesFromData(calYear, calMonth, selectedDay).map(t => {
                        const booked = isSlotBooked(calYear, calMonth, selectedDay, t);
                        return (
                          <div key={t}
                            className={`time-slot ${selectedTime === t ? "selected" : ""}`}
                            onClick={() => !booked && setSelectedTime(t)}
                            style={{ opacity: booked ? 0.3 : 1, cursor: booked ? "not-allowed" : "pointer", textDecoration: booked ? "line-through" : "none" }}
                          >{t}{booked ? " ✗" : ""}</div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-date-msg">← Choose a date on the calendar</p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="section-title">Your Information</h2>
              <p className="section-sub">We'll send your confirmation here</p>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="Jane" value={form.first} onChange={e => setForm({...form, first: e.target.value})} />
                </div>
                <div className="form-field">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Doe" value={form.last} onChange={e => setForm({...form, last: e.target.value})} />
                </div>
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="jane@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="(210) 555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-field full">
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-input" placeholder="Any special requests or allergies..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
                <div className="form-field full inspo-upload">
                  <label className="inspo-label">Inspo Photos (optional)</label>
                  <div className="inspo-drop">
                    <input type="file" accept="image/*" multiple onChange={e => e.target.files.length > 0 && handleInspoUpload(e.target.files)} />
                    <p className="inspo-drop-text">Tap to upload · <span>Browse photos</span></p>
                    <p style={{fontSize:11,color:"var(--dim)",marginTop:4}}>Select multiple photos · JPG, PNG, HEIC</p>
                  </div>
                  {inspoUploading && <p className="inspo-uploading">Uploading photos...</p>}
                  {inspoFiles.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                      {inspoFiles.map((f, i) => (
                        <div key={i} className="inspo-preview" style={{position:"relative"}}>
                          <img src={f.preview} alt={`Inspo ${i+1}`} style={{width:80,height:80,objectFit:"cover",border:"1px solid var(--border2)",borderRadius:2,opacity:f.uploading?0.5:1}} />
                          {f.uploading && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--muted)"}}>...</div>}
                          <button className="inspo-remove" onClick={() => removeInspo(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {inspoFiles.length > 0 && !inspoUploading && <p style={{fontSize:11,color:"#4a9a6a",marginTop:6,letterSpacing:1}}>✓ {inspoFiles.filter(f=>f.url).length} of {inspoFiles.length} photo{inspoFiles.length!==1?"s":""} uploaded</p>}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="section-title">Review & Confirm</h2>
              <p className="section-sub">Please review your booking details below</p>
              <div className="summary-card">
                {(selectedServices || []).map(s => (
                  <div key={s.id} className="summary-row"><span className="summary-key">Service</span><span className="summary-val">{s.name}</span></div>
                ))}
                <div className="summary-row"><span className="summary-key">Total Duration</span><span className="summary-val">{formatDuration(selectedServices.reduce((acc, s) => acc + s.duration, 0))}</span></div>
                <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{MONTHS[calMonth]} {selectedDay}, {calYear}</span></div>
                <div className="summary-row"><span className="summary-key">Time</span><span className="summary-val">{selectedTime}</span></div>
                <div className="summary-row"><span className="summary-key">Name</span><span className="summary-val">{form.first} {form.last}</span></div>
                <div className="summary-row"><span className="summary-key">Email</span><span className="summary-val">{form.email}</span></div>
                <div className="summary-row"><span className="summary-key">Phone</span><span className="summary-val">{form.phone}</span></div>
                {form.notes && <div className="summary-row"><span className="summary-key">Notes</span><span className="summary-val">{form.notes}</span></div>}
                <div className="summary-total">
                  <span className="summary-total-label">Estimated Total</span>
                  <span className="summary-total-val">{selectedServices.some(s => !s.price) ? "Price varies" : "$" + selectedServices.reduce((acc, s) => acc + (s.price || 0), 0).toFixed(2)}</span>
                </div>
              </div>
              {sendError && <p className="error-msg">Something went wrong. Please try again.</p>}
              <div style={{background:"#200e18",border:"1px solid var(--rose-dim)",padding:"12px 16px",marginTop:16,borderRadius:2}}>
                <p style={{fontSize:12,color:"var(--rose-lt)",letterSpacing:0.5,lineHeight:1.7}}>
                  ⚠️ After reviewing, you will be directed to pay a <strong>$10 deposit via Stripe</strong>. Your appointment is only confirmed once payment is completed.
                </p>
              </div>
              <div style={{marginTop:24, background:"var(--bg2)", border:"1px solid var(--border)", padding:"20px 24px"}}>
                <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"var(--rose)",marginBottom:14}}>Studio Policies</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.8,display:"flex",flexDirection:"column",gap:8}}>
                  <p>✦ <strong style={{color:"var(--text)"}}>Deposits:</strong> $10 deposit required. Transferable to one reschedule with 24+ hours notice. Additional reschedules require a new deposit.</p>
                  <p>✦ <strong style={{color:"var(--text)"}}>Cancellations:</strong> Must cancel 24+ hours in advance or deposit is forfeited.</p>
                  <p>✦ <strong style={{color:"var(--text)"}}>Late Arrivals:</strong> 10-minute grace period. $10 late fee after 10 minutes.</p>
                  <p>✦ <strong style={{color:"var(--text)"}}>Refunds:</strong> No refunds on services rendered.</p>
                  <p>✦ <strong style={{color:"var(--text)"}}>Health & Safety:</strong> No damaged nail beds, no foreign soak offs. Arrive with clean bare nails.</p>
                </div>
                <label style={{display:"flex",alignItems:"flex-start",gap:10,marginTop:16,fontSize:12,color:"var(--muted)",cursor:"pointer"}}>
                  <input type="checkbox" checked={agreedToPolicy} onChange={e => setAgreedToPolicy(e.target.checked)} style={{accentColor:"var(--rose)",marginTop:2,flexShrink:0,width:14,height:14,cursor:"pointer"}} />
                  I have read and agree to all studio policies.
                </label>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="section-title">Pay Your Deposit</h2>
              <p className="section-sub">$10 deposit required to secure your appointment</p>
              <div className="summary-card">
                {(selectedServices || []).map(s => (
                  <div key={s.id} className="summary-row"><span className="summary-key">Service</span><span className="summary-val">{s.name}</span></div>
                ))}
                <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{MONTHS[calMonth]} {selectedDay}, {calYear}</span></div>
                <div className="summary-row"><span className="summary-key">Time</span><span className="summary-val">{selectedTime}</span></div>
                <div className="summary-total">
                  <span className="summary-total-label">Deposit Due Now</span>
                  <span className="summary-total-val">$10.00</span>
                </div>
              </div>
              <div style={{textAlign:"center", padding:"8px 0 16px"}}>
                <div style={{background:"#200e18",border:"1px solid var(--rose-dim)",padding:"14px 20px",marginBottom:24,borderRadius:2}}>
                  <p style={{fontSize:13,color:"var(--rose-lt)",letterSpacing:0.5,lineHeight:1.7,fontWeight:400}}>
                    ⚠️ Your booking is <strong>not confirmed</strong> until the $10 deposit is paid.<br/>
                    Please complete payment below to secure your appointment.
                  </p>
                </div>
                <button className="btn btn-primary" style={{fontSize:13,padding:"16px 48px",letterSpacing:3}} onClick={() => { window.location.href = STRIPE_DEPOSIT_LINK; }}>
                  Pay $10 Deposit ✦
                </button>
                <p style={{fontSize:11,color:"var(--dim)",marginTop:16,letterSpacing:1}}>
                  Secured by Stripe · Your card info is never stored
                </p>
              </div>
            </>
          )}

          <div className="btn-row">
            {step > 0 && step < 4
              ? <button className="btn btn-ghost" onClick={() => setStep(s => s-1)}>← Back</button>
              : <span />}
            {step < 3
              ? <button className="btn btn-primary" disabled={!canProceed[step]} onClick={() => setStep(s => s+1)}>Continue →</button>
              : step === 3
              ? <button className="btn btn-primary" disabled={!agreedToPolicy} onClick={handleConfirm}>Proceed to Deposit ✦</button>
              : null}
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <span className="footer-sparkle">✦ ✦ ✦</span>
          <p className="footer-title">Follow Along</p>
          <div className="footer-icons">
            <a href="https://www.instagram.com/acrylicfaerie/" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@acrylic.faerie" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
              <span>TikTok</span>
            </a>
            <a href="https://www.facebook.com/people/Acrylic-Faerie/61577071983716/" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </a>
            <a href="mailto:acrylicfaerie.biz@gmail.com" className="footer-icon">
              <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>Email</span>
            </a>
          </div>
          <div style={{marginBottom:16,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/giftcard" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--rose-lt)",textDecoration:"none",padding:"10px 24px",border:"1px solid var(--rose-dim)",background:"#200e18",display:"inline-block"}}>✦ Gift Cards ✦</a>
            <a href="/about" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--rose-lt)",textDecoration:"none",padding:"10px 24px",border:"1px solid var(--rose-dim)",background:"#200e18",display:"inline-block"}}>✦ About Me ✦</a>
          </div>
          <p className="footer-email">© 2026 Acrylic Faerie · San Antonio, TX · <a href="mailto:acrylicfaerie.biz@gmail.com">acrylicfaerie.biz@gmail.com</a></p>
        </div>

      </div>
    </>
  );
}
