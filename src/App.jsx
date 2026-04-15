const STRIPE_DEPOSIT_LINK = "https://book.stripe.com/8x29AS728g7V7iAfiI1ck00";
import { useState } from "react";

const EMAILJS_SERVICE_ID = "service_qj22hlr";
const EMAILJS_TEMPLATE_ID = "template_pp8uavo";       // sends to you
const EMAILJS_CLIENT_TEMPLATE_ID = "template_0az8fc7"; // sends to client
const EMAILJS_PUBLIC_KEY = "ga_ZOXpSGY692r6cR";

const SERVICES = [
  { id: 1, category: "Acrylic Sets", icon: "✦", name: "XS-S Acrylic Full Set", description: "Perfect for those who want strength and style without the extra length. Includes detailed cuticle prep, classic acrylic application with tips, finished with a high-shine gel top coat. Prices vary depending on design.", duration: 150, priceLabel: "Price varies" },
  { id: 2, category: "Acrylic Sets", icon: "✦", name: "Medium Acrylic Full Set", description: "A chic, elongated aesthetic tailored to your hand shape. Includes detailed cuticle prep, professional acrylic application, and a high-shine gel finish. Prices vary by design.", duration: 165, priceLabel: "Price varies" },
  { id: 3, category: "Acrylic Sets", icon: "✦", name: "Long-XL Acrylic Full Set", description: "For the ultimate statement look. Extra length and high impact style with structural integrity and a perfect apex. Detailed cuticle prep and precision shaping included. Prices vary by design.", duration: 180, priceLabel: "Price varies" },
  { id: 4, category: "Acrylic Sets", icon: "✦", name: "Acrylic Overlay", description: "Durability of acrylic without the added length. Includes a dry manicure, detailed cuticle prep and a thin acrylic layer applied to the natural nail for added strength. Does not include tips.", duration: 45, priceLabel: "$35.00" },
  { id: 5, category: "Acrylic Sets", icon: "✦", name: "Acrylic Fill", description: "For existing acrylic sets that have grown out (recommended every 2-3 weeks). Includes a structure rebalance and shape refinement. NOTE: If missing more than 3 nails, please book a full set instead.", duration: 150, priceLabel: "$35.00 + varies by design" },
  { id: 6, category: "Acrylic Sets", icon: "✦", name: "Acrylic Soak Off", description: "Professional soak off using professional-grade acetone and careful filing. Includes product removal, nail trimming, shaping, and a hydrating treatment with cuticle oil. No foreign soak offs.", duration: 30, priceLabel: "$20.00" },
  { id: 7, category: "Manicures", icon: "◈", name: "Gel Manicure", description: "Flawless, long-lasting glow with high quality natural nail care. Includes a thorough dry manicure, cuticle detailing, natural nail shaping, and your choice of premium gel polish with a high-shine top coat.", duration: 40, priceLabel: "$30.00" },
  { id: 8, category: "Manicures", icon: "◈", name: "Manicure (No Polish)", description: "Focusing on the health and beauty of your natural nails. Includes detailed cuticle work, nail trimming, shaping, and a soothing buff to a natural shine. Finished with cuticle oil and a hydrating hand massage.", duration: 40, priceLabel: "$20.00" },
  { id: 9, category: "Add-Ons", icon: "✿", name: "Simple Nail Art (Add-On)", description: "Minimalist designs to elevate your set. Ex: Single color french tips, full cat eye set, chrome finish, minimalist dots or lines, basic ombre.", duration: 20, priceLabel: "$15.00" },
  { id: 10, category: "Add-Ons", icon: "✿", name: "Detailed Nail Art (Add-On)", description: "For the girls who want the most! Ex: 3D structural art, hand painted themes, multi-layered designs, charms, etc.", duration: 45, priceLabel: "$25.00" },
  { id: 11, category: "Add-Ons", icon: "✿", name: "Nail Fix (Add-On)", description: "$5 per nail. Accidents happen! Add this if you have a cracked, lifted, or missing nail that needs repair. If you have 3 or more broken nails, please book a full set instead.", duration: 10, priceLabel: "$5.00 per nail" },
];

