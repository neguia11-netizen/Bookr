import { useState } from "react";

const SERVICES = [
  { id: 1, category: "Nails", name: "Classic Manicure", duration: 45, price: 35, icon: "✦" },
  { id: 2, category: "Nails", name: "Gel Manicure", duration: 60, price: 55, icon: "✦" },
  { id: 3, category: "Nails", name: "Acrylic Full Set", duration: 90, price: 75, icon: "✦" },
  { id: 4, category: "Nails", name: "Nail Art (per nail)", duration: 15, price: 5, icon: "✦" },
  { id: 5, category: "Pedicure", name: "Classic Pedicure", duration: 60, price: 45, icon: "◈" },
  { id: 6, category: "Pedicure", name: "Gel Pedicure", duration: 75, price: 65, icon: "◈" },
  { id: 7, category: "Lashes", name: "Classic Lash Set", duration: 90, price: 85, icon: "◉" },
  { id: 8, category: "Lashes", name: "Volume Lash Set", duration: 120, price: 120, icon: "◉" },
  { id: 9, category: "Lashes", name: "Lash Fill", duration: 60, price: 65, icon: "◉" },
];

const TIMES = ["9:00 AM","9:45 AM","10:30 AM","11:15 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDay(year, month) { return new Date(year, month, 1).getDay(); }

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d0d0d; }
  .app { min-height: 100vh; background: #0d0d0d; color: #f0ebe3; font-family: 'Jost', sans-serif; font-weight: 300; }
  .header { text-align: center; padding: 52px 24px 36px; border-bottom: 1px solid #2a2a2a; }
  .header::before { content: '— ✦ —'; display: block; font-size: 11px; letter-spacing: 6px; color: #c9a97a; margin-bottom: 16px; }
  .header h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 7vw, 58px); font-weight: 300; letter-spacing: 4px; color: #f0ebe3; line-height: 1.1; }
  .header h1 em { font-style: italic; color: #c9a97a; }
  .header p { margin-top: 10px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #7a7068; }
  .steps { display: flex; justify-content: center; padding: 28px 24px; border-bottom: 1px solid #1e1e1e; flex-wrap: wrap; gap: 8px; }
  .step { display: flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #4a4540; cursor: pointer; transition: color 0.3s; padding: 0 16px; }
  .step:not(:last-child)::after { content: ''; display: inline-block; width: 24px; height: 1px; background: #2a2a2a; margin-left: 16px; }
  .step.active { color: #c9a97a; }
  .step.done { color: #7a7068; }
  .step-num { width: 22px; height: 22px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
  .container { max-width: 860px; margin: 0 auto; padding: 48px 24px; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #f0ebe3; margin-bottom: 8px; }
  .section-sub { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #5a534a; margin-bottom: 36px; }
  .category-label { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #c9a97a; margin: 28px 0 12px; }
  .services-grid { display: grid; gap: 2px; }
  .service-card { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; background: #141414; border: 1px solid #1e1e1e; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .service-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #c9a97a; transform: scaleY(0); transition: transform 0.3s; }
  .service-card:hover { background: #191919; }
  .service-card:hover::before { transform: scaleY(1); }
  .service-card.selected { background: #1c1812; border-color: #c9a97a44; }
  .service-card.selected::before { transform: scaleY(1); }
  .service-left { display: flex; align-items: center; gap: 14px; }
  .service-icon { color: #c9a97a; font-size: 14px; width: 20px; text-align: center; }
  .service-name { font-size: 14px; letter-spacing: 1px; }
  .service-dur { font-size: 11px; color: #5a534a; margin-top: 2px; }
  .service-price { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #c9a97a; }
  .check { width: 18px; height: 18px; border-radius: 50%; background: #c9a97a; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #0d0d0d; margin-left: 12px; }
  .calendar-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  @media (max-width: 600px) { .calendar-wrap { grid-template-columns: 1fr; } }
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .cal-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; letter-spacing: 1px; }
  .cal-nav { background: none; border: 1px solid #2a2a2a; color: #f0ebe3; width: 28px; height: 28px; cursor: pointer; font-size: 14px; transition: border-color 0.2s; }
  .cal-nav:hover { border-color: #c9a97a; color: #c9a97a; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-day-name { text-align: center; font-size: 9px; letter-spacing: 2px; color: #4a4540; text-transform: uppercase; padding: 4px 0 10px; }
  .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; color: #7a7068; }
  .cal-day.current-month { color: #f0ebe3; }
  .cal-day.today { border-color: #3a3530; }
  .cal-day:hover.current-month { background: #1e1e1e; }
  .cal-day.selected { background: #c9a97a; color: #0d0d0d; border-color: #c9a97a; }
  .times-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #5a534a; margin-bottom: 14px; }
  .times-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .time-slot { padding: 10px; border: 1px solid #1e1e1e; background: #141414; font-size: 12px; letter-spacing: 1px; text-align: center; cursor: pointer; transition: all 0.15s; color: #a09888; }
  .time-slot:hover { border-color: #3a3530; color: #f0ebe3; }
  .time-slot.selected { border-color: #c9a97a; background: #1c1812; color: #c9a97a; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #5a534a; }
  .form-input { background: #141414; border: 1px solid #1e1e1e; color: #f0ebe3; font-family: 'Jost', sans-serif; font-size: 14px; padding: 12px 14px; outline: none; transition: border-color 0.2s; font-weight: 300; }
  .form-input:focus { border-color: #c9a97a55; }
  .form-input::placeholder { color: #3a3530; }
  textarea.form-input { resize: vertical; min-height: 90px; }
  .summary-card { background: #141414; border: 1px solid #1e1e1e; padding: 28px; margin-bottom: 28px; }
  .summary-row { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-key { color: #7a7068; letter-spacing: 1px; }
  .summary-val { color: #f0ebe3; }
  .summary-total { display: flex; justify-content: space-between; align-items: baseline; padding-top: 20px; margin-top: 8px; border-top: 1px solid #2a2a2a; }
  .summary-total-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #5a534a; }
  .summary-total-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #c9a97a; }
  .btn-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 40px; }
  .btn { padding: 14px 36px; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; font-weight: 400; border: none; }
  .btn-primary { background: #c9a97a; color: #0d0d0d; }
  .btn-primary:hover { background: #d4b98a; }
  .btn-primary:disabled { background: #3a3530; color: #5a534a; cursor: not-allowed; }
  .btn-ghost { background: none; border: 1px solid #2a2a2a; color: #7a7068; }
  .btn-ghost:hover { border-color: #5a534a; color: #f0ebe3; }
  .success-wrap { text-align: center; padding: 60px 24px; }
  .success-icon { font-size: 40px; margin-bottom: 24px; color: #c9a97a; }
  .success-wrap h2 { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; letter-spacing: 2px; margin-bottom: 12px; }
  .success-wrap p { font-size: 13px; letter-spacing: 1px; color: #7a7068; line-height: 1.8; }
  .success-detail { display: inline-block; margin-top: 36px; padding: 24px 40px; border: 1px solid #2a2a2a; background: #141414; font-size: 12px; letter-spacing: 2px; color: #c9a97a; }
`;

export default function BeautyBooking() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const categories = [...new Set(SERVICES.map(s => s.category))];
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) calDays.push({ day: d, current: true });

  const isToday = (d) => d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
  const isPast = (d) => new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const canProceed = [
    !!selectedService,
    !!selectedDay && !!selectedTime,
    form.first && form.last && form.email && form.phone,
  ];

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <h1>Acrylic <em>Faerie</em></h1>
            <p>San Antonio · Beauty Studio</p>
          </div>
          <div className="container">
            <div className="success-wrap">
              <div className="success-icon">✦</div>
              <h2>You're All Set</h2>
              <p>Your appointment has been booked.<br />A confirmation will be sent to {form.email}.</p>
              <div className="success-detail">
                {selectedService?.name} · {MONTHS[calMonth]} {selectedDay}, {calYear} · {selectedTime}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <h1>Acrylic <em>Faerie</em></h1>
          <p>San Antonio · Beauty Studio</p>
        </div>
        <div className="steps">
          {["Service","Date & Time","Your Info","Confirm"].map((label, i) => (
            <div key={i} className={`step ${i === step ? "active" : i < step ? "done" : ""}`} onClick={() => i < step && setStep(i)}>
              <div className="step-num">{i < step ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="container">

          {step === 0 && (
            <>
              <h2 className="section-title">Choose a Service</h2>
              <p className="section-sub">Select one service to continue</p>
              {categories.map(cat => (
                <div key={cat}>
                  <div className="category-label">{cat}</div>
                  <div className="services-grid">
                    {SERVICES.filter(s => s.category === cat).map(s => (
                      <div key={s.id} className={`service-card ${selectedService?.id === s.id ? "selected" : ""}`} onClick={() => setSelectedService(s)}>
                        <div className="service-left">
                          <div className="service-icon">{s.icon}</div>
                          <div>
                            <div className="service-name">{s.name}</div>
                            <div className="service-dur">{s.duration} min</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="service-price">${s.price}</div>
                          {selectedService?.id === s.id && <div className="check">✓</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="section-title">Pick a Date & Time</h2>
              <p className="section-sub">{selectedService?.name} · {selectedService?.duration} min</p>
              <div className="calendar-wrap">
                <div>
                  <div className="cal-header">
                    <button className="cal-nav" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}>‹</button>
                    <h3>{MONTHS[calMonth]} {calYear}</h3>
                    <button className="cal-nav" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}>›</button>
                  </div>
                  <div className="cal-grid">
                    {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
                    {calDays.map((cell, i) => (
                      <div key={i}
                        className={`cal-day ${cell.current ? "current-month" : ""} ${cell.current && isToday(cell.day) ? "today" : ""} ${selectedDay === cell.day && cell.current ? "selected" : ""}`}
                        onClick={() => { if (cell.current && !isPast(cell.day)) { setSelectedDay(cell.day); setSelectedTime(null); } }}
                        style={{ opacity: cell.current && isPast(cell.day) ? 0.2 : 1, cursor: cell.current && !isPast(cell.day) ? "pointer" : "default" }}
                      >{cell.day || ""}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="times-label">Available Times {selectedDay ? `— ${MONTHS[calMonth]} ${selectedDay}` : ""}</div>
                  {selectedDay ? (
                    <div className="times-grid">
                      {TIMES.map(t => (
                        <div key={t} className={`time-slot ${selectedTime === t ? "selected" : ""}`} onClick={() => setSelectedTime(t)}>{t}</div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: "#4a4540", letterSpacing: 1, marginTop: 8 }}>Select a date first</p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="section-title">Your Information</h2>
              <p className="section-sub">We'll send your confirmation here</p>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="Jane" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Doe" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="jane@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="(210) 555-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-field full">
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-input" placeholder="Any special requests or allergies..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="section-title">Review & Confirm</h2>
              <p className="section-sub">Please review your booking details</p>
              <div className="summary-card">
                <div className="summary-row"><span className="summary-key">Service</span><span className="summary-val">{selectedService?.name}</span></div>
                <div className="summary-row"><span className="summary-key">Duration</span><span className="summary-val">{selectedService?.duration} min</span></div>
                <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{MONTHS[calMonth]} {selectedDay}, {calYear}</span></div>
                <div className="summary-row"><span className="summary-key">Time</span><span className="summary-val">{selectedTime}</span></div>
                <div className="summary-row"><span className="summary-key">Name</span><span className="summary-val">{form.first} {form.last}</span></div>
                <div className="summary-row"><span className="summary-key">Email</span><span className="summary-val">{form.email}</span></div>
                <div className="summary-row"><span className="summary-key">Phone</span><span className="summary-val">{form.phone}</span></div>
                {form.notes && <div className="summary-row"><span className="summary-key">Notes</span><span className="summary-val">{form.notes}</span></div>}
                <div className="summary-total">
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-val">${selectedService?.price}</span>
                </div>
              </div>
            </>
          )}

          <div className="btn-row">
            {step > 0
              ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
              : <span />}
            {step < 3
              ? <button className="btn btn-primary" disabled={!canProceed[step]} onClick={() => setStep(s => s + 1)}>Continue →</button>
              : <button className="btn btn-primary" onClick={() => setSubmitted(true)}>Confirm Booking</button>}
          </div>
        </div>
      </div>
    </>
  );
}
