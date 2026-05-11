const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Acrylic Faerie <hello@acrylicfaerie.com>";
const OWNER_EMAIL = "acrylicfaerie.biz@gmail.com";
const SITE_URL = "https://acrylicfaerie.com";

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

function clientConfirmationHtml(booking) {
  const rescheduleUrl = `${SITE_URL}/reschedule?id=${booking.id}`;
  const cancelUrl = `${SITE_URL}/cancel?id=${booking.id}`;

  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 0;">

      <!-- HEADER -->
      <div style="background: linear-gradient(180deg, #1e0d16 0%, #0f0a0c 100%); padding: 40px 32px; text-align: center; border-bottom: 1px solid #3a1f2e;">
        <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin: 0 0 16px;">✦ ✦ ✦</p>
        <h1 style="font-family: Georgia, serif; font-size: 38px; font-style: italic; font-weight: 700; color: #f5e8ee; margin: 0 0 8px; text-shadow: 0 0 40px #c4415a55;">Acrylic Faerie</h1>
        <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #9a7080; margin: 0;">San Antonio · Home Based Nail Technician</p>
      </div>

      <!-- CONFIRMATION BANNER -->
      <div style="background: #c4415a; padding: 16px 32px; text-align: center;">
        <p style="font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: white; margin: 0; font-weight: 500;">✦ Appointment Confirmed ✦</p>
      </div>

      <!-- BODY -->
      <div style="padding: 36px 32px;">
        <p style="font-size: 16px; color: #f5e8ee; line-height: 1.8; margin: 0 0 24px;">
          Hi <strong>${booking.client_name.split(' ')[0]}</strong>! 💕<br/>
          Your appointment is confirmed. We can't wait to see you!
        </p>

        <!-- BOOKING DETAILS -->
        <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 24px; margin-bottom: 24px; position: relative;">
          <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
          <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 16px;">Your Booking Details</p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #3a1f2e;">
              <td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080; width: 40%;">Service</td>
              <td style="padding: 10px 0; font-size: 14px; color: #f5e8ee; font-style: italic;">${booking.service}</td>
            </tr>
            <tr style="border-bottom: 1px solid #3a1f2e;">
              <td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Date</td>
              <td style="padding: 10px 0; font-size: 14px; color: #f5e8ee; font-style: italic;">${booking.date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #3a1f2e;">
              <td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Time</td>
              <td style="padding: 10px 0; font-size: 14px; color: #f5e8ee; font-style: italic;">${booking.time}</td>
            </tr>
            <tr style="border-bottom: 1px solid #3a1f2e;">
              <td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Location</td>
              <td style="padding: 10px 0; font-size: 14px; color: #f5e8ee; font-style: italic;">5623 Spring Moon St<br/>San Antonio, TX 78247</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Deposit Paid</td>
              <td style="padding: 10px 0; font-size: 14px; color: #e8839a; font-style: italic;">$10.00 ✦</td>
            </tr>
            ${booking.notes ? `<tr style="border-top: 1px solid #3a1f2e;"><td style="padding: 10px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Notes</td><td style="padding: 10px 0; font-size: 13px; color: #9a7080;">${booking.notes}</td></tr>` : ''}
          </table>
        </div>

        <!-- WHAT TO BRING -->
        <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 20px 24px; margin-bottom: 24px;">
          <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">Before Your Appointment</p>
          <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0 0 6px;">✦ Arrive with <strong style="color: #f5e8ee;">clean, bare nails</strong> — no polish or product on them</p>
          <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0 0 6px;">✦ Bring any <strong style="color: #f5e8ee;">inspo photos</strong> you want to reference</p>
          <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0;">✦ Have questions? DM us on Instagram <a href="https://instagram.com/acrylicfaerie" style="color: #e8839a;">@acrylicfaerie</a></p>
        </div>

        <!-- POLICY REMINDER -->
        <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 20px 24px; margin-bottom: 28px;">
          <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">Studio Policies</p>
          <p style="font-size: 12px; color: #9a7080; line-height: 1.8; margin: 0 0 4px;">✦ <strong style="color: #f5e8ee;">Cancellations</strong> must be made 24+ hours in advance or deposit is forfeited</p>
          <p style="font-size: 12px; color: #9a7080; line-height: 1.8; margin: 0 0 4px;">✦ <strong style="color: #f5e8ee;">Late arrivals</strong> — 10 minute grace period, $10 late fee after that</p>
          <p style="font-size: 12px; color: #9a7080; line-height: 1.8; margin: 0;">✦ <strong style="color: #f5e8ee;">Reschedules</strong> — your deposit transfers with 24+ hours notice</p>
        </div>

        <!-- ACTION BUTTONS -->
        <div style="text-align: center; margin-bottom: 28px;">
          <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080; margin: 0 0 16px;">Need to make a change?</p>
          <div style="display: inline-block;">
            <a href="${rescheduleUrl}" style="display: inline-block; background: #1a1015; color: #e8839a; padding: 12px 28px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; border: 1px solid #c4415a; margin: 0 6px 10px;">Request Reschedule</a>
            <a href="${cancelUrl}" style="display: inline-block; background: transparent; color: #9a7080; padding: 12px 28px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; border: 1px solid #3a1f2e; margin: 0 6px 10px;">Cancel Appointment</a>
          </div>
          <p style="font-size: 11px; color: #5a3a48; margin: 8px 0 0; line-height: 1.6;">Cancellations forfeit your $10 deposit. Reschedules must be approved by Angie.</p>
        </div>

        <!-- BOOK AGAIN / FOLLOW -->
        <div style="text-align: center;">
          <a href="https://acrylicfaerie.com" style="display: inline-block; background: #c4415a; color: white; padding: 14px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px;">Visit Our Site ✦</a>
          <br/>
          <a href="https://instagram.com/acrylicfaerie" style="font-size: 12px; color: #7a2840; text-decoration: none;">Follow us @acrylicfaerie</a>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="background: #1a1015; padding: 20px 32px; text-align: center; border-top: 1px solid #3a1f2e;">
        <p style="font-size: 11px; color: #5a3a48; margin: 0; letter-spacing: 1px;">
          © 2026 Acrylic Faerie · 5623 Spring Moon St, San Antonio, TX 78247<br/>
          <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #7a2840;">acrylicfaerie.biz@gmail.com</a>
        </p>
      </div>
    </div>
  `;
}

function ownerNotificationHtml(booking) {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 0;">
      <div style="background: #c4415a; padding: 16px 32px; text-align: center;">
        <p style="font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: white; margin: 0;">✦ New Booking Received ✦</p>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 16px;">Booking Details</p>
        <table style="width: 100%; border-collapse: collapse; background: #1a1015; border: 1px solid #4d2a3d;">
          <tr style="border-bottom: 1px solid #3a1f2e;">
            <td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080; width: 35%;">Client</td>
            <td style="padding: 12px 16px; font-size: 14px; color: #f5e8ee;">${booking.client_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #3a1f2e;">
            <td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Email</td>
            <td style="padding: 12px 16px; font-size: 14px; color: #f5e8ee;"><a href="mailto:${booking.client_email}" style="color: #e8839a;">${booking.client_email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #3a1f2e;">
            <td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Phone</td>
            <td style="padding: 12px 16px; font-size: 14px; color: #f5e8ee;"><a href="tel:${booking.client_phone}" style="color: #e8839a;">${booking.client_phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #3a1f2e;">
            <td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Service</td>
            <td style="padding: 12px 16px; font-size: 14px; color: #f5e8ee;">${booking.service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #3a1f2e;">
            <td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Date</td>
            <td style="padding: 12px 16px; font-size: 14px; color: #e8839a; font-style: italic;">${booking.date}</td>
          </tr>
          <tr style="border-bottom: 1px solid #3a1f2e;">
            <td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Time</td>
            <td style="padding: 12px 16px; font-size: 14px; color: #e8839a; font-style: italic;">${booking.time}</td>
          </tr>
          ${booking.duration ? `<tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Duration</td><td style="padding: 12px 16px; font-size: 14px; color: #f5e8ee;">${booking.duration}</td></tr>` : ''}
          ${booking.notes ? `<tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Notes</td><td style="padding: 12px 16px; font-size: 14px; color: #f5e8ee;">${booking.notes}</td></tr>` : ''}
          ${booking.inspo_url ? `<tr><td style="padding: 12px 16px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Inspo</td><td style="padding: 12px 16px;">${booking.inspo_url.split(',').map(u => `<a href="${u}" style="color: #e8839a; display: block; margin-bottom: 4px;">View Photo ↗</a>`).join('')}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://acrylicfaerie.com/admin" style="display: inline-block; background: #c4415a; color: white; padding: 12px 32px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">View in Admin ✦</a>
        </div>
      </div>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { booking, secret } = req.body || {};

  if (secret !== "faerie-confirm-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!booking) {
    return res.status(400).json({ error: "Missing booking data" });
  }

  try {
    const [clientSent, ownerSent] = await Promise.all([
      sendEmail(
        booking.client_email,
        "Your Appointment is Confirmed! 💕 Acrylic Faerie",
        clientConfirmationHtml(booking)
      ),
      sendEmail(
        OWNER_EMAIL,
        `New Booking: ${booking.client_name} — ${booking.date} at ${booking.time}`,
        ownerNotificationHtml(booking)
      ),
    ]);

    return res.status(200).json({
      message: "Emails sent!",
      clientSent,
      ownerSent,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
