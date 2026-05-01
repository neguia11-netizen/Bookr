const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Acrylic Faerie <hello@acrylicfaerie.com>";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function isFill(service) {
  return (service || "").toLowerCase().includes("fill");
}

function isFullSet(service) {
  const s = (service || "").toLowerCase();
  return s.includes("full set") || s.includes("overlay");
}

function getDateStr(daysAgo) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  now.setDate(now.getDate() - daysAgo);
  return `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

async function sendRebookingEmail(booking, serviceType) {
  const firstName = (booking.client_name || "there").split(" ")[0];
  const subject = serviceType === "fill"
    ? "Time for a fill? 💕 Acrylic Faerie"
    : "Ready for your next set? 💅 Acrylic Faerie";

  const bodyLine = serviceType === "fill"
    ? "It's been about 2 weeks since your last fill — your nails are probably due for some love!"
    : "It's been about 4 weeks since your last full set — it might be time to book your next appointment!";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [booking.client_email],
      subject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 40px 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin-bottom: 16px;">✦ ✦ ✦</p>
            <h1 style="font-size: 30px; font-style: italic; font-weight: 700; color: #f5e8ee; margin-bottom: 8px;">
              ${serviceType === "fill" ? "Time for a Fill?" : "Ready for Your Next Set?"}
            </h1>
            <p style="font-size: 13px; color: #9a7080; letter-spacing: 2px; text-transform: uppercase;">Acrylic Faerie · San Antonio</p>
          </div>

          <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 28px; margin-bottom: 28px; position: relative;">
            <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
            <p style="font-size: 15px; color: #f5e8ee; line-height: 1.8; margin-bottom: 12px;">Hi <strong>${firstName}</strong>! 💕</p>
            <p style="font-size: 14px; color: #9a7080; line-height: 1.8; margin-bottom: 20px;">${bodyLine}</p>
            <p style="font-size: 14px; color: #9a7080; line-height: 1.8;">
              Spots fill up fast — book your next appointment online whenever you're ready!
            </p>
          </div>

          <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 20px; margin-bottom: 28px;">
            <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin-bottom: 12px;">Your Last Appointment</p>
            <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">✦ Service: ${booking.service}</p>
            <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">✦ Date: ${booking.date}</p>
          </div>

          <div style="text-align: center; margin-bottom: 28px;">
            <a href="https://acrylicfaerie.com" style="display: inline-block; background: #c4415a; color: white; padding: 14px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Book Now ✦</a>
          </div>

          <p style="text-align: center; font-size: 11px; color: #5a3a48; margin-top: 20px; letter-spacing: 1px;">
            Questions? <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #7a2840;">acrylicfaerie.biz@gmail.com</a>
            · <a href="https://instagram.com/acrylicfaerie" style="color: #7a2840;">@acrylicfaerie</a>
          </p>
          <p style="text-align: center; font-size: 10px; color: #3a1f2e; margin-top: 8px;">
            You're receiving this because you've booked with Acrylic Faerie before.
          </p>
        </div>
      `,
    }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.method === "POST" ? req.body?.secret : req.query?.secret;
  if (secret !== "faerie-rebooking-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const fillDate = getDateStr(14);   // 2 weeks ago
    const fullSetDate = getDateStr(28); // 4 weeks ago

    // Fetch fills from 2 weeks ago
    const fillRes = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?date=eq.${encodeURIComponent(fillDate)}&status=eq.paid&select=*`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
    const fills = await fillRes.json();

    // Fetch full sets from 4 weeks ago
    const fullSetRes = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?date=eq.${encodeURIComponent(fullSetDate)}&status=eq.paid&select=*`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
    const fullSets = await fullSetRes.json();

    const results = { fills: 0, fullSets: 0, skipped: 0 };

    for (const booking of fills) {
      if (isFill(booking.service) && booking.client_email) {
        const sent = await sendRebookingEmail(booking, "fill");
        if (sent) results.fills++;
      } else {
        results.skipped++;
      }
    }

    for (const booking of fullSets) {
      if (isFullSet(booking.service) && booking.client_email) {
        const sent = await sendRebookingEmail(booking, "fullset");
        if (sent) results.fullSets++;
      } else {
        results.skipped++;
      }
    }

    return res.status(200).json({
      message: `Sent ${results.fills} fill reminders and ${results.fullSets} full set reminders`,
      ...results,
      fillDate,
      fullSetDate,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
