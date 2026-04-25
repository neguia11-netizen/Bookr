import { useState, useEffect } from "react";

const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";

const EMAILJS_SERVICE_ID = "service_qj22hlr";
const EMAILJS_TEMPLATE_ID = "template_pp8uavo";
const EMAILJS_CLIENT_TEMPLATE_ID = "template_0az8fc7";
const EMAILJS_PUBLIC_KEY = "ga_ZOXpSGY692r6cR";

async function saveBooking(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ ...data, status: "paid" }),
  });
  if (!res.ok) throw new Error("Failed to save booking");
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
    --bg: #0f0a0c; --bg2: #1a1015; --border: #3a1f2e; --border2: #4d2a3d;
    --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840;
    --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page {
    min-height: 100vh; background: var(--bg); color: var(--text);
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 40px 24px;
  }
  .page::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      radial-gradient(ellipse 18px 12px at 8% 12%, #2a0f1a55 0%, transparent 70%),
      radial-gradient(ellipse 10px 16px at 18% 8%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 14px 9px at 30% 18%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 20px 13px at 45% 6%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 12px 18px at 60% 15%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 13px 17px at 5% 35%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 19px 11px at 22% 40%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 17px 12px at 55% 38%, #2a0f1a33 0%, transparent 70%),
      radial-gradient(ellipse 18px 12px at 28% 62%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 11px 16px at 25% 85%, #2a0f1a44 0%, transparent 70%),
      radial-gradient(ellipse 19px 13px at 58% 88%, #2a0f1a33 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.7;
  }
  .content { position: relative; z-index: 1; text-align: center; max-width: 520px; width: 100%; }
  .sparkle-top { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 32px; display: block; animation: fadeIn 0.8s ease both; }
  .icon-wrap { margin-bottom: 28px; }
  .icon-ring {
    width: 90px; height: 90px; border-radius: 50%; border: 1px solid var(--rose-dim);
    display: flex; align-items: center; justify-content: center; margin: 0 auto;
    background: radial-gradient(circle, #2a0e1a 0%, var(--bg2) 100%); font-size: 36px;
    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both, glow 3s ease-in-out 1s infinite;
  }
  @keyframes popIn { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 40px #c4415a44, inset 0 0 20px #c4415a11; }
    50% { box-shadow: 0 0 60px #c4415a77, inset 0 0 30px #c4415a22; }
  }
  h1 { font-family:'Playfair Display',serif; font-size:clamp(32px,7vw,52px); font-style:italic; font-weight:700; color:var(--text); margin-bottom:14px; animation:fadeUp 0.6s ease 0.4s both; }
  h1 span { color: var(--rose-lt); }
  .subtitle { font-size:14px; color:var(--muted); line-height:1.8; margin-bottom:36px; animation:fadeUp 0.6s ease 0.5s both; }
  .detail-card { background:var(--bg2); border:1px solid var(--border); padding:24px 28px; margin-bottom:32px; position:relative; overflow:hidden; animation:fadeUp 0.6s ease 0.6s both; }
  .detail-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--rose-dim),var(--rose),var(--rose-dim)); }
  .detail-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); font-size:13px; }
  .detail-row:last-child { border-bottom:none; }
  .detail-key { color:var(--muted); font-size:10px; letter-spacing:2px; text-transform:uppercase; }
  .detail-val { color:var(--text); font-family:'Playfair Display',serif; font-style:italic; font-size:15px; }
  .divider { display:flex; align-items:center; gap:12px; color:var(--rose-dim); font-size:11px; letter-spacing:3px; margin-bottom:28px; animation:fadeUp 0.6s ease 0.7s both; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,var(--rose-dim)); }
  .divider::after { transform:scaleX(-1); }
  .next-steps { background:var(--bg2); border:1px solid var(--border); padding:20px 24px; margin-bottom:32px; text-align:left; animation:fadeUp 0.6s ease 0.75s both; }
  .next-steps h3 { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--rose); margin-bottom:14px; }
  .next-step-item { display:flex; gap:12px; padding:8px 0; font-size:13px; color:var(--muted); line-height:1.6; border-bottom:1px solid var(--border); }
  .next-step-item:last-child { border-bottom:none; }
  .step-dot { color:var(--rose); flex-shrink:0; margin-top:2px; }
  .btn-wrap { display:flex; flex-direction:column; gap:12px; align-items:center; animation:fadeUp 0.6s ease 0.85s both; }
  .btn { padding:14px 40px; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-weight:500; border:none; border-radius:2px; text-decoration:none; display:inline-block; }
  .btn-primary { background:var(--rose); color:white; box-shadow:0 4px 20px #c4415a44; }
  .btn-primary:hover { background:#d4506a; box-shadow:0 4px 28px #c4415a66; transform:translateY(-1px); }
  .btn-ghost { background:none; border:1px solid var(--border2); color:var(--muted); }
  .btn-ghost:hover { border-color:var(--rose-dim); color:var(--rose-lt); }
  .footer-note { margin-top:28px; font-size:11px; color:var(--dim); letter-spacing:1px; animation:fadeUp 0.6s ease 0.9s both; }
  .footer-note a { color:var(--rose-dim); text-decoration:none; }
  .footer-note a:hover { color:var(--rose-lt); }
  .inspo-saved { margin-bottom: 20px; animation:fadeUp 0.6s ease 0.65s both; }
  .inspo-saved p { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--rose); margin-bottom:8px; }
  .inspo-saved img { max-width:100%; max-height:160px; object-fit:cover; border:1px solid var(--border2); border-radius:2px; }
`;

export default function Success() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const email    = localStorage.getItem("bookingEmail");
    const service  = localStorage.getItem("bookingService");
    const date     = localStorage.getItem("bookingDate");
    const time     = localStorage.getItem("bookingTime");
    const duration = localStorage.getItem("bookingDuration");
    const price    = localStorage.getItem("bookingPrice");
    const name     = localStorage.getItem("bookingName");
    const phone    = localStorage.getItem("bookingPhone");
    const notes    = localStorage.getItem("bookingNotes") || "";
    const inspoUrl = localStorage.getItem("bookingInspo") || "";

    if (service && date && time) {
      setBooking({ service, date, time, name, email, inspoUrl });

      Promise.allSettled([
        saveBooking({
          service, date, time, duration, price,
          client_name: name,
          client_email: email,
          client_phone: phone,
          notes,
          inspo_url: inspoUrl || null,
        }),
        sendEmail({
          service, date, time, duration, price,
          client_name: name,
          client_email: email,
          client_phone: phone,
          notes: notes || "None",
        }),
      ]);

      localStorage.clear();
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="content">
          <span className="sparkle-top">✦ ✦ ✦</span>
          <div className="icon-wrap">
            <div className="icon-ring">💕</div>
          </div>
          <h1>Deposit <span>Received!</span></h1>
          <p className="subtitle">
            Your $10 deposit has been received and your appointment is officially secured.<br />
            We can't wait to see you!
          </p>

          <div className="detail-card">
            {booking ? (<>
              <div className="detail-row"><span className="detail-key">Service</span><span className="detail-val">{booking.service}</span></div>
              <div className="detail-row"><span className="detail-key">Date</span><span className="detail-val">{booking.date}</span></div>
              <div className="detail-row"><span className="detail-key">Time</span><span className="detail-val">{booking.time}</span></div>
              <div className="detail-row"><span className="detail-key">Name</span><span className="detail-val">{booking.name}</span></div>
            </>) : (<>
              <div className="detail-row"><span className="detail-key">Studio</span><span className="detail-val">Acrylic Faerie</span></div>
              <div className="detail-row"><span className="detail-key">Location</span><span className="detail-val">San Antonio, TX</span></div>
            </>)}
            <div className="detail-row"><span className="detail-key">Deposit Paid</span><span className="detail-val">$10.00 ✦</span></div>
          </div>

          {booking?.inspoUrl && (
            <div className="inspo-saved">
              <p>Your Inspo Photo</p>
              <img src={booking.inspoUrl} alt="Your inspo" />
            </div>
          )}

          <div className="divider">What's Next</div>

          <div className="next-steps">
            <h3>Before Your Appointment</h3>
            <div className="next-step-item"><span className="step-dot">✦</span><span>Check your email for your booking confirmation with all the details.</span></div>
            <div className="next-step-item"><span className="step-dot">✦</span><span>Come with clean, bare nails — no polish or product on them.</span></div>
            <div className="next-step-item"><span className="step-dot">✦</span><span>Save inspo pics! DM us on Instagram @acrylicfaerie if you have any questions.</span></div>
            <div className="next-step-item"><span className="step-dot">✦</span><span>Need to reschedule? Email us at acrylicfaerie.biz@gmail.com as soon as possible.</span></div>
          </div>

          <div className="btn-wrap">
            <a href="https://www.instagram.com/acrylicfaerie" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Follow Us @acrylicfaerie ✦
            </a>
            <a href="/" className="btn btn-ghost">Back to Booking</a>
          </div>

          <p className="footer-note">
            Questions? Reach us at <a href="mailto:acrylicfaerie.biz@gmail.com">acrylicfaerie.biz@gmail.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
