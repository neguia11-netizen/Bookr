const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Acrylic Faerie <onboarding@resend.dev>";

async function getOrCreateClient(email, name) {
  const getRes = await fetch(`${SUPABASE_URL}/rest/v1/clients?email=eq.${encodeURIComponent(email)}&select=*`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  const clients = await getRes.json();

  if (clients.length > 0) return clients[0];

  const createRes = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    },
    body: JSON.stringify({ email, booking_count: 0, loyalty_emails_sent: 0 }),
  });
  const [client] = await createRes.json();
  return client;
}

async function updateLoyaltyEmailsSent(clientId, newCount) {
  await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${clientId}`, {
    method: "PATCH",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loyalty_emails_sent: newCount }),
  });
}

async function sendLoyaltyEmail(email, name) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: "You Earned a Reward! 💕✦ Acrylic Faerie",
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 40px 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin-bottom: 16px;">✦ ✦ ✦</p>
            <h1 style="font-size: 36px; font-style: italic; font-weight: 700; color: #f5e8ee; margin-bottom: 8px;">You Earned a Reward!</h1>
            <p style="font-size: 13px; color: #9a7080; letter-spacing: 2px; text-transform: uppercase;">Acrylic Faerie Loyalty Program</p>
          </div>
          <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 28px; margin-bottom: 28px; position: relative;">
            <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
            <p style="font-size: 15px; color: #f5e8ee; line-height: 1.8; margin-bottom: 16px;">Hi <strong>${name.split(' ')[0]}</strong>! 💕</p>
            <p style="font-size: 14px; color: #9a7080; line-height: 1.8; margin-bottom: 20px;">
              You've completed <strong style="color: #e8839a;">5 bookings</strong> with Acrylic Faerie and you've earned your loyalty reward!
            </p>
            <div style="background: #0f0a0c; border: 1px solid #c4415a; padding: 20px; text-align: center; margin-bottom: 20px;">
              <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #7a2840; margin-bottom: 8px;">Your Reward</p>
              <p style="font-size: 20px; color: #e8839a; font-style: italic; font-weight: bold; margin-bottom: 8px;">20% Off Your Next Set</p>
              <p style="font-size: 14px; color: #9a7080;">+ One free upgrade (charm, decal, or rhinestone)</p>
            </div>
            <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">
              Simply mention this email when you book your next appointment and we'll apply your discount automatically. No code needed! ✦
            </p>
          </div>
          <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 20px; margin-bottom: 28px;">
            <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin-bottom: 12px;">How to Redeem</p>
            <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">✦ Book your next appointment at <a href="https://acrylicfaerie.com" style="color: #e8839a;">acrylicfaerie.com</a></p>
            <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">✦ Mention this email at your appointment</p>
            <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">✦ Valid for one use · Cannot be combined with other offers</p>
          </div>
          <div style="text-align: center;">
            <a href="https://acrylicfaerie.com" style="display: inline-block; background: #c4415a; color: white; padding: 14px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Book Now ✦</a>
          </div>
          <p style="text-align: center; font-size: 11px; color: #5a3a48; margin-top: 28px; letter-spacing: 1px;">
            Questions? Email us at <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #7a2840;">acrylicfaerie.biz@gmail.com</a>
          </p>
        </div>
      `,
    }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, secret } = req.body || {};

  if (secret !== "faerie-loyalty-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!email || !name) {
    return res.status(400).json({ error: "Missing email or name" });
  }

  try {
    const client = await getOrCreateClient(email, name);
    const newCount = (client.booking_count || 0) + 1;

    // Update booking count
    await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${client.id}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ booking_count: newCount }),
    });

    // Read fresh loyalty_emails_sent from DB to avoid stale data
    const freshRes = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${client.id}&select=loyalty_emails_sent`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const [freshClient] = await freshRes.json();
    const loyaltySent = freshClient?.loyalty_emails_sent || 0;
    const rewardsEarned = Math.floor(newCount / 5);

    if (rewardsEarned > loyaltySent) {
      const sent = await sendLoyaltyEmail(email, name);
      if (sent) {
        await updateLoyaltyEmailsSent(client.id, rewardsEarned);
        return res.status(200).json({ message: "Loyalty reward sent!", booking_count: newCount, reward: true });
      }
    }

    return res.status(200).json({ message: "Booking count updated", booking_count: newCount, reward: false });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