// Availability: key is "YYYY-M-D", value is array of available times
const AVAILABILITY = {
  // April 2026
  "2026-4-18": ["10:00 AM", "2:00 PM", "6:00 PM"],
  "2026-4-19": ["4:00 PM"],
  "2026-4-20": ["1:00 PM", "5:00 PM"],
  "2026-4-21": ["12:00 PM", "5:00 PM"],
  "2026-4-22": ["10:00 AM", "3:00 PM"],
  "2026-4-24": ["12:00 PM", "4:00 PM"],
  "2026-4-25": ["10:00 AM", "3:00 PM"],
  "2026-4-27": ["9:00 AM", "2:00 PM"],
  "2026-4-28": ["1:00 PM", "5:00 PM"],
  "2026-4-29": ["11:00 AM", "4:00 PM"],
  // May 2026
  "2026-5-1":  ["10:00 AM", "3:00 PM"],
  "2026-5-4":  ["10:00 AM", "4:00 PM"],
  "2026-5-5":  ["9:00 AM", "4:00 PM"],
  "2026-5-6":  ["10:00 AM", "3:00 PM"],
  "2026-5-11": ["9:00 AM", "3:00 PM", "6:00 PM"],
  "2026-5-12": ["10:00 AM", "3:00 PM", "6:00 PM"],
  "2026-5-13": ["10:00 AM", "3:00 PM"],
  "2026-5-15": ["9:00 AM", "3:00 PM"],
  "2026-5-17": ["10:00 AM", "2:00 PM", "5:00 PM"],
  "2026-5-18": ["10:00 AM", "2:00 PM", "5:00 PM"],
  "2026-5-19": ["10:00 AM", "4:00 PM"],
  "2026-5-22": ["10:00 AM", "2:00 PM", "5:00 PM"],
  "2026-5-25": ["9:00 AM", "2:00 PM", "5:00 PM"],
  "2026-5-26": ["10:00 AM", "2:00 PM", "6:00 PM"],
  "2026-5-29": ["11:00 AM", "3:00 PM"],
  "2026-5-30": ["10:00 AM", "3:00 PM", "6:00 PM"],
};

function getAvailableTimes(year, month, day) {
  const key = `${year}-${month + 1}-${day}`;
  return AVAILABILITY[key] || [];
}

