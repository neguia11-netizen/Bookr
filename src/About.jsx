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
      radial-gradient(ellipse 20px 13px at 45% 6%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 18px at 60% 15%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 17px 12px at 55% 38%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 18px 12px at 28% 62%, #2a0f1a44 0%, transparent 70%),
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

  .container { max-width: 900px; margin: 0 auto; padding: 56px 24px; }

  /* HERO SECTION */
  .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; margin-bottom: 64px; }
  @media (max-width: 700px) { .hero { grid-template-columns: 1fr; } }

  .hero-img-wrap { position: relative; }
  .hero-img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    object-position: center top;
    border: 1px solid var(--border2);
    display: block;
    position: relative; z-index: 1;
  }
  .hero-img-accent {
    position: absolute;
    top: 16px; left: 16px; right: -16px; bottom: -16px;
    border: 1px solid var(--rose-dim);
    z-index: 0;
  }

  .hero-content { display: flex; flex-direction: column; gap: 20px; }
  .hero-tag { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rose); }
  .hero-name { font-family: 'Playfair Display', serif; font-size: clamp(36px, 5vw, 52px); font-style: italic; font-weight: 700; color: var(--text); line-height: 1.1; }
  .hero-name span { color: var(--rose-lt); display: block; font-size: 0.6em; font-weight: 400; margin-top: 4px; }
  .hero-bio { font-size: 14px; color: var(--muted); line-height: 1.9; }
  .hero-divider { width: 40px; height: 1px; background: var(--rose-dim); }

  .hero-stats { display: flex; gap: 24px; flex-wrap: wrap; }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: 'Playfair Display', serif; font-size: 32px; font-style: italic; color: var(--rose-lt); line-height: 1; }
  .hero-stat-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); margin-top: 4px; }

  .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn { padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; text-decoration: none; display: inline-block; }
  .btn-primary { background: var(--rose); color: white; box-shadow: 0 4px 20px #c4415a44; }
  .btn-primary:hover { background: #d4506a; transform: translateY(-1px); }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }

  /* MY STORY */
  .section { margin-bottom: 56px; }
  .section-label { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--rose); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--rose-dim), transparent); }
  .section-title { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 16px; }
  .section-text { font-size: 14px; color: var(--muted); line-height: 1.9; }
  .section-text + .section-text { margin-top: 14px; }

  /* VALUES */
  .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
  @media (max-width: 600px) { .values-grid { grid-template-columns: 1fr; } }
  .value-card { background: var(--bg2); border: 1px solid var(--border); padding: 24px 20px; position: relative; }
  .value-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .value-icon { font-size: 24px; margin-bottom: 12px; display: block; }
  .value-title { font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; color: var(--text); margin-bottom: 8px; }
  .value-text { font-size: 12px; color: var(--muted); line-height: 1.7; }

  /* CREDENTIALS */
  .cred-card { background: var(--bg2); border: 1px solid var(--border); padding: 24px 28px; display: flex; align-items: center; gap: 20px; margin-bottom: 10px; }
  .cred-icon { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--rose-dim); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; background: #200e18; }
  .cred-title { font-size: 14px; color: var(--text); font-weight: 400; margin-bottom: 3px; }
  .cred-sub { font-size: 12px; color: var(--dim); letter-spacing: 0.5px; }

  /* FUN FACTS */
  .facts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; }
  @media (max-width: 500px) { .facts-grid { grid-template-columns: 1fr; } }
  .fact-item { background: var(--bg2); border: 1px solid var(--border); padding: 16px 18px; display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: var(--muted); line-height: 1.6; }
  .fact-dot { color: var(--rose); flex-shrink: 0; margin-top: 2px; }

  /* FOOTER */
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

