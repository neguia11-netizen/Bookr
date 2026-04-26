import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #0f0a0c; --bg2: #1a1015; --border: #3a1f2e; --border2: #4d2a3d;
    --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840;
    --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; position: relative; overflow: hidden; }
  .page::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%),
      radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 18px 12px at 28% 62%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.7;
  }
  .content { position: relative; z-index: 1; text-align: center; max-width: 520px; width: 100%; }
  .sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 28px; display: block; animation: fadeIn 0.8s ease both; }
  .icon-ring { width: 90px; height: 90px; border-radius: 50%; border: 1px solid var(--rose-dim); display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; background: radial-gradient(circle, #2a0e1a 0%, var(--bg2) 100%); font-size: 36px; animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both, glow 3s ease-in-out 1s infinite; }
  @keyframes popIn { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 40px #c4415a44; } 50% { box-shadow: 0 0 60px #c4415a77; } }
  h1 { font-family:'Playfair Display',serif; font-size:clamp(32px,7vw,48px); font-style:italic; font-weight:700; color:var(--text); margin-bottom:12px; animation:fadeUp 0.6s ease 0.4s both; }
  h1 span { color: var(--rose-lt); }
  .subtitle { font-size:14px; color:var(--muted); line-height:1.8; margin-bottom:32px; animation:fadeUp 0.6s ease 0.5s both; }
  .detail-card { background:var(--bg2); border:1px solid var(--border); padding:24px 28px; margin-bottom:28px; position:relative; animation:fadeUp 0.6s ease 0.6s both; }
  .detail-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--rose-dim),var(--rose),var(--rose-dim)); }
  .detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border); font-size:13px; }
  .detail-row:last-child { border-bottom:none; }
  .detail-key { color:var(--muted); font-size:10px; letter-spacing:2px; text-transform:uppercase; }
  .detail-val { color:var(--text); font-family:'Playfair Display',serif; font-style:italic; }
  .btn-wrap { display:flex; flex-direction:column; gap:12px; align-items:center; animation:fadeUp 0.6s ease 0.8s both; }
  .btn { padding:14px 40px; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; cursor:pointer; font-weight:500; border:none; border-radius:2px; text-decoration:none; display:inline-block; transition:all 0.2s; }
  .btn-primary { background:var(--rose); color:white; box-shadow:0 4px 20px #c4415a44; }
  .btn-primary:hover { background:#d4506a; transform:translateY(-1px); }
  .btn-ghost { background:none; border:1px solid var(--border2); color:var(--muted); }
  .btn-ghost:hover { border-color:var(--rose-dim); color:var(--rose-lt); }
  .note { margin-top:24px; font-size:11px; color:var(--dim); letter-spacing:1px; animation:fadeUp 0.6s ease 0.9s both; }
`;

export default function GiftSuccess() {
  const [gift, setGift] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const recipientName  = localStorage.getItem("giftRecipientName");
    const recipientEmail = localStorage.getItem("giftRecipientEmail");
    const senderName     = localStorage.getItem("giftSenderName");
    const message        = localStorage.getItem("giftMessage") || "";
    const amount         = localStorage.getItem("giftAmount");

    if (recipientName && recipientEmail && amount) {
      setGift({ recipientName, recipientEmail, senderName, message, amount });

      // Send gift email via Resend
      fetch("/api/send-gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName, recipientEmail, senderName, message, amount,
          secret: "faerie-gift-2024",
        }),
      }).then(() => setSent(true)).catch(() => setSent(true));

      localStorage.removeItem("giftRecipientName");
      localStorage.removeItem("giftRecipientEmail");
      localStorage.removeItem("giftSenderName");
      localStorage.removeItem("giftMessage");
      localStorage.removeItem("giftAmount");
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="content">
          <span className="sparkle">✦ ✦ ✦</span>
          <div className="icon-ring">🎁</div>
          <h1>Gift <span>Sent!</span></h1>
          <p className="subtitle">
            Your gift card has been purchased and a beautiful gift email
            {gift ? ` has been sent to ${gift.recipientName}` : " is on its way"}! 💕
          </p>

          {gift && (
            <div className="detail-card">
              <div className="detail-row"><span className="detail-key">Gift Amount</span><span className="detail-val">{gift.amount}</span></div>
              <div className="detail-row"><span className="detail-key">Sent To</span><span className="detail-val">{gift.recipientName}</span></div>
              <div className="detail-row"><span className="detail-key">Email</span><span className="detail-val">{gift.recipientEmail}</span></div>
              {gift.message && <div className="detail-row"><span className="detail-key">Message</span><span className="detail-val" style={{fontStyle:"italic"}}>"{gift.message}"</span></div>}
            </div>
          )}

          <div className="btn-wrap">
            <a href="/giftcard" className="btn btn-primary">Send Another Gift ✦</a>
            <a href="/" className="btn btn-ghost">Back to Booking</a>
          </div>

          <p className="note">Questions? acrylicfaerie.biz@gmail.com</p>
        </div>
      </div>
    </>
  );
}

