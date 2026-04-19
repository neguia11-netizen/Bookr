const SUPABASE_URL = "https://yqiwwdedbvxfdrmmwdtr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXd3ZGVkYnZ4ZmRybW13ZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTE0NTIsImV4cCI6MjA5MTg2NzQ1Mn0.SO5OgAKnZ0dkXhwAPgQqqgDM5kP4hhMONH_hrk33T6c";

const EMAILJS_SERVICE_ID = "service_qj22hlr";
const EMAILJS_TEMPLATE_ID = "template_0az8fc7"; // reusing client confirmation template
const EMAILJS_PUBLIC_KEY = "ga_ZOXpSGY692r6cR";

async function sendReminderEmail(booking) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        client_name: booking.client_name,
        client_email: booking.client_email,
        client_phone: booking.client_phone,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        duration: booking.duration || "",
        price: booking.price || "",
        notes: booking.notes || "None",
        reminder: "true",
      },
    }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Secret key check
  const secret = req.method === "POST"
    ? (req.body?.secret)
    : req.query?.secret;

  if (secret !== "faerie-reminders-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get tomorrow's date in CST/CDT (San Antonio, TX)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const tomorrowStr = `${months[tomorrow.getMonth()]} ${tomorrow.getDate()}, ${tomorrow.getFullYear()}`;

    // Fetch paid bookings for tomorrow
    const bookingsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?date=eq.${encodeURIComponent(tomorrowStr)}&status=eq.paid&select=*`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        }
      }
    );

    const bookings = await bookingsRes.json();

    const debugNow = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
    if (!bookings.length) {
      return res.status(200).json({ message: `No appointments tomorrow (${tomorrowStr})`, sent: 0, debug_now_cst: debugNow, debug_tomorrow: tomorrowStr });
    }

    // Send reminder to each client
    const results = await Promise.allSettled(
      bookings.map(b => sendReminderEmail(b))
    );

    const sent = results.filter(r => r.status === "fulfilled" && r.value).length;
    return res.status(200).json({
      message: `Sent ${sent} of ${bookings.length} reminders for ${tomorrowStr}`,
      sent,
      total: bookings.length,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
