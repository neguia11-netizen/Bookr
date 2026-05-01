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
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return await res.json();
}

async function deleteBooking(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
    method: "DELETE",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Failed to delete");
}

async function fetchBlockedDates() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blocked_dates?select=*`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Failed to fetch blocked dates");
  return await res.json();
}

async function blockDate(date, reason) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blocked_dates`, {
    method: "POST",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ date, reason }),
  });
  if (!res.ok) throw new Error("Failed to block date");
}

async function unblockDate(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blocked_dates?id=eq.${id}`, {
    method: "DELETE",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Failed to unblock date");
}

async function fetchAvailability() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/availability?select=*&order=date.asc,time.asc`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Failed to fetch availability");
  return await res.json();
}

async function addAvailability(date, time) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/availability`, {
    method: "POST",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ date, time }),
  });
  if (!res.ok) throw new Error("Failed to add availability");
}

async function removeAvailability(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/availability?id=eq.${id}`, {
    method: "DELETE",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Failed to remove availability");
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

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: radial-gradient(ellipse at 50% 0%, #2a0e1a 0%, var(--bg) 60%); }
  .login-card { background: var(--bg2); border: 1px solid var(--border2); padding: 40px 36px; max-width: 360px; width: 100%; position: relative; }
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
  .btn-primary:disabled { background: var(--border2); color: var(--dim); cursor: not-allowed; }
  .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--muted); width: auto; padding: 8px 20px; font-size: 10px; }
  .btn-ghost:hover { border-color: var(--rose-dim); color: var(--rose-lt); }
  .btn-sm { padding: 8px 18px; font-size: 10px; letter-spacing: 2px; width: auto; }
  .btn-danger { background: none; border: 1px solid #7a2828; color: #e87a7a; font-size: 10px; letter-spacing: 1px; padding: 6px 14px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; border-radius: 2px; }
  .btn-danger:hover { background: #2a0e0e; }

  .header { display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; border-bottom: 1px solid var(--border); background: var(--bg2); flex-wrap: wrap; gap: 12px; }
  .header-left h1 { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; }
  .header-left h1 span { color: var(--rose-lt); }
  .header-left p { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); margin-top: 2px; }
  .header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .stats { display: flex; gap: 16px; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--rose-lt); }
  .stat-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); }

  .main { display: grid; grid-template-columns: 1fr 360px; gap: 0; min-height: calc(100vh - 70px); }
  @media (max-width: 900px) { .main { grid-template-columns: 1fr; } }

  .cal-panel { padding: 24px; border-right: 1px solid var(--border); }
  .cal-nav-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .cal-nav-row h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; }
  .cal-nav-btn { background: none; border: 1px solid var(--border2); color: var(--muted); width: 32px; height: 32px; cursor: pointer; font-size: 16px; transition: all 0.2s; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cal-nav-btn:hover { border-color: var(--rose); color: var(--rose-lt); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .cal-day-name { text-align: center; font-size: 9px; letter-spacing: 2px; color: var(--dim); text-transform: uppercase; padding: 6px 0 12px; }
  .cal-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 13px; border-radius: 4px; border: 1px solid transparent; cursor: pointer; transition: all 0.15s; color: var(--dim); position: relative; gap: 3px; }
  .cal-day.current { color: var(--text); }
  .cal-day.today { border-color: var(--rose-dim); }
  .cal-day.has-booking { background: #200e18; border-color: var(--rose-dim); color: var(--rose-lt); }
  .cal-day.has-booking:hover { background: #2a1020; border-color: var(--rose); }
  .cal-day.selected { background: var(--rose); color: white; border-color: var(--rose); box-shadow: 0 0 14px #c4415a55; }
  .cal-day.selected .booking-dots { display: none; }
  .booking-dots { display: flex; gap: 2px; }
  .booking-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--rose); }
  .booking-dot.paid { background: var(--green); }

  .sidebar { background: var(--bg2); border-left: 1px solid var(--border); overflow-y: auto; }
  .sidebar-header { padding: 18px 20px; border-bottom: 1px solid var(--border); }
  .sidebar-header h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; }
  .sidebar-header p { font-size: 11px; color: var(--dim); margin-top: 2px; letter-spacing: 1px; }
  .sidebar-empty { padding: 40px 20px; text-align: center; color: var(--dim); font-size: 13px; letter-spacing: 1px; }

  .booking-card { padding: 16px 20px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
  .booking-card:hover { background: var(--bg3); }
  .booking-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .booking-time { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--rose-lt); }
  .booking-status { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; padding: 3px 8px; border-radius: 20px; }
  .booking-status.paid { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
  .booking-status.pending { background: var(--amber-dim); color: var(--amber); border: 1px solid var(--amber); }
  .booking-service { font-size: 13px; color: var(--text); margin-bottom: 8px; font-weight: 400; }
  .booking-info { font-size: 12px; color: var(--muted); line-height: 1.8; }
  .booking-info span { display: block; }
  .booking-actions { margin-top: 12px; display: flex; justify-content: flex-end; }

  .inspo-section { margin-top: 12px; }
  .inspo-section-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--rose); margin-bottom: 8px; }
  .inspo-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .inspo-thumb { width: 72px; height: 72px; object-fit: cover; border: 1px solid var(--border2); border-radius: 2px; cursor: pointer; transition: border-color 0.2s; }
  .inspo-thumb:hover { border-color: var(--rose); }

  .inspo-lightbox { position: fixed; inset: 0; z-index: 300; background: rgba(10,5,8,0.97); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .inspo-lightbox img { max-width: 90vw; max-height: 85vh; object-fit: contain; border: 1px solid var(--border2); }
  .inspo-lightbox-close { position: fixed; top: 20px; right: 24px; background: none; border: 1px solid var(--border2); color: var(--muted); font-size: 20px; width: 40px; height: 40px; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .inspo-lightbox-close:hover { border-color: var(--rose); color: var(--rose-lt); }

  .list-panel { padding: 24px; }
  .list-title { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin-bottom: 16px; }
  .list-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .list-table th { text-align: left; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); padding: 8px 12px; border-bottom: 1px solid var(--border); }
  .list-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--muted); vertical-align: top; }
  .list-table tr:hover td { background: var(--bg3); }
  .list-table td.name { color: var(--text); font-weight: 400; }

  .tab-row { display: flex; gap: 0; margin-bottom: 0; border-bottom: 1px solid var(--border); }
  .tab { padding: 10px 20px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; font-family: 'DM Sans', sans-serif; }
  .tab.active { color: var(--rose-lt); border-bottom-color: var(--rose); }
  .tab:hover { color: var(--muted); }
  .loading { text-align: center; padding: 60px; color: var(--dim); font-size: 13px; letter-spacing: 2px; }

  .block-panel { padding: 24px; }
  .block-title { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin-bottom: 16px; }
  .block-form { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; align-items: flex-end; }
  .block-input { background: var(--bg); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 10px 14px; outline: none; transition: border-color 0.2s; flex: 1; min-width: 140px; }
  .block-input:focus { border-color: var(--rose-dim); }
  .blocked-list { display: flex; flex-direction: column; gap: 6px; }
  .blocked-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg2); border: 1px solid var(--border); font-size: 13px; }
  .blocked-date { color: var(--rose-lt); font-family: 'Playfair Display', serif; font-style: italic; }
  .blocked-reason { color: var(--muted); font-size: 12px; }


  .loyalty-panel { padding: 24px; }
  .loyalty-title { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin-bottom: 16px; }
  .loyalty-grid { display: grid; gap: 3px; }
  .loyalty-card { background: var(--bg2); border: 1px solid var(--border); padding: 16px 20px; display: flex; align-items: center; gap: 16px; transition: background 0.15s; }
  .loyalty-card:hover { background: var(--bg3); }
  .loyalty-info { flex: 1; }
  .loyalty-name { font-size: 14px; color: var(--text); font-weight: 400; margin-bottom: 2px; }
  .loyalty-email { font-size: 11px; color: var(--dim); letter-spacing: 0.5px; }
  .loyalty-progress-wrap { flex: 1; }
  .loyalty-progress-bar { height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 6px; overflow: hidden; }
  .loyalty-progress-fill { height: 100%; background: linear-gradient(90deg, var(--rose-dim), var(--rose)); border-radius: 2px; transition: width 0.3s; }
  .loyalty-progress-text { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .loyalty-badge { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
  .loyalty-badge.earned { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
  .loyalty-badge.progress { background: var(--amber-dim); color: var(--amber); border: 1px solid var(--amber); }
  .loyalty-stats { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
  .loyalty-stat { background: var(--bg2); border: 1px solid var(--border); padding: 16px 20px; flex: 1; min-width: 120px; }
  .loyalty-stat-num { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--rose-lt); }
  .loyalty-stat-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--dim); margin-top: 4px; }
  .send-reward-btn { background: none; border: 1px solid var(--rose-dim); color: var(--rose-lt); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 6px 12px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; border-radius: 2px; white-space: nowrap; }
  .send-reward-btn:hover { background: var(--rose); color: white; border-color: var(--rose); }
  .send-reward-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .avail-panel { padding: 24px; }
  .avail-title { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin-bottom: 16px; }
  .avail-form { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; align-items: flex-end; }
  .time-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .time-chip { padding: 6px 12px; border: 1px solid var(--border2); background: var(--bg); font-size: 11px; letter-spacing: 1px; color: var(--muted); cursor: pointer; transition: all 0.15s; border-radius: 2px; }
  .time-chip:hover { border-color: var(--rose-dim); color: var(--rose-lt); }
  .time-chip.selected { background: #200e18; border-color: var(--rose); color: var(--rose-lt); }
  .avail-date-group { margin-bottom: 20px; background: var(--bg2); border: 1px solid var(--border); }
  .avail-date-header { padding: 12px 16px; border-bottom: 1px solid var(--border); font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; color: var(--rose-lt); display: flex; justify-content: space-between; align-items: center; }
  .avail-times { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 16px; }
  .avail-time-tag { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--bg3); border: 1px solid var(--border2); font-size: 12px; color: var(--text); }
  .avail-time-remove { background: none; border: none; color: var(--rose-dim); cursor: pointer; font-size: 14px; padding: 0 2px; transition: color 0.15s; }
  .avail-time-remove:hover { color: var(--rose); }
  .month-nav { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .month-nav h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; }
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
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockDateInput, setBlockDateInput] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [availDateInput, setAvailDateInput] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [savingAvail, setSavingAvail] = useState(false);
  const [availMonth, setAvailMonth] = useState(new Date().getMonth());
  const [availYear, setAvailYear] = useState(new Date().getFullYear());
  const [sendingReminders, setSendingReminders] = useState(false);
  const [reminderResult, setReminderResult] = useState(null);
  const [sendingRebooking, setSendingRebooking] = useState(false);
  const [rebookingResult, setRebookingResult] = useState(null);
  const [inspoLightbox, setInspoLightbox] = useState(null);
  const [clients, setClients] = useState([]);
  const [sendingReward, setSendingReward] = useState(null);
  const [rewardResult, setRewardResult] = useState({});

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); loadBookings(); }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000); }
  }

  async function loadBookings() {
    setLoading(true);
    try {
      const [data, blocked, avail, clientsData] = await Promise.all([
        fetchBookings(), fetchBlockedDates(), fetchAvailability(),
        fetch(`${SUPABASE_URL}/rest/v1/clients?select=*&order=booking_count.desc`, {
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        }).then(r => r.json()).catch(() => [])
      ]);
      setBookings(data);
      setBlockedDates(blocked);
      setAvailability(avail);
      setClients(clientsData);
    } catch { }
    finally { setLoading(false); }
  }

  async function handleSendReward(client) {
    setSendingReward(client.id);
    try {
      const res = await fetch("/api/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: client.email,
          name: client.email.split("@")[0],
          secret: "faerie-loyalty-2024",
          forceReward: true,
        }),
      });
      const data = await res.json();
      setRewardResult(prev => ({ ...prev, [client.id]: "✓ Reward sent!" }));
      setTimeout(() => setRewardResult(prev => ({ ...prev, [client.id]: null })), 3000);
    } catch {
      setRewardResult(prev => ({ ...prev, [client.id]: "Failed" }));
    } finally {
      setSendingReward(null);
    }
  }

  async function handleDelete(id) {
    await deleteBooking(id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setConfirmDelete(null);
  }

  const TIME_OPTIONS = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM"];

  async function handleBlockDate() {
    if (!blockDateInput) return;
    setBlocking(true);
    try {
      await blockDate(blockDateInput, blockReason);
      const blocked = await fetchBlockedDates();
      setBlockedDates(blocked);
      setBlockDateInput("");
      setBlockReason("");
    } catch { }
    finally { setBlocking(false); }
  }

  async function handleUnblock(id) {
    await unblockDate(id);
    setBlockedDates(prev => prev.filter(b => b.id !== id));
  }

  async function handleAddAvailability() {
    if (!availDateInput || selectedTimes.length === 0) return;
    setSavingAvail(true);
    const d = new Date(availDateInput + "T12:00:00");
    const dateStr = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    try {
      await Promise.all(selectedTimes.map(t => addAvailability(dateStr, t)));
      const avail = await fetchAvailability();
      setAvailability(avail);
      setAvailDateInput("");
      setSelectedTimes([]);
    } catch { }
    finally { setSavingAvail(false); }
  }

  async function handleRemoveAvailability(id) {
    await removeAvailability(id);
    setAvailability(prev => prev.filter(a => a.id !== id));
  }

  function toggleTime(t) {
    setSelectedTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function availForMonth(month, year) {
    const grouped = {};
    availability.forEach(a => {
      const d = new Date(a.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        if (!grouped[a.date]) grouped[a.date] = [];
        grouped[a.date].push(a);
      }
    });
    return Object.entries(grouped).sort((x, y) => new Date(x[0]) - new Date(y[0]));
  }

  async function handleSendRebooking() {
    setSendingRebooking(true);
    setRebookingResult(null);
    try {
      const res = await fetch("/api/send-rebooking?secret=faerie-rebooking-2024");
      const data = await res.json();
      setRebookingResult(data.message || "Done!");
    } catch {
      setRebookingResult("Something went wrong. Try again.");
    } finally {
      setSendingRebooking(false);
    }
  }

  async function handleSendReminders() {
    setSendingReminders(true);
    setReminderResult(null);
    try {
      const res = await fetch("/api/send-reminders?secret=faerie-reminders-2024");
      const data = await res.json();
      setReminderResult(data.message || "Done!");
    } catch {
      setReminderResult("Something went wrong. Try again.");
    } finally {
      setSendingReminders(false);
    }
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

  function getInspoUrls(booking) {
    if (!booking.inspo_url) return [];
    return booking.inspo_url.split(',').filter(Boolean);
  }

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
      {inspoLightbox && (
        <div className="inspo-lightbox" onClick={() => setInspoLightbox(null)}>
          <img src={inspoLightbox} alt="Inspo" onClick={e => e.stopPropagation()} />
          <button className="inspo-lightbox-close" onClick={() => setInspoLightbox(null)}>✕</button>
        </div>
      )}
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
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <button className="btn btn-primary btn-sm" disabled={sendingReminders} onClick={handleSendReminders}>
                {sendingReminders ? "Sending..." : "📱 Send Tomorrow's Reminders"}
              </button>
              {reminderResult && <span style={{fontSize:11,color:"var(--rose-lt)",letterSpacing:1}}>{reminderResult}</span>}
              <button className="btn btn-primary btn-sm" disabled={sendingRebooking} onClick={handleSendRebooking} style={{background:"var(--green,#4a9a6a)"}}>
                {sendingRebooking ? "Sending..." : "💌 Send Rebooking Reminders"}
              </button>
              {rebookingResult && <span style={{fontSize:11,color:"var(--rose-lt)",letterSpacing:1}}>{rebookingResult}</span>}
            </div>
          </div>
        </div>

        <div style={{padding:"0 28px", borderBottom:"1px solid var(--border)", background:"var(--bg2)"}}>
          <div className="tab-row">
            <button className={`tab ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>Calendar</button>
            <button className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>All Bookings</button>
            <button className={`tab ${tab === "availability" ? "active" : ""}`} onClick={() => setTab("availability")}>Availability</button>
            <button className={`tab ${tab === "blocked" ? "active" : ""}`} onClick={() => setTab("blocked")}>Block Dates</button>
            <button className={`tab ${tab === "loyalty" ? "active" : ""}`} onClick={() => setTab("loyalty")}>Loyalty</button>
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}

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
              {selectedBookings.map(b => {
                const inspoUrls = getInspoUrls(b);
                return (
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
                    {inspoUrls.length > 0 && (
                      <div className="inspo-section">
                        <div className="inspo-section-label">Inspo Photo{inspoUrls.length > 1 ? "s" : ""}</div>
                        <div className="inspo-grid">
                          {inspoUrls.map((url, i) => (
                            <img key={i} src={url} alt={`Inspo ${i+1}`} className="inspo-thumb" onClick={() => setInspoLightbox(url)} />
                          ))}
                        </div>
                      </div>
                    )}
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
                );
              })}
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
                  <th>Inspo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr><td colSpan={8} style={{textAlign:"center",padding:40,color:"var(--dim)"}}>No bookings yet</td></tr>
                )}
                {bookings.map(b => {
                  const inspoUrls = getInspoUrls(b);
                  return (
                    <tr key={b.id}>
                      <td className="name">{b.client_name}</td>
                      <td>{b.service}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td><span className={`booking-status ${b.status}`}>{b.status}</span></td>
                      <td>{b.client_email}<br/>{b.client_phone}</td>
                      <td>
                        {inspoUrls.length > 0 ? (
                          <div style={{display:"flex",gap:4}}>
                            {inspoUrls.map((url, i) => (
                              <img key={i} src={url} alt={`Inspo ${i+1}`} style={{width:40,height:40,objectFit:"cover",border:"1px solid var(--border2)",borderRadius:2,cursor:"pointer"}} onClick={() => setInspoLightbox(url)} />
                            ))}
                          </div>
                        ) : <span style={{color:"var(--dim)"}}>—</span>}
                      </td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === "availability" && (
          <div className="avail-panel">
            <h3 className="avail-title">Manage Availability</h3>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:24,letterSpacing:0.5,lineHeight:1.7}}>
              Add dates and times that clients can book. Changes appear on the booking site immediately.
            </p>
            <div style={{background:"var(--bg2)",border:"1px solid var(--border)",padding:"20px 24px",marginBottom:28}}>
              <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"var(--rose)",marginBottom:16}}>Add New Availability</div>
              <div className="avail-form">
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Date</label>
                  <input type="date" className="block-input" value={availDateInput} onChange={e => setAvailDateInput(e.target.value)} />
                </div>
              </div>
              <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:8}}>Select Times</div>
              <div className="time-chips">
                {TIME_OPTIONS.map(t => (
                  <div key={t} className={`time-chip ${selectedTimes.includes(t) ? "selected" : ""}`} onClick={() => toggleTime(t)}>{t}</div>
                ))}
              </div>
              <div style={{marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:"var(--muted)"}}>{selectedTimes.length} time{selectedTimes.length !== 1 ? "s" : ""} selected</span>
                <button className="btn btn-primary btn-sm" disabled={!availDateInput || selectedTimes.length === 0 || savingAvail} onClick={handleAddAvailability}>
                  {savingAvail ? "Saving..." : "Add Availability ✦"}
                </button>
              </div>
            </div>
            <div className="month-nav">
              <button className="cal-nav-btn" onClick={() => { if (availMonth === 0) { setAvailMonth(11); setAvailYear(y => y-1); } else setAvailMonth(m => m-1); }}>‹</button>
              <h3>{MONTHS[availMonth]} {availYear}</h3>
              <button className="cal-nav-btn" onClick={() => { if (availMonth === 11) { setAvailMonth(0); setAvailYear(y => y+1); } else setAvailMonth(m => m+1); }}>›</button>
            </div>
            {availForMonth(availMonth, availYear).length === 0 && (
              <p style={{fontSize:13,color:"var(--dim)",letterSpacing:1}}>No availability set for {MONTHS[availMonth]} {availYear}.</p>
            )}
            {availForMonth(availMonth, availYear).map(([date, slots]) => (
              <div key={date} className="avail-date-group">
                <div className="avail-date-header">
                  <span>{date}</span>
                  <span style={{fontSize:11,color:"var(--dim)"}}>{slots.length} slot{slots.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="avail-times">
                  {slots.sort((a,b) => a.time.localeCompare(b.time)).map(s => (
                    <div key={s.id} className="avail-time-tag">
                      {s.time}
                      <button className="avail-time-remove" onClick={() => handleRemoveAvailability(s.id)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


        {!loading && tab === "loyalty" && (
          <div className="loyalty-panel">
            <h3 className="loyalty-title">Loyalty Program</h3>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:24,letterSpacing:0.5,lineHeight:1.7}}>
              Clients earn a reward after every 5 paid bookings — 20% off their next set + one free upgrade.
            </p>

            <div className="loyalty-stats">
              <div className="loyalty-stat">
                <div className="loyalty-stat-num">{clients.length}</div>
                <div className="loyalty-stat-label">Total Clients</div>
              </div>
              <div className="loyalty-stat">
                <div className="loyalty-stat-num">{clients.filter(c => c.booking_count >= 5).length}</div>
                <div className="loyalty-stat-label">Earned Reward</div>
              </div>
              <div className="loyalty-stat">
                <div className="loyalty-stat-num">{clients.reduce((acc, c) => acc + (c.loyalty_emails_sent || 0), 0)}</div>
                <div className="loyalty-stat-label">Rewards Sent</div>
              </div>
              <div className="loyalty-stat">
                <div className="loyalty-stat-num">{clients.filter(c => (c.booking_count % 5) === 4).length}</div>
                <div className="loyalty-stat-label">1 Away from Reward</div>
              </div>
            </div>

            {clients.length === 0 && <p style={{fontSize:13,color:"var(--dim)",letterSpacing:1}}>No clients yet — bookings will appear here after the first paid appointment.</p>}

            <div className="loyalty-grid">
              {clients.map(c => {
                const progress = c.booking_count % 5;
                const rewardsEarned = Math.floor(c.booking_count / 5);
                const nextRewardIn = 5 - progress;
                return (
                  <div key={c.id} className="loyalty-card">
                    <div className="loyalty-info">
                      <div className="loyalty-name">{c.email.split("@")[0]}</div>
                      <div className="loyalty-email">{c.email}</div>
                    </div>
                    <div className="loyalty-progress-wrap">
                      <div className="loyalty-progress-bar">
                        <div className="loyalty-progress-fill" style={{width:`${(progress / 5) * 100}%`}} />
                      </div>
                      <div className="loyalty-progress-text">
                        {c.booking_count} booking{c.booking_count !== 1 ? "s" : ""} · {nextRewardIn === 5 ? "Reward earned! 🎉" : `${nextRewardIn} until reward`}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                      {rewardsEarned > 0 && (
                        <span className="loyalty-badge earned">{rewardsEarned} reward{rewardsEarned !== 1 ? "s" : ""} earned</span>
                      )}
                      {progress > 0 && rewardsEarned === 0 && (
                        <span className="loyalty-badge progress">{progress}/5</span>
                      )}
                      <button
                        className="send-reward-btn"
                        disabled={sendingReward === c.id}
                        onClick={() => handleSendReward(c)}
                      >
                        {rewardResult[c.id] || (sendingReward === c.id ? "Sending..." : "Send Reward")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && tab === "blocked" && (
          <div className="block-panel">
            <h3 className="block-title">Block Off Dates</h3>
            <p style={{fontSize:12,color:"var(--muted)",marginBottom:20,letterSpacing:0.5,lineHeight:1.7}}>
              Blocked dates will be grayed out on the booking calendar — clients won't be able to select them.
            </p>
            <div className="block-form">
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Date</label>
                <input type="date" className="block-input" value={blockDateInput} onChange={e => setBlockDateInput(e.target.value)} />
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
                <label style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Reason (optional)</label>
                <input type="text" className="block-input" placeholder="e.g. Vacation, Personal" value={blockReason} onChange={e => setBlockReason(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-sm" disabled={!blockDateInput || blocking} onClick={handleBlockDate}>
                {blocking ? "Blocking..." : "Block Date ✦"}
              </button>
            </div>
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"var(--rose)",marginBottom:12}}>
              Currently Blocked — {blockedDates.length} date{blockedDates.length !== 1 ? "s" : ""}
            </div>
            {blockedDates.length === 0 && <p style={{fontSize:13,color:"var(--dim)",letterSpacing:1}}>No dates blocked yet.</p>}
            <div className="blocked-list">
              {blockedDates.sort((a,b) => new Date(a.date) - new Date(b.date)).map(b => (
                <div key={b.id} className="blocked-item">
                  <div>
                    <div className="blocked-date">{b.date}</div>
                    {b.reason && <div className="blocked-reason">{b.reason}</div>}
                  </div>
                  <button className="btn-danger" onClick={() => handleUnblock(b.id)}>Unblock</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
