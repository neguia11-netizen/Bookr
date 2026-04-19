import { useState, useEffect } from "react";

const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";
const ADMIN_PASSWORD = "faerie2024";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

async function fetchBookings() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=date.asc,time.asc`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    }
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return await res.json();
}

async function deleteBooking(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    }
  });
  if (!res.ok) throw new Error("Failed to delete");
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #0f0a0c; --bg2: #1a1015; --bg3: #221520;
    --border: #3a1f2e; --border2: #4d2a3d;
    --rose: #c4415a; --rose-lt: #e8839a; --rose-dim: #7a2840;
    --text: #f5e8ee; --muted: #9a7080; --dim: #5a3a48;
    --green: #4a9a6a; --green-dim: #1a3a2a;
    --amber: #c4854a; --amber-dim: #3a2010;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }
  .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; }

  /* LOGIN */
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;
    background: radial-gradient(ellipse at 50% 0%, #2a0e1a 0%, var(--bg) 60%);
  }
  .login-card {
    background: var(--bg2); border: 1px solid var(--border2);
    padding: 40px 36px; max-width: 360px; width: 100%;
    position: relative;
  }
  .login-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--rose-dim), var(--rose), var(--rose-dim)); }
  .login-sparkle { font-size: 13px; letter-spacing: 6px; color: var(--rose); margin-bottom: 20px; display: block; text-align: center; }
  .login-title { font-family: 'Playfair Display', serif; font-size: 26px; font-style: italic; text-align: center; margin-bottom: 6px; }
  .login-sub { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); text-align: center; margin-bottom: 28px; }
  .login-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; }
  .login-input { width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 14px; outline: none; transition: border-color 0.2s; margin-bottom: 20px; }
  .login-input:focus { border-color: var(--rose-dim); }
  .login-error { font-size: 12px; color: #e87a7a; text-align: center; margin-bottom: 14px; }
  .btn { padding: 13px 32px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 500; border: none; border-radius: 2px; width: 100%; }
  .btn-primary { background: var(--rose); color: white; box-shadow: 0 4px 20px #c4415a44; }
  .btn-primary:hover { background: #d4506a; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); width: auto; padding: 8px 20px; font-size: 10px; }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }
  .btn-danger { background: none; border: 1px solid #7a2828; color: #e87a7a; font-size: 10px; letter-spacing: 1px; padding: 6px 14px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; border-radius: 2px; }
  .btn-danger:hover { background: #2a0e0e; }

  /* HEADER */
  .header { display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; border-bottom: 1px solid var(--border); background: var(--bg2); flex-wrap: wrap; gap: 12px; }
  .header-left h1 { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; }
  .header-left h1 span { color: var(--rose-lt); }
  .header-left p { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); margin-top: 2px; }
  .header-right { display: flex; align-items: center; gap: 12px; }
  .stats { display: flex; gap: 16px; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--rose-lt); }
  .stat-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); }

  /* MAIN LAYOUT */
  .main { display: grid; grid-template-columns: 1fr 340px; gap: 0; min-height: calc(100vh - 70px); }
  @media (max-width: 900px) { .main { grid-template-columns: 1fr; } }

  /* CALENDAR */
  .cal-panel { padding: 24px; border-right: 1px solid var(--border); }
  .cal-nav-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .cal-nav-row h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; }
  .cal-nav-btn { background: none; border: 1px solid var(--border2); color: var(--muted); width: 32px; height: 32px; cursor: pointer; font-size: 16px; transition: all 0.2s; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cal-nav-btn:hover { border-color: var(--rose); color: var(--rose-lt); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .cal-day-name { text-align: center; font-size: 9px; letter-spacing: 2px; color: var(--dim); text-transform: uppercase; padding: 6px 0 12px; }
  .cal-day {
    aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-size: 13px; border-radius: 4px; border: 1px solid transparent;
    cursor: pointer; transition: all 0.15s; color: var(--dim); position: relative;
    gap: 3px;
  }
  .cal-day.current { color: var(--text); }
  .cal-day.today { border-color: var(--rose-dim); }
  .cal-day.has-booking { background: #200e18; border-color: var(--rose-dim); color: var(--rose-lt); }
  .cal-day.has-booking:hover { background: #2a1020; border-color: var(--rose); }
  .cal-day.selected { background: var(--rose); color: white; border-color: var(--rose); box-shadow: 0 0 14px #c4415a55; }
  .cal-day.selected .booking-dots { display: none; }
  .booking-dots { display: flex; gap: 2px; }
  .booking-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--rose); }
  .booking-dot.paid { background: var(--green); }

  /* SIDEBAR */
  .sidebar { background: var(--bg2); border-left: 1px solid var(--border); }
  .sidebar-header { padding: 18px 20px; border-bottom: 1px solid var(--border); }
  .sidebar-header h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; }
  .sidebar-header p { font-size: 11px; color: var(--dim); margin-top: 2px; letter-spacing: 1px; }
  .sidebar-empty { padding: 40px 20px; text-align: center; color: var(--dim); font-size: 13px; letter-spacing: 1px; }

  .booking-card {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .booking-card:hover { background: var(--bg3); }
  .booking-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .booking-time { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--rose-lt); }
  .booking-status {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 8px; border-radius: 20px;
  }
  .booking-status.paid { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
  .booking-status.pending { background: var(--amber-dim); color: var(--amber); border: 1px solid var(--amber); }
  .booking-service { font-size: 13px; color: var(--text); margin-bottom: 8px; font-weight: 400; }
  .booking-info { font-size: 12px; color: var(--muted); line-height: 1.8; }
  .booking-info span { display: block; }
  .booking-actions { margin-top: 12px; display: flex; justify-content: flex-end; }

  /* ALL BOOKINGS LIST */
  .list-panel { padding: 24px; }
  .list-title { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin-bottom: 16px; }
  .list-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .list-table th { text-align: left; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); padding: 8px 12px; border-bottom: 1px solid var(--border); }
  .list-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--muted); vertical-align: top; }
  .list-table tr:hover td { background: var(--bg3); }
  .list-table td.name { color: var(--text); font-weight: 400; }
  .tab-row { display: flex; gap: 0; margin-bottom: 24px; border-bottom: 1px solid var(--border); }
  .tab { padding: 10px 20px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; font-family: 'DM Sans', sans-serif; }
  .tab.active { color: var(--rose-lt); border-bottom-color: var(--rose); }
  .tab:hover { color: var(--muted); }
  .loading { text-align: center; padding: 60px; color: var(--dim); font-size: 13px; letter-spacing: 2px; }
`;

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tab, setTab] = useState("calendar");
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [confirmDelete, setConfirmDelete] = useState(null);

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); loadBookings(); }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000); }
  }

  async function loadBookings() {
    setLoading(true);
    try { const data = await fetchBookings(); setBookings(data); }
    catch { }
    finally { setLoading(false); }
  }

  async function handleDelete(id) {
    await deleteBooking(id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setConfirmDelete(null);
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  function bookingsForDay(day) {
    const dateStr = `${MONTHS[calMonth]} ${day}, ${calYear}`;
    return bookings.filter(b => b.date === dateStr);
  }

  const selectedBookings = selectedDay ? bookingsForDay(selectedDay) : [];
  const paidCount = bookings.filter(b => b.status === "paid").length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  if (!authed) return (
    <>
      <style>{styles}</style>
      <div className="login-wrap">
        <div className="login-card">
          <span className="login-sparkle">✦ ✦ ✦</span>
          <h2 className="login-title">Admin Access</h2>
          <p className="login-sub">Acrylic Faerie · Private</p>
          <label className="login-label">Password</label>
          <input className="login-input" type="password" placeholder="Enter password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()} autoFocus />
          {pwError && <p className="login-error">Incorrect password</p>}
          <button className="btn btn-primary" onClick={login}>Enter ✦</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="header">
          <div className="header-left">
            <h1><span>Acrylic</span> Faerie · Admin</h1>
            <p>Appointment Dashboard</p>
          </div>
          <div className="header-right">
            <div className="stats">
              <div className="stat"><div className="stat-num">{paidCount}</div><div className="stat-label">Confirmed</div></div>
              <div className="stat"><div className="stat-num">{pendingCount}</div><div className="stat-label">Pending</div></div>
              <div className="stat"><div className="stat-num">{bookings.length}</div><div className="stat-label">Total</div></div>
            </div>
            <button className="btn-ghost btn" onClick={loadBookings}>↻ Refresh</button>
          </div>
        </div>

        <div style={{padding:"0 28px", borderBottom:"1px solid var(--border)", background:"var(--bg2)"}}>
          <div className="tab-row">
            <button className={`tab ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>Calendar View</button>
            <button className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>All Bookings</button>
          </div>
        </div>

        {loading && <div className="loading">Loading bookings...</div>}

        {!loading && tab === "calendar" && (
          <div className="main">
            <div className="cal-panel">
              <div className="cal-nav-row">
                <button className="cal-nav-btn" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); setSelectedDay(null); }}>‹</button>
                <h2>{MONTHS[calMonth]} {calYear}</h2>
                <button className="cal-nav-btn" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); setSelectedDay(null); }}>›</button>
              </div>
              <div className="cal-grid">
                {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
                {calDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const dayBookings = bookingsForDay(day);
                  const hasBooking = dayBookings.length > 0;
                  const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  return (
                    <div key={i}
                      className={`cal-day current ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""} ${selectedDay === day ? "selected" : ""}`}
                      onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                    >
                      {day}
                      {hasBooking && (
                        <div className="booking-dots">
                          {dayBookings.slice(0, 3).map((b, j) => (
                            <div key={j} className={`booking-dot ${b.status === "paid" ? "paid" : ""}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:24, display:"flex", gap:16, fontSize:11, color:"var(--muted)", letterSpacing:1}}>
                <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",display:"inline-block"}} />Confirmed</span>
                <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:"var(--rose)",display:"inline-block"}} />Pending</span>
              </div>
            </div>

            <div className="sidebar">
              <div className="sidebar-header">
                <h3>{selectedDay ? `${MONTHS[calMonth]} ${selectedDay}` : "Select a Date"}</h3>
                <p>{selectedDay ? `${selectedBookings.length} appointment${selectedBookings.length !== 1 ? "s" : ""}` : "Click a day to see bookings"}</p>
              </div>
              {!selectedDay && <div className="sidebar-empty">← Click a highlighted date to view appointments</div>}
              {selectedDay && selectedBookings.length === 0 && <div className="sidebar-empty">No bookings on this day</div>}
              {selectedBookings.map(b => (
                <div key={b.id} className="booking-card">
                  <div className="booking-top">
                    <div className="booking-time">{b.time}</div>
                    <div className={`booking-status ${b.status}`}>{b.status}</div>
                  </div>
                  <div className="booking-service">{b.service}</div>
                  <div className="booking-info">
                    <span>👤 {b.client_name}</span>
                    <span>📧 {b.client_email}</span>
                    <span>📞 {b.client_phone}</span>
                    {b.notes && <span>📝 {b.notes}</span>}
                    {b.duration && <span>⏱ {b.duration}</span>}
                    {b.price && <span>💰 {b.price}</span>}
                  </div>
                  <div className="booking-actions">
                    {confirmDelete === b.id
                      ? <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <span style={{fontSize:11,color:"var(--muted)"}}>Sure?</span>
                          <button className="btn-danger" onClick={() => handleDelete(b.id)}>Yes, Delete</button>
                          <button className="btn-ghost btn" onClick={() => setConfirmDelete(null)}>No</button>
                        </div>
                      : <button className="btn-danger" onClick={() => setConfirmDelete(b.id)}>Cancel Booking</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === "list" && (
          <div className="list-panel">
            <h3 className="list-title">All Bookings</h3>
            <table className="list-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr><td colSpan={7} style={{textAlign:"center",padding:40,color:"var(--dim)"}}>No bookings yet</td></tr>
                )}
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="name">{b.client_name}</td>
                    <td>{b.service}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td><span className={`booking-status ${b.status}`}>{b.status}</span></td>
                    <td>{b.client_email}<br/>{b.client_phone}</td>
                    <td>
                      {confirmDelete === b.id
                        ? <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            <button className="btn-danger" onClick={() => handleDelete(b.id)}>Confirm</button>
                            <button className="btn-ghost btn" onClick={() => setConfirmDelete(null)}>No</button>
                          </div>
                        : <button className="btn-danger" onClick={() => setConfirmDelete(b.id)}>Cancel</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
