import { useState, useEffect } from "react";

const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  :root { --bg: #0f0a0c; --bg2: #1a1015; --bg3: #221520; --border: #3a1f2e; --border2: #4d2a3d; --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840; --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; }
  .header { text-align: center; padding: 40px 24px 28px; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, #1e0d16 0%, transparent 100%); }
  .header-sparkle { font-size: 13px; letter-spacing: 8px; color: var(--rose); margin-bottom: 14px; display: block; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; font-style: italic; color: var(--text); }
  .header h1 span { color: var(--rose-lt); }
  .header-sub { margin-top: 8px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .container { max-width: 700px; margin: 0 auto; padding: 40px 24px; }
  .booking-summary { background: var(--bg2); border: 1px solid var(--border); padding: 20px 24px; margin-bottom: 28px; position: relative; }
  .booking-summary::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .summary-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--rose); margin-bottom: 12px; display: block; }
  .summary-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-key { color: var(--muted); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
  .summary-val { color: var(--text); }
  .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--text); margin-bottom: 16px; }
  .cal-box { background: var(--bg2); border: 1px solid var(--border); padding: 20px; margin-bottom: 20px; }
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cal-header h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--text); }
  .cal-nav { background: none; border: 1px solid var(--border2); color: var(--muted); width: 28px; height: 28px; cursor: pointer; font-size: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cal-nav:hover { border-color: var(--rose); color: var(--rose-lt); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-day-name { text-align: center; font-size: 9px; letter-spacing: 1px; color: var(--dim); text-transform: uppercase; padding: 4px 0 10px; }
  .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 50%; border: 1px solid transparent; cursor: default; color: var(--dim); }
  .cal-day.available { color: var(--text); cursor: pointer; }
  .cal-day.available:hover { background: var(--bg3); border-color: var(--border2); }
  .cal-day.selected { background: var(--rose); color: white; border-color: var(--rose); box-shadow: 0 0 14px #c4415a55; }
  .cal-day.today { border-color: var(--rose-dim); }
  .times-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
  .time-slot { padding: 12px; border: 1px solid var(--border); background: var(--bg); font-size: 13px; text-align: center; cursor: pointer; transition: all 0.15s; color: var(--muted); border-radius: 2px; }
  .time-slot:hover { border-color: var(--border2); color: var(--text); }
  .time-slot.selected { border-color: var(--rose); background: #200e18; color: var(--rose-lt); }
  .notes-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .notes-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .notes-input { background: var(--bg2); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 14px; outline: none; resize: vertical; min-height: 70px; border-radius: 2px; }
  .notes-input:focus { border-color: var(--rose-dim); }
  .btn { padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; width: 100%; margin-bottom: 10px; }
  .btn-primary { background: var(--rose); color: white; }
  .btn-primary:hover { background: #d4506a; }
  .btn-primary:disabled { background: var(--border2); color: var(--dim); cursor: not-allowed; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); }
  .success-wrap { text-align: center; padding: 40px 0; }
  .success-wrap h2 { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: var(--text); margin-bottom: 12px; }
  .error { font-size: 13px; color: #e87a7a; margin-top: 12px; text-align: center; }
  .info-box { background: #200e18; border: 1px solid var(--rose-dim); padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: var(--rose-lt); line-height: 1.7; }
`;

export default function Reschedule() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (!id) { setError("Invalid link."); setLoading(false); return; }
    Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}&select=*`, { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/availability?select=*`, { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/bookings?select=date,time&status=neq.cancelled`, { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }).then(r => r.json()),
    ]).then(([bookings, avail, booked]) => {
      if (bookings.length) setBooking(bookings[0]);
      else setError("Booking not found.");
      setAvailability(avail);
      setBookedSlots(booked);
      setLoading(false);
    }).catch(() => { setError("Could not load booking."); setLoading(false); });
  }, []);

  function getAvailableTimes(year, month, day) {
    const dateStr = `${MONTHS[month]} ${day}, ${year}`;
    const allTimes = availability.filter(a => a.date === dateStr).map(a => a.time);
    return allTimes.filter(t => !bookedSlots.some(b => b.date === dateStr && b.time === t));
  }

  function isAvailableDay(year, month, day) {
    const dateStr = `${MONTHS[month]} ${day}, ${year}`;
    const times = availability.filter(a => a.date === dateStr).map(a => a.time);
    return times.some(t => !bookedSlots.some(b => b.date === dateStr && b.time === t));
  }

  function isPast(day) {
    const selected = new Date(calYear, calMonth, day);
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return selected < tomorrow;
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  async function handleSubmit() {
    if (!selectedDay || !selectedTime) return;
    setSubmitting(true);
    const newDate = `${MONTHS[calMonth]} ${selectedDay}, ${calYear}`;
    try {
      const res = await fetch("/api/request-reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newDate, newTime: selectedTime, notes }),
      });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please contact us.");
    } catch { setError("Something went wrong. Please contact us."); }
    finally { setSubmitting(false); }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <span className="header-sparkle">✦ ✦ ✦</span>
          <h1><span>Acrylic</span> Faerie</h1>
          <p className="header-sub">Request a Reschedule</p>
        </div>

        <div className="container">
          {loading && <p style={{textAlign:"center",color:"var(--muted)"}}>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {submitted && (
            <div className="success-wrap">
              <span style={{fontSize:40,display:"block",marginBottom:20}}>💕</span>
              <h2>Request Sent!</h2>
              <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.8}}>
                Angie has received your reschedule request for<br/>
                <strong style={{color:"var(--rose-lt)"}}>{`${MONTHS[calMonth]} ${selectedDay}, ${calYear}`} at {selectedTime}</strong><br/><br/>
                She'll confirm your new time shortly. Your current appointment remains active until then!
              </p>
            </div>
          )}

          {!loading && !error && !submitted && booking && (
            <>
              <div className="booking-summary">
                <span className="summary-label">Your Current Appointment</span>
                <div className="summary-row"><span className="summary-key">Name</span><span className="summary-val">{booking.client_name}</span></div>
                <div className="summary-row"><span className="summary-key">Service</span><span className="summary-val">{booking.service}</span></div>
                <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{booking.date}</span></div>
                <div className="summary-row"><span className="summary-key">Time</span><span className="summary-val">{booking.time}</span></div>
              </div>

              <div className="info-box">
                ✦ Select a new date and time below. Only available slots are shown. Angie will review and confirm your request — your current appointment stays active until she approves the change.
              </div>

              <h3 className="section-title">Pick a New Date</h3>
              <div className="cal-box">
                <div className="cal-header">
                  <button className="cal-nav" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); setSelectedDay(null); setSelectedTime(null); }}>‹</button>
                  <h3>{MONTHS[calMonth]} {calYear}</h3>
                  <button className="cal-nav" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); setSelectedDay(null); setSelectedTime(null); }}>›</button>
                </div>
                <div className="cal-grid">
                  {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
                  {calDays.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const avail = !isPast(day) && isAvailableDay(calYear, calMonth, day);
                    const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                    return (
                      <div key={i}
                        className={`cal-day ${avail ? "available" : ""} ${selectedDay === day ? "selected" : ""} ${isToday ? "today" : ""}`}
                        style={{ opacity: !avail && !selectedDay === day ? 0.25 : 1 }}
                        onClick={() => { if (avail) { setSelectedDay(day); setSelectedTime(null); } }}
                      >{day}</div>
                    );
                  })}
                </div>
              </div>

              {selectedDay && (
                <>
                  <h3 className="section-title">Pick a Time</h3>
                  <div className="times-grid">
                    {getAvailableTimes(calYear, calMonth, selectedDay).map(t => (
                      <div key={t} className={`time-slot ${selectedTime === t ? "selected" : ""}`} onClick={() => setSelectedTime(t)}>{t}</div>
                    ))}
                  </div>
                </>
              )}

              {selectedDay && selectedTime && (
                <>
                  <div className="notes-field">
                    <label className="notes-label">Message to Angie (optional)</label>
                    <textarea className="notes-input" placeholder="Any notes about your reschedule request..." value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
                    {submitting ? "Sending Request..." : `Request ${MONTHS[calMonth]} ${selectedDay} at ${selectedTime} ✦`}
                  </button>
                </>
              )}

              <a href="/" className="btn btn-ghost" style={{display:"block",textDecoration:"none",textAlign:"center"}}>Back to Booking</a>
              {error && <p className="error">{error}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
