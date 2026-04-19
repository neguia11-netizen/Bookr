import { useState } from "react";

const PHOTOS = [
  { file: "IMG_0242.jpeg", alt: "Colorful abstract nail art with gems" },
  { file: "IMG_0323.jpeg", alt: "Pink and gold stiletto nails with floral design" },
  { file: "IMG_2897.jpeg", alt: "White marble stiletto nails with charms" },
  { file: "IMG_3545.jpeg", alt: "Orange star leopard print French tips" },
  { file: "IMG_3736.jpeg", alt: "Rainbow zebra print stiletto nails" },
  { file: "IMG_5286.jpeg", alt: "Dark green swirl gel manicure" },
  { file: "IMG_5845.jpeg", alt: "Apple themed 3D nail art" },
  { file: "IMG_6004.jpeg", alt: "Pink chrome swirl almond nails" },
  { file: "IMG_6415.jpeg", alt: "Nude butterfly French tip nails with charms" },
  { file: "IMG_7396.jpeg", alt: "Deep red glitter stiletto nails with gems" },
  { file: "IMG_9203.jpeg", alt: "White French stiletto nails" },
  { file: "IMG_9390.jpeg", alt: "Teal gel manicure with gold charms" },
  { file: "IMG_9870.jpeg", alt: "Strawberry 3D nail art with bows" },
  { file: "IMG_9943.jpeg", alt: "Aura blushed chrome nails with silver tips" },
  { file: "IMG_0160.jpeg", alt: "Glass chrome stiletto nails with pink art" },
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
  }

  .page::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%),
      radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 20px 13px at 45% 6%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 17px 12px at 55% 38%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 18px 12px at 28% 62%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.7;
  }

  .header {
    text-align: center;
    padding: 48px 24px 32px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, #1e0d16 0%, transparent 100%);
    position: relative; z-index: 1;
  }
  .header-sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 16px; display: block; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: clamp(36px, 7vw, 58px); font-weight: 700; font-style: italic; letter-spacing: 2px; color: var(--text); line-height: 1; }
  .header h1 span { color: var(--rose-lt); }
  .header-sub { margin-top: 10px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); }
  .header-divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; color: var(--rose-dim); font-size: 11px; letter-spacing: 3px; }
  .header-divider::before, .header-divider::after { content: ''; width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--rose-dim)); }
  .header-divider::after { transform: scaleX(-1); }

  .nav {
    display: flex; justify-content: center; gap: 0;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    position: relative; z-index: 1;
  }
  .nav a {
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    padding: 8px 20px;
    border: 1px solid transparent;
    transition: all 0.2s;
  }
  .nav a:hover { color: var(--rose-lt); border-color: var(--border2); }
  .nav a.active { color: var(--rose-lt); border-color: var(--rose-dim); }

  .container { max-width: 1100px; margin: 0 auto; padding: 40px 16px; position: relative; z-index: 1; }

  .gallery-header { text-align: center; margin-bottom: 32px; }
  .gallery-title { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 6px; }
  .gallery-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--dim); }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }
  @media (max-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 3px; } }

  .grid-item {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    cursor: pointer;
    background: var(--bg2);
  }
  .grid-item img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }
  .grid-item:hover img { transform: scale(1.05); }
  .grid-item-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #c4415a33 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex; align-items: center; justify-content: center;
  }
  .grid-item:hover .grid-item-overlay { opacity: 1; }
  .overlay-icon { font-size: 24px; color: white; text-shadow: 0 0 20px #c4415a; }

  /* LIGHTBOX */
  .lightbox {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(10, 5, 8, 0.97);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .lightbox-content {
    position: relative;
    max-width: 800px;
    max-height: 90vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lightbox img {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border: 1px solid var(--border2);
    box-shadow: 0 0 60px #c4415a22;
  }
  .lightbox-close {
    position: fixed; top: 20px; right: 24px;
    background: none; border: 1px solid var(--border2);
    color: var(--muted); font-size: 20px;
    width: 40px; height: 40px;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
  }
  .lightbox-close:hover { border-color: var(--rose); color: var(--rose-lt); }
  .lightbox-nav {
    position: fixed;
    top: 50%; transform: translateY(-50%);
    background: none; border: 1px solid var(--border2);
    color: var(--muted); font-size: 22px;
    width: 44px; height: 44px;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
  }
  .lightbox-nav:hover { border-color: var(--rose); color: var(--rose-lt); }
  .lightbox-prev { left: 16px; }
  .lightbox-next { right: 16px; }
  .lightbox-count {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    font-size: 11px; letter-spacing: 3px; color: var(--dim); text-transform: uppercase;
  }

  .book-cta {
    text-align: center;
    padding: 48px 24px;
    border-top: 1px solid var(--border);
    position: relative; z-index: 1;
  }
  .book-cta p { font-size: 13px; color: var(--muted); letter-spacing: 1px; margin-bottom: 20px; line-height: 1.8; }
  .btn {
    padding: 14px 40px; font-family: 'DM Sans', sans-serif;
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s; font-weight: 500;
    border: none; border-radius: 2px; text-decoration: none; display: inline-block;
  }
  .btn-primary { background: var(--rose); color: white; box-shadow: 0 4px 20px #c4415a44; }
  .btn-primary:hover { background: #d4506a; transform: translateY(-1px); }
`;

export default function Portfolio() {
  const [lightbox, setLightbox] = useState(null);

  function prev() { setLightbox(i => (i - 1 + PHOTOS.length) % PHOTOS.length); }
  function next() { setLightbox(i => (i + 1) % PHOTOS.length); }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">San Antonio · Home Based Nail Technician</p>
          <div className="header-divider">Portfolio</div>
        </div>

        <nav className="nav">
          <a href="/">Book Now</a>
          <a href="/portfolio" className="active">Gallery</a>
        </nav>

        <div className="container">
          <div className="gallery-header">
            <h2 className="gallery-title">Our Work</h2>
            <p className="gallery-sub">{PHOTOS.length} looks · Tap to view</p>
          </div>

          <div className="grid">
            {PHOTOS.map((photo, i) => (
              <div key={i} className="grid-item" onClick={() => setLightbox(i)}>
                <img src={`/gallery/${photo.file}`} alt={photo.alt} loading="lazy" />
                <div className="grid-item-overlay">
                  <span className="overlay-icon">✦</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="book-cta">
          <p>Love what you see? Book your appointment today.<br />DM us on Instagram @acrylicfaerie for inspo questions.</p>
          <a href="/" className="btn btn-primary">Book Now ✦</a>
        </div>

        {lightbox !== null && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <img src={`/gallery/${PHOTOS[lightbox].file}`} alt={PHOTOS[lightbox].alt} />
            </div>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <button className="lightbox-nav lightbox-prev" onClick={prev}>‹</button>
            <button className="lightbox-nav lightbox-next" onClick={next}>›</button>
            <div className="lightbox-count">{lightbox + 1} / {PHOTOS.length}</div>
          </div>
        )}
      </div>
    </>
  );
}
