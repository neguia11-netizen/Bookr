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
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.method === "GET" ? req.query?.id : req.body?.id;

  if (!id) {
    return res.status(400).json({ error: "Missing booking ID" });
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

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    // Cancel the booking
    await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "cancelled" }),
    });

    // Notify owner
    await sendEmail(
      OWNER_EMAIL,
      `Cancellation: ${booking.client_name} — ${booking.date} at ${booking.time}`,
      `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 32px;">
          <div style="background: #7a2828; padding: 14px 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: white; margin: 0;">⚠ Appointment Cancelled</p>
          </div>
          <p style="font-size: 14px; color: #9a7080; line-height: 1.8; margin-bottom: 20px;">
            <strong style="color: #f5e8ee;">${booking.client_name}</strong> has cancelled their appointment.<br/>
            Their $10 deposit has been forfeited.
          </p>
          <table style="width: 100%; border-collapse: collapse; background: #1a1015; border: 1px solid #4d2a3d;">
            <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080; width: 35%;">Service</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${booking.service}</td></tr>
            <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Date</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${booking.date}</td></tr>
            <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Time</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${booking.time}</td></tr>
            <tr><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Email</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${booking.client_email}</td></tr>
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://acrylicfaerie.com/admin" style="display: inline-block; background: #c4415a; color: white; padding: 12px 32px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">View Admin ✦</a>
          </div>
        </div>
      `
    );

    // Confirm cancellation to client
    await sendEmail(
      booking.client_email,
      "Appointment Cancelled — Acrylic Faerie",
      `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 32px; text-align: center;">
          <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin: 0 0 16px;">✦ ✦ ✦</p>
          <h1 style="font-size: 28px; font-style: italic; color: #f5e8ee; margin: 0 0 16px;">Appointment Cancelled</h1>
          <p style="font-size: 14px; color: #9a7080; line-height: 1.8; margin: 0 0 24px;">
            Hi ${booking.client_name.split(' ')[0]}, your appointment on <strong style="color: #f5e8ee;">${booking.date} at ${booking.time}</strong> has been cancelled.<br/><br/>
            Per our policy, your $10 deposit has been forfeited. We hope to see you again soon!
          </p>
          <a href="https://acrylicfaerie.com" style="display: inline-block; background: #c4415a; color: white; padding: 14px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Book Again ✦</a>
          <p style="font-size: 11px; color: #5a3a48; margin-top: 24px;">Questions? <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #7a2840;">acrylicfaerie.biz@gmail.com</a></p>
        </div>
      `
    );

    return res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
