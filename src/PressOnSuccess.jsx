import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  :root { --bg: #0f0a0c; --bg2: #1a1015; --border: #3a1f2e; --border2: #4d2a3d; --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840; --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
  .content { max-width: 520px; width: 100%; text-align: center; }
  .sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 28px; display: block; animation: fadeIn 0.8s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .icon { font-size: 48px; margin-bottom: 20px; display: block; animation: pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
  @keyframes pop { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  h1 { font-family: 'Playfair Display', serif; font-size: 40px; font-style: italic; font-weight: 700; color: var(--text); margin-bottom: 12px; }
  h1 span { color: var(--rose-lt); }
  p { font-size: 14px; color: var(--muted); line-height: 1.8; margin-bottom: 28px; }
  .detail-card { background: var(--bg2); border: 1px solid var(--border); padding: 24px; margin-bottom: 28px; position: relative; text-align: left; }
  .detail-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-key { color: var(--muted); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
  .detail-val { color: var(--text); text-align: right; }
  .btn { display: inline-block; padding: 14px 40px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; text-decoration: none; margin: 6px; }
  .btn-primary { background: var(--rose); color: white; }
  .btn-primary:hover { background: #d4506a; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }
`;

export default function PressOnSuccess() {
  const [order, setOrder] = useState(null);

  const orderId = new URLSearchParams(window.location.search).get("order");
  const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";

  useEffect(() => {
    if (!orderId) return;
    // Mark as paid and send emails
    fetch("/api/pressons-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, secret: "faerie-pressons-2024" }),
    });
    // Load order details
    fetch(`${SUPABASE_URL}/rest/v1/press_on_orders?id=eq.${orderId}&select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => { if (data.length) setOrder(data[0]); });
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="content">
          <span className="sparkle">✦ ✦ ✦</span>
          <span className="icon">💅</span>
          <h1>Order <span>Placed!</span></h1>
          <p>Your press-on order has been paid and confirmed! Angie will review your order and get started on your custom set. Check your email for confirmation details.</p>

          {order && (
            <div className="detail-card">
              <div className="detail-row"><span className="detail-key">Material</span><span className="detail-val">{order.material}</span></div>
              <div className="detail-row"><span className="detail-key">Shape</span><span className="detail-val">{order.shape}</span></div>
              <div className="detail-row"><span className="detail-key">Length</span><span className="detail-val">{order.length}</span></div>
              {order.addons && <div className="detail-row"><span className="detail-key">Add-ons</span><span className="detail-val">{order.addons}</span></div>}
              <div className="detail-row"><span className="detail-key">Pickup/Delivery</span><span className="detail-val">{order.delivery}</span></div>
              <div className="detail-row"><span className="detail-key">Total Paid</span><span className="detail-val" style={{color:"var(--rose-lt)",fontFamily:"Playfair Display,serif",fontStyle:"italic",fontSize:16}}>${(order.total / 100).toFixed(2)} ✦</span></div>
            </div>
          )}

          <div>
            <a href="https://instagram.com/acrylicfaerie" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Follow @acrylicfaerie ✦</a>
            <a href="/" className="btn btn-ghost">Book an Appointment</a>
          </div>
        </div>
      </div>
    </>
  );
}