function isAvailableDay(year, month, day) {
  const key = `${year}-${month + 1}-${day}`;
  return !!AVAILABILITY[key];
}
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
    --bg:        #0f0a0c;
    --bg2:       #1a1015;
    --bg3:       #221520;
    --border:    #3a1f2e;
    --border2:   #4d2a3d;
    --rose:      #c4415a;
    --rose-lt:   #e8839a;
    --rose-dim:  #7a2840;
    --pink:      #f0b8c8;
    --text:      #f5e8ee;
    --muted:     #9a7080;
    --dim:       #5a3a48;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    position: relative;
    overflow-x: hidden;
  }

  /* Leopard print background pattern */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
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
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
  }

  .app > * { position: relative; z-index: 1; }

  /* HEADER */
  .header {
    text-align: center;
    padding: 48px 24px 36px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, #1e0d16 0%, transparent 100%);
    position: relative;
  }
  .header-sparkle {
    font-size: 13px;
    letter-spacing: 8px;
    color: var(--rose);
    margin-bottom: 18px;
    display: block;
  }
  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 8vw, 68px);
    font-weight: 700;
    font-style: italic;
    letter-spacing: 2px;
    color: var(--text);
    line-height: 1;
    text-shadow: 0 0 60px #c4415a55;
  }
  .header h1 span { color: var(--rose-lt); }
  .header-sub {
    margin-top: 12px;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .header-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
    color: var(--rose-dim);
    font-size: 11px;
    letter-spacing: 3px;
  }
  .header-divider::before, .header-divider::after {
    content: '';
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--rose-dim));
  }
  .header-divider::after { transform: scaleX(-1); }

  /* STEPS */
  .steps {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    flex-wrap: wrap;
    gap: 4px;
  }
  .step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--dim);
    cursor: pointer;
    transition: color 0.3s;
    padding: 6px 14px;
  }
  .step:not(:last-child)::after {
    content: '›';
    margin-left: 14px;
    color: var(--border2);
    font-size: 14px;
  }
  .step.active { color: var(--rose-lt); }
  .step.done { color: var(--muted); cursor: pointer; }
  .step-num {
    width: 20px; height: 20px;
    border-radius: 50%;
    border: 1px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; flex-shrink: 0;
  }
  .step.active .step-num {
    background: var(--rose);
    border-color: var(--rose);
    color: white;
  }

  /* CONTAINER */
  .container { max-width: 880px; margin: 0 auto; padding: 44px 24px; }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 400;
    font-style: italic;
    color: var(--text);
    margin-bottom: 6px;
  }
  .section-sub {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 32px;
  }

  /* CATEGORY */
  .category-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--rose);
    margin: 32px 0 10px;
  }
  .category-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--rose-dim), transparent);
  }

  /* SERVICE CARDS */
  .services-grid { display: grid; gap: 3px; }
  .service-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 18px 20px;
    background: var(--bg2);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
    gap: 16px;
  }
  .service-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #c4415a08 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .service-card:hover { border-color: var(--border2); background: var(--bg3); }
  .service-card:hover::after { opacity: 1; }
  .service-card.selected {
    background: #200e18;
    border-color: var(--rose-dim);
    box-shadow: inset 3px 0 0 var(--rose), 0 0 20px #c4415a18;
  }
  .service-card.selected::after { opacity: 1; }
  .service-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; }
  .service-icon { color: var(--rose); font-size: 13px; width: 18px; text-align: center; padding-top: 3px; flex-shrink: 0; }
  .service-info { flex: 1; }
  .service-name { font-size: 14px; font-weight: 400; color: var(--text); margin-bottom: 6px; letter-spacing: 0.3px; }
  .service-desc { font-size: 12px; color: var(--muted); line-height: 1.65; margin-bottom: 8px; }
  .service-dur {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--dim);
  }
  .service-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
  .service-price {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 17px;
    color: var(--rose-lt);
    white-space: nowrap;
  }
  .check {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--rose);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: white;
    box-shadow: 0 0 12px #c4415a66;
  }

  /* CALENDAR */
  .calendar-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  @media (max-width: 600px) { .calendar-wrap { grid-template-columns: 1fr; } }

  .cal-box {
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 20px;
  }
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .cal-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 400;
    font-style: italic;
    color: var(--text);
  }
  .cal-nav {
    background: none;
    border: 1px solid var(--border2);
    color: var(--muted);
    width: 28px; height: 28px;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .cal-nav:hover { border-color: var(--rose); color: var(--rose-lt); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-day-name {
    text-align: center;
    font-size: 9px;
    letter-spacing: 1px;
    color: var(--dim);
    text-transform: uppercase;
    padding: 4px 0 10px;
  }
  .cal-day {
    aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    border-radius: 50%;
    border: 1px solid transparent;
    transition: all 0.15s;
    color: var(--dim);
  }
  .cal-day.current-month { color: var(--text); cursor: pointer; }
  .cal-day.current-month:hover { background: var(--bg3); border-color: var(--border2); }
  .cal-day.today { border-color: var(--rose-dim); }
  .cal-day.selected { background: var(--rose); color: white; border-color: var(--rose); box-shadow: 0 0 14px #c4415a55; }

  .times-box {
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 20px;
  }
  .times-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 14px;
  }
  .times-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .time-slot {
    padding: 10px 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    font-size: 12px;
    letter-spacing: 0.5px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--muted);
    border-radius: 2px;
  }
  .time-slot:hover { border-color: var(--border2); color: var(--text); }
  .time-slot.selected {
    border-color: var(--rose);
    background: #200e18;
    color: var(--rose-lt);
    box-shadow: 0 0 10px #c4415a22;
  }

  /* FORM */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .form-input {
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 13px 16px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-weight: 300;
    border-radius: 2px;
  }
  .form-input:focus { border-color: var(--rose-dim); box-shadow: 0 0 0 3px #c4415a18; }
  .form-input::placeholder { color: var(--dim); }
  textarea.form-input { resize: vertical; min-height: 90px; }

  /* SUMMARY */
  .summary-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 28px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }
  .summary-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim));
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    gap: 16px;
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-key { color: var(--muted); letter-spacing: 1px; font-size: 11px; text-transform: uppercase; flex-shrink: 0; }
  .summary-val { color: var(--text); text-align: right; }
  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    margin-top: 12px;
    border-top: 1px solid var(--border2);
  }
  .summary-total-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .summary-total-val { font-family: 'Playfair Display', serif; font-size: 26px; font-style: italic; color: var(--rose-lt); }

  /* BUTTONS */
  .btn-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 36px; }
  .btn {
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    border: none;
    border-radius: 2px;
  }
  .btn-primary {
    background: var(--rose);
    color: white;
    box-shadow: 0 4px 20px #c4415a44;
  }
  .btn-primary:hover { background: #d4506a; box-shadow: 0 4px 28px #c4415a66; transform: translateY(-1px); }
  .btn-primary:disabled { background: var(--border2); color: var(--dim); cursor: not-allowed; box-shadow: none; transform: none; }
  .btn-ghost {
    background: none;
    border: 1px solid var(--border2);
    color: var(--muted);
  }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }

  /* SUCCESS */
  .success-wrap { text-align: center; padding: 72px 24px; }
  .success-icon {
    font-size: 48px;
    color: var(--rose);
    margin-bottom: 28px;
    display: block;
    text-shadow: 0 0 40px #c4415a88;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
  .success-wrap h2 {
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-style: italic;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 14px;
  }
  .success-wrap p { font-size: 14px; color: var(--muted); line-height: 1.8; letter-spacing: 0.3px; }
  .success-detail {
    display: inline-block;
    margin-top: 36px;
    padding: 20px 40px;
    border: 1px solid var(--border2);
    background: var(--bg2);
    font-size: 13px;
    letter-spacing: 1px;
    color: var(--rose-lt);
    font-family: 'Playfair Display', serif;
    font-style: italic;
  }
  .error-msg { margin-top: 14px; font-size: 12px; color: #e87a7a; letter-spacing: 1px; text-align: center; }

  .no-date-msg { font-size: 12px; color: var(--dim); letter-spacing: 1px; margin-top: 10px; }
`;

export default function BeautyBooking() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const categories = [...new Set(SERVICES.map(s => s.category))];
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) calDays.push({ day: d, current: true });

  const isToday = (d) => d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
  const isPast = (d) => new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const canProceed = [
    !!selectedService,
    !!selectedDay && !!selectedTime,
    !!(form.first && form.last && form.email && form.phone),
    true,
  ];

  async function handleConfirm() {
    setSending(true);
    setSendError(false);
    try {
      await sendEmail({
        service: selectedService.name,
        date: `${MONTHS[calMonth]} ${selectedDay}, ${calYear}`,
        time: selectedTime,
        duration: formatDuration(selectedService.duration),
        price: selectedService.priceLabel,
        client_name: `${form.first} ${form.last}`,
        client_email: form.email,
        client_phone: form.phone,
        notes: form.notes || "None",
      });
      setStep(4);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
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
              <div className="success-detail">
                {selectedService?.name} · {MONTHS[calMonth]} {selectedDay}, {calYear} · {selectedTime}
              </div>
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
              <p className="section-sub">Select one service to continue</p>
              {categories.map(cat => (
                <div key={cat}>
                  <div className="category-label">{cat}</div>
                  <div className="services-grid">
                    {SERVICES.filter(s => s.category === cat).map(s => (
                      <div key={s.id} className={`service-card ${selectedService?.id === s.id ? "selected" : ""}`} onClick={() => setSelectedService(s)}>
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
                          {selectedService?.id === s.id && <div className="check">✓</div>}
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
              <p className="section-sub">{selectedService?.name} · {formatDuration(selectedService?.duration)}</p>
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
                        onClick={() => { if (cell.current && !isPast(cell.day) && isAvailableDay(calYear, calMonth, cell.day)) { setSelectedDay(cell.day); setSelectedTime(null); } }}
                        style={{ opacity: cell.current && (isPast(cell.day) || !isAvailableDay(calYear, calMonth, cell.day)) ? 0.2 : 1, cursor: cell.current && !isPast(cell.day) && isAvailableDay(calYear, calMonth, cell.day) ? "pointer" : "default" }}
                      >{cell.day || ""}</div>
                    ))}
                  </div>
                </div>
                <div className="times-box">
                  <div className="times-label">{selectedDay ? `${MONTHS[calMonth]} ${selectedDay} — Pick a time` : "Select a date first"}</div>
                  {selectedDay ? (
                    <div className="times-grid">
                      {getAvailableTimes(calYear, calMonth, selectedDay).map(t => (
                        <div key={t} className={`time-slot ${selectedTime === t ? "selected" : ""}`} onClick={() => setSelectedTime(t)}>{t}</div>
                      ))}
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
                  <textarea className="form-input" placeholder="Any special requests, inspo pics, or allergies..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="section-title">Review & Confirm</h2>
              <p className="section-sub">Please review your booking details below</p>
              <div className="summary-card">
                <div className="summary-row"><span className="summary-key">Service</span><span className="summary-val">{selectedService?.name}</span></div>
                <div className="summary-row"><span className="summary-key">Duration</span><span className="summary-val">{formatDuration(selectedService?.duration)}</span></div>
                <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{MONTHS[calMonth]} {selectedDay}, {calYear}</span></div>
                <div className="summary-row"><span className="summary-key">Time</span><span className="summary-val">{selectedTime}</span></div>
                <div className="summary-row"><span className="summary-key">Name</span><span className="summary-val">{form.first} {form.last}</span></div>
                <div className="summary-row"><span className="summary-key">Email</span><span className="summary-val">{form.email}</span></div>
                <div className="summary-row"><span className="summary-key">Phone</span><span className="summary-val">{form.phone}</span></div>
                {form.notes && <div className="summary-row"><span className="summary-key">Notes</span><span className="summary-val">{form.notes}</span></div>}
                <div className="summary-total">
                  <span className="summary-total-label">Estimated Total</span>
                  <span className="summary-total-val">{selectedService?.priceLabel}</span>
                </div>
              </div>
              {sendError && <p className="error-msg">Something went wrong. Please try again.</p>}
            </>
          )}


          {step === 4 && (
            <>
              <h2 className="section-title">Pay Your Deposit</h2>
              <p className="section-sub">$10 deposit required to secure your appointment</p>
              <div className="summary-card">
                <div className="summary-row"><span className="summary-key">Service</span><span className="summary-val">{selectedService?.name}</span></div>
                <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{MONTHS[calMonth]} {selectedDay}, {calYear}</span></div>
                <div className="summary-row"><span className="summary-key">Time</span><span className="summary-val">{selectedTime}</span></div>
                <div className="summary-total">
                  <span className="summary-total-label">Deposit Due Now</span>
                  <span className="summary-total-val">$10.00</span>
                </div>
              </div>
              <div style={{textAlign:"center", padding:"8px 0 16px"}}>
                <p style={{fontSize:12,color:"var(--muted)",letterSpacing:1,marginBottom:24,lineHeight:1.7}}>
                  Your booking details have been sent to your email.<br/>
                  Please complete your $10 deposit below to finalize your appointment.
                </p>
                <a href={STRIPE_DEPOSIT_LINK} target="_blank" rel="noopener noreferrer" style={{display:"inline-block"}}>
                  <button className="btn btn-primary" style={{fontSize:13,padding:"16px 48px",letterSpacing:3}}>
                    Pay $10 Deposit ✦
                  </button>
                </a>
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
              ? <button className="btn btn-primary" disabled={sending} onClick={handleConfirm}>{sending ? "Sending..." : "Proceed to Deposit ✦"}</button>
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
