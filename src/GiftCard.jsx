import { useState } from "react";

const GIFT_CARDS = [
  {
    amount: 25,
    label: "$25",
    description: "Perfect for a gel manicure or nail fix add-on.",
    link: "https://buy.stripe.com/6oU8wOeuA08X1Yg0nO1ck01",
    icon: "✦",
  },
  {
    amount: 50,
    label: "$50",
    description: "Great for an acrylic overlay or gel manicure with nail art.",
    link: "https://buy.stripe.com/00waEW4U05th0Uc3A01ck02",
    icon: "✦✦",
  },
  {
    amount: 75,
    label: "$75",
    description: "Perfect for a small acrylic full set with simple nail art.",
    link: "https://buy.stripe.com/14A9AS4U06xl1Yg8Uk1ck03",
    icon: "✦✦✦",
  },
  {
    amount: 100,
    label: "$100",
    description: "Ideal for a medium or long acrylic full set with detailed nail art.",
    link: "https://buy.stripe.com/5kQ00i4U0f3RbyQb2s1ck04",
    icon: "✦✦✦✦",
  },
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

  .page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    position: relative;
    overflow-x: hidden;
  }
  .page::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%),
      radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 20px 13px at 45% 6%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 18px at 60% 15%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 17px 12px at 55% 38%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 18px 12px at 28% 62%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.7;
  }
  .page > * { position: relative; z-index: 1; }

  .header {
    text-align: center;
    padding: 48px 24px 36px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, #1e0d16 0%, transparent 100%);
  }
  .header-sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 18px; display: block; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(36px, 7vw, 58px); font-weight: 700; font-style: italic; color: var(--text); line-height: 1; text-shadow: 0 0 60px #c4415a55; }
  .header h1 span { color: var(--rose-lt); }
  .header-sub { margin-top: 10px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); }
  .header-divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; color: var(--rose-dim); font-size: 11px; letter-spacing: 3px; }
  .header-divider::before, .header-divider::after { content: ''; width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-dim)); }
  .header-divider::after { transform: scaleX(-1); }

  .nav { display: flex; justify-content: center; gap: 0; padding: 16px 24px; border-bottom: 1px solid var(--border); background: var(--bg2); }
  .nav a { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); text-decoration: none; padding: 8px 20px; border: 1px solid transparent; transition: all 0.2s; }
  .nav a:hover { color: var(--rose-lt); border-color: var(--border2); }
  .nav a.active { color: var(--rose-lt); border-color: var(--rose-dim); }

  .container { max-width: 900px; margin: 0 auto; padding: 56px 24px; }

  .intro { text-align: center; margin-bottom: 52px; }
  .intro h2 { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 12px; }
  .intro p { font-size: 14px; color: var(--muted); line-height: 1.8; max-width: 480px; margin: 0 auto; }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 56px;
  }
  @media (max-width: 600px) { .cards-grid { grid-template-columns: 1fr; } }

  .gift-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 32px 28px;
    position: relative;
    overflow: hidden;
    transition: all 0.25s;
    cursor: pointer;
    text-decoration: none;
    display: block;
  }
  .gift-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim));
  }
  .gift-card::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, #c4415a08 0%, transparent 60%);
    opacity: 0; transition: opacity 0.3s;
  }
  .gift-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 32px #c4415a18; }
  .gift-card:hover::after { opacity: 1; }

  .card-icon { font-size: 13px; color: var(--rose-dim); letter-spacing: 4px; margin-bottom: 20px; display: block; }
  .card-amount {
    font-family: 'Playfair Display', serif;
    font-size: 52px;
    font-style: italic;
    font-weight: 700;
    color: var(--rose-lt);
    line-height: 1;
    margin-bottom: 12px;
    text-shadow: 0 0 40px #c4415a44;
  }
  .card-desc { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 24px; }
  .card-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--rose-lt);
    border: 1px solid var(--rose-dim);
    padding: 10px 20px;
    transition: all 0.2s;
    background: none;
  }
  .gift-card:hover .card-btn { background: var(--rose); color: white; border-color: var(--rose); }

  .how-it-works {
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 36px;
    margin-bottom: 40px;
    position: relative;
  }
  .how-it-works::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim));
  }
  .how-title { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rose); margin-bottom: 24px; }
  .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  @media (max-width: 600px) { .steps-grid { grid-template-columns: 1fr; } }
  .how-step { text-align: center; }
  .how-step-num {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid var(--rose-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic;
    color: var(--rose-lt); margin: 0 auto 12px;
  }
  .how-step h4 { font-size: 13px; color: var(--text); margin-bottom: 6px; font-weight: 400; }
  .how-step p { font-size: 12px; color: var(--muted); line-height: 1.6; }

  .note {
    text-align: center;
    padding: 20px;
    border: 1px solid var(--border);
    background: var(--bg2);
    font-size: 12px;
    color: var(--muted);
    line-height: 1.8;
  }
  .note a { color: var(--rose-dim); text-decoration: none; }
  .note a:hover { color: var(--rose-lt); }

  .footer { border-top: 1px solid var(--border); padding: 40px 24px; text-align: center; background: var(--bg2); }
  .footer-sparkle { font-size: 11px; letter-spacing: 6px; color: var(--rose); margin-bottom: 16px; display: block; }
  .footer-icons { display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
  .footer-icon { display: flex; flex-direction: column; align-items: center; gap: 6px; text-decoration: none; color: var(--muted); transition: all 0.2s; padding: 10px 14px; border: 1px solid transparent; border-radius: 4px; }
  .footer-icon:hover { color: var(--rose-lt); border-color: var(--border2); background: var(--bg3); }
  .footer-icon svg { width: 20px; height: 20px; fill: currentColor; }
  .footer-icon span { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; }
  .footer-copy { font-size: 11px; color: var(--dim); letter-spacing: 1px; }
  .footer-copy a { color: var(--rose-dim); text-decoration: none; }
`;

export default function GiftCard() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          <div className="header-divider">Gift Cards</div>
        </div>

        <nav className="nav">
          <a href="/">Book Now</a>
          <a href="/portfolio">Gallery</a>
          <a href="/giftcard" className="active">Gift Cards</a>
        </nav>

        <div className="container">
          <div className="intro">
            <h2>Give the Gift of Beautiful Nails</h2>
            <p>Treat someone special to an Acrylic Faerie experience. Gift cards are delivered instantly by email and never expire.</p>
          </div>

          <div className="cards-grid">
            {GIFT_CARDS.map((card) => (
              <a
                key={card.amount}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="gift-card"
                onMouseEnter={() => setHoveredCard(card.amount)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <span className="card-icon">{card.icon}</span>
                <div className="card-amount">{card.label}</div>
                <p className="card-desc">{card.description}</p>
                <div className="card-btn">
                  Purchase Gift Card →
                </div>
              </a>
            ))}
          </div>

          <div className="how-it-works">
            <div className="how-title">How It Works</div>
            <div className="steps-grid">
              <div className="how-step">
                <div className="how-step-num">1</div>
                <h4>Purchase</h4>
                <p>Choose an amount and complete payment securely through Stripe.</p>
              </div>
              <div className="how-step">
                <div className="how-step-num">2</div>
                <h4>Receive</h4>
                <p>The recipient gets a confirmation email with their gift card details.</p>
              </div>
              <div className="how-step">
                <div className="how-step-num">3</div>
                <h4>Redeem</h4>
                <p>Mention the gift card when booking and we'll apply it to the service.</p>
              </div>
            </div>
          </div>

          <div className="note">
            <p>Gift cards never expire · Questions? <a href="mailto:acrylicfaerie.biz@gmail.com">acrylicfaerie.biz@gmail.com</a></p>
            <p style={{marginTop:6}}>To redeem, mention your gift card email when booking at <a href="/">acrylicfaerie.com</a></p>
          </div>
        </div>

        <div className="footer">
          <span className="footer-sparkle">✦ ✦ ✦</span>
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
          <p className="footer-copy">© 2026 Acrylic Faerie · <a href="mailto:acrylicfaerie.biz@gmail.com">acrylicfaerie.biz@gmail.com</a></p>
        </div>
      </div>
    </>
  );
}
