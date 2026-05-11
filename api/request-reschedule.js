const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Acrylic Faerie <hello@acrylicfaerie.com>";
const OWNER_EMAIL = "acrylicfaerie.biz@gmail.com";

async function sendEmail(to, subject, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, newDate, newTime, notes } = req.body || {};

  if (!id || !newDate || !newTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the booking
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}&select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const bookings = await getRes.json();

    if (!bookings.length) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookings[0];

    // Notify owner to approve
    await sendEmail(
      OWNER_EMAIL,
      `Reschedule Request: ${booking.client_name} — wants ${newDate} at ${newTime}`,
      `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 0;">
          <div style="background: #c4415a; padding: 14px 32px; text-align: center;">
            <p style="font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: white; margin: 0;">📅 Reschedule Request</p>
          </div>
          <div style="padding: 28px 32px;">
            <p style="font-size: 14px; color: #9a7080; line-height: 1.8; margin: 0 0 20px;">
              <strong style="color: #f5e8ee;">${booking.client_name}</strong> has requested to reschedule their appointment.
            </p>

            <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 20px; margin-bottom: 20px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">Current Appointment</p>
              <p style="font-size: 14px; color: #9a7080; margin: 0 0 4px;">Service: <strong style="color: #f5e8ee;">${booking.service}</strong></p>
              <p style="font-size: 14px; color: #9a7080; margin: 0 0 4px;">Date: <strong style="color: #f5e8ee;">${booking.date}</strong></p>
              <p style="font-size: 14px; color: #9a7080; margin: 0;">Time: <strong style="color: #f5e8ee;">${booking.time}</strong></p>
            </div>

            <div style="background: #1a1015; border: 1px solid #c4415a; padding: 20px; margin-bottom: 20px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">Requested New Time</p>
              <p style="font-size: 18px; color: #e8839a; font-style: italic; margin: 0 0 4px;">${newDate}</p>
              <p style="font-size: 18px; color: #e8839a; font-style: italic; margin: 0;">${newTime}</p>
              ${notes ? `<p style="font-size: 13px; color: #9a7080; margin: 12px 0 0;">Note: ${notes}</p>` : ''}
            </div>

            <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0 0 20px;">
              To approve, go to your admin dashboard and reschedule the booking manually. The client will not be notified automatically — please reach out to confirm.
            </p>

            <div style="display: flex; gap: 12px; text-align: center;">
              <a href="https://acrylicfaerie.com/admin" style="display: inline-block; background: #c4415a; color: white; padding: 12px 32px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Go to Admin ✦</a>
              <a href="mailto:${booking.client_email}" style="display: inline-block; background: transparent; color: #e8839a; padding: 12px 32px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; border: 1px solid #c4415a;">Reply to Client</a>
            </div>

            <div style="margin-top: 20px; padding: 14px; background: #1a1015; border: 1px solid #3a1f2e;">
              <p style="font-size: 12px; color: #9a7080; margin: 0;">Client: ${booking.client_name} · ${booking.client_email} · ${booking.client_phone}</p>
            </div>
          </div>
        </div>
      `
    );

    // Confirm receipt to client
    await sendEmail(
      booking.client_email,
      "Reschedule Request Received — Acrylic Faerie",
      `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 32px; text-align: center;">
          <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin: 0 0 16px;">✦ ✦ ✦</p>
          <h1 style="font-size: 26px; font-style: italic; color: #f5e8ee; margin: 0 0 16px;">Request Received!</h1>
          <p style="font-size: 14px; color: #9a7080; line-height: 1.8; margin: 0 0 20px;">
            Hi ${booking.client_name.split(' ')[0]}! We've received your reschedule request for<br/>
            <strong style="color: #e8839a;">${newDate} at ${newTime}</strong><br/><br/>
            Angie will review and confirm your new appointment shortly. Keep an eye on your email!
          </p>
          <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 16px 20px; margin-bottom: 24px; text-align: left;">
            <p style="font-size: 12px; color: #9a7080; margin: 0 0 6px;">✦ Your current appointment on <strong style="color: #f5e8ee;">${booking.date} at ${booking.time}</strong> remains active until Angie confirms the change.</p>
            <p style="font-size: 12px; color: #9a7080; margin: 0;">✦ Questions? DM us <a href="https://instagram.com/acrylicfaerie" style="color: #e8839a;">@acrylicfaerie</a> or email <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #e8839a;">acrylicfaerie.biz@gmail.com</a></p>
          </div>
          <p style="font-size: 11px; color: #5a3a48;">© 2026 Acrylic Faerie · San Antonio, TX</p>
        </div>
      `
    );

    return res.status(200).json({ message: "Reschedule request sent!" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
