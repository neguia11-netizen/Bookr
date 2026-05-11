import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  :root { --bg: #0f0a0c; --bg2: #1a1015; --border: #3a1f2e; --border2: #4d2a3d; --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840; --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
  .card { background: var(--bg2); border: 1px solid var(--border2); max-width: 480px; width: 100%; padding: 36px; position: relative; text-align: center; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 20px; display: block; }
  h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; font-weight: 400; color: var(--text); margin-bottom: 8px; }
  .sub { font-size: 12px; color: var(--dim); letter-spacing: 1px; margin-bottom: 24px; }
  .booking-box { background: var(--bg); border: 1px solid var(--border); padding: 16px 20px; margin-bottom: 20px; text-align: left; }
  .booking-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .booking-row:last-child { border-bottom: none; }
  .booking-key { color: var(--muted); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
  .booking-val { color: var(--text); }
  .warning { background: #2a0e0e; border: 1px solid #7a2828; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #e87a7a; line-height: 1.7; text-align: left; }
  .btn { padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; width: 100%; margin-bottom: 10px; }
  .btn-danger { background: #7a2828; color: white; }
  .btn-danger:hover { background: #9a3232; }
  .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }
  .success { font-size: 14px; color: var(--muted); line-height: 1.8; }
  .success h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-style: italic; color: var(--text); margin-bottom: 12px; }
  .error { font-size: 13px; color: #e87a7a; margin-top: 12px; }
`;

export default function Cancel() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState(null);

  const id = new URLSearchParams(window.location.search).get("id");

  const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";

  useEffect(() => {
    if (!id) { setError("Invalid link."); setLoading(false); return; }
    fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}&select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.length) setBooking(data[0]);
        else setError("Booking not found.");
        setLoading(false);
      })
      .catch(() => { setError("Could not load booking."); setLoading(false); });
  }, []);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch("/api/cancel-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setCancelled(true);
      else setError("Something went wrong. Please contact us.");
    } catch { setError("Something went wrong. Please contact us."); }
    finally { setCancelling(false); }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="card">
          <span className="sparkle">✦ ✦ ✦</span>
          {loading && <p style={{color:"var(--muted)"}}>Loading your booking...</p>}
          {error && <p className="error">{error}</p>}
          {cancelled && (
            <div className="success">
              <h2>Appointment Cancelled</h2>
              <p>Your appointment has been cancelled. Your $10 deposit has been forfeited per our cancellation policy.<br/><br/>We hope to see you again soon! 💕</p>
              <br/>
              <a href="/" style={{display:"inline-block",background:"var(--rose)",color:"white",padding:"13px 28px",textDecoration:"none",fontSize:11,letterSpacing:3,textTransform:"uppercase",borderRadius:2}}>Book Again ✦</a>
            </div>
          )}
          {!loading && !error && !cancelled && booking && (
            <>
              <h1>Cancel Appointment</h1>
              <p className="sub">Please review before confirming</p>
              <div className="booking-box">
                <div className="booking-row"><span className="booking-key">Name</span><span className="booking-val">{booking.client_name}</span></div>
                <div className="booking-row"><span className="booking-key">Service</span><span className="booking-val">{booking.service}</span></div>
                <div className="booking-row"><span className="booking-key">Date</span><span className="booking-val">{booking.date}</span></div>
                <div className="booking-row"><span className="booking-key">Time</span><span className="booking-val">{booking.time}</span></div>
              </div>
              <div className="warning">
                ⚠️ Your $10 deposit will be <strong>forfeited</strong> upon cancellation. This cannot be undone.
              </div>
              <button className="btn btn-danger" disabled={cancelling} onClick={handleCancel}>
                {cancelling ? "Cancelling..." : "Yes, Cancel My Appointment"}
              </button>
              <a href="/" className="btn btn-ghost" style={{display:"block",textDecoration:"none",textAlign:"center"}}>Keep My Appointment</a>
              {error && <p className="error">{error}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