export default function About() {
  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          <div className="header-divider">Meet the Artist</div>
        </div>

        <nav className="nav">
          <a href="/">Book Now</a>
          <a href="/portfolio">Gallery</a>
          <a href="/giftcard">Gift Cards</a>
          <a href="/about" className="active">About</a>
        </nav>

        <div className="container">

          {/* HERO */}
          <div className="hero">
            <div className="hero-img-wrap">
              <div className="hero-img-accent" />
              <img src="/angie.jpg" alt="Angelita — Acrylic Faerie" className="hero-img" />
            </div>
            <div className="hero-content">
              <span className="hero-tag">Meet Your Nail Artist</span>
              <div className="hero-name">
                Angelita
                <span>— "Angie"</span>
              </div>
              <div className="hero-divider" />
              <p className="hero-bio">
                Licensed nail technician based in San Antonio, TX. I specialize in acrylic sets and nail art — turning your nail visions into reality, one set at a time.
              </p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-num">3+</div>
                  <div className="hero-stat-label">Years Experience</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-num">✦</div>
                  <div className="hero-stat-label">Licensed Tech</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-num">💕</div>
                  <div className="hero-stat-label">San Antonio</div>
                </div>
              </div>
              <div className="hero-cta">
                <a href="/" className="btn btn-primary">Book Now ✦</a>
                <a href="/portfolio" className="btn btn-ghost">View My Work</a>
              </div>
            </div>
          </div>

          {/* MY STORY */}
          <div className="section">
            <div className="section-label">My Story</div>
            <h2 className="section-title">How It All Started</h2>
            <p className="section-text">
              It all started with my own nails. I've always loved the way a fresh set makes you feel — confident, put together, like the best version of yourself. I started doing my own nails at home, experimenting with different shapes, colors, and art. What began as a personal obsession quickly turned into something I wanted to share.
            </p>
            <p className="section-text">
              When friends started asking me to do their nails, I realized this wasn't just a hobby — it was a calling. Watching someone's face light up when they look down at their hands for the first time after a fresh set? That feeling never gets old. I enrolled at Vogue School of Cosmetology, got my license, and Acrylic Faerie was born.
            </p>
            <p className="section-text">
              Three years later I'm still just as obsessed. Every client is a new canvas and every set is a chance to create something beautiful. Whether you want something clean and minimal or bold and detailed, I'm here for it all.
            </p>
          </div>

          {/* VALUES */}
          <div className="section">
            <div className="section-label">What I Stand For</div>
            <h2 className="section-title">My Approach</h2>
            <div className="values-grid">
              <div className="value-card">
                <span className="value-icon">💅</span>
                <div className="value-title">Quality First</div>
                <p className="value-text">I use professional grade products and take my time on every set. No rushing, no cutting corners — ever.</p>
              </div>
              <div className="value-card">
                <span className="value-icon">✨</span>
                <div className="value-title">Your Vision</div>
                <p className="value-text">I listen. Whether you have detailed inspo or just a vibe, I work with you to create exactly what you imagined.</p>
              </div>
              <div className="value-card">
                <span className="value-icon">🌸</span>
                <div className="value-title">Nail Health</div>
                <p className="value-text">Beautiful nails start with healthy nails. I prioritize proper prep, cuticle care, and the health of your natural nail.</p>
              </div>
            </div>
          </div>

          {/* CREDENTIALS */}
          <div className="section">
            <div className="section-label">Credentials</div>
            <h2 className="section-title">Training & Licensing</h2>
            <div className="cred-card">
              <div className="cred-icon">🎓</div>
              <div>
                <div className="cred-title">Vogue School of Cosmetology</div>
                <div className="cred-sub">Nail Technology Program · San Antonio, TX</div>
              </div>
            </div>
            <div className="cred-card">
              <div className="cred-icon">✦</div>
              <div>
                <div className="cred-title">Licensed Nail Technician</div>
                <div className="cred-sub">State of Texas · Actively Licensed</div>
              </div>
            </div>
            <div className="cred-card">
              <div className="cred-icon">💕</div>
              <div>
                <div className="cred-title">Specialty: Acrylics & Nail Art</div>
                <div className="cred-sub">3+ Years of Experience · San Antonio Home Studio</div>
              </div>
            </div>
          </div>

          {/* FUN FACTS */}
          <div className="section">
            <div className="section-label">Get to Know Me</div>
            <h2 className="section-title">A Little More About Angie</h2>
            <div className="facts-grid">
              <div className="fact-item"><span className="fact-dot">✦</span><span>I started doing nails on myself before I ever touched anyone else's — my hands were basically my portfolio before I had one.</span></div>
              <div className="fact-item"><span className="fact-dot">✦</span><span>Detailed nail art is my obsession. The more intricate, the more fun — 3D designs, hand painted themes, charms and all.</span></div>
              <div className="fact-item"><span className="fact-dot">✦</span><span>I believe getting your nails done is self care. My chair is a judgment free zone — come as you are, leave feeling amazing.</span></div>
              <div className="fact-item"><span className="fact-dot">✦</span><span>San Antonio born and raised 💙 Proud to serve my city from my home studio.</span></div>
            </div>
          </div>

          {/* CTA */}
          <div style={{textAlign:"center",padding:"32px 0 8px"}}>
            <p style={{fontSize:14,color:"var(--muted)",marginBottom:20,lineHeight:1.8}}>Ready to get your nails done?<br/>Book your appointment today — I can't wait to meet you!</p>
            <a href="/" className="btn btn-primary" style={{fontSize:12,padding:"16px 40px"}}>Book Your Appointment ✦</a>
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
