const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Acrylic Faerie <hello@acrylicfaerie.com>";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { recipientName, recipientEmail, senderName, message, amount, secret } = req.body || {};

  if (secret !== "faerie-gift-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!recipientEmail || !recipientName || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const res2 = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [recipientEmail],
        subject: `${senderName} sent you an Acrylic Faerie Gift Card! 💕✦`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 40px 32px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin-bottom: 16px;">✦ ✦ ✦</p>
              <h1 style="font-size: 32px; font-style: italic; font-weight: 700; color: #f5e8ee; margin-bottom: 8px;">You've Got a Gift!</h1>
              <p style="font-size: 13px; color: #9a7080; letter-spacing: 2px; text-transform: uppercase;">Acrylic Faerie Gift Card</p>
            </div>

            <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 28px; margin-bottom: 28px; position: relative; text-align: center;">
              <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
              <p style="font-size: 14px; color: #9a7080; margin-bottom: 8px;">Hi <strong style="color: #f5e8ee;">${recipientName}</strong>! 💕</p>
              <p style="font-size: 14px; color: #9a7080; margin-bottom: 24px;"><strong style="color: #e8839a;">${senderName}</strong> sent you an Acrylic Faerie gift card!</p>
              <div style="background: #0f0a0c; border: 1px solid #c4415a; padding: 24px; margin-bottom: 20px;">
                <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #7a2840; margin-bottom: 8px;">Gift Card Value</p>
                <p style="font-size: 52px; font-style: italic; font-weight: 700; color: #e8839a; line-height: 1;">${amount}</p>
              </div>
              ${message ? `<p style="font-size: 14px; color: #9a7080; font-style: italic; line-height: 1.7; border-left: 2px solid #7a2840; padding-left: 16px; text-align: left; margin-top: 16px;">"${message}"</p>` : ''}
            </div>

            <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 20px; margin-bottom: 28px;">
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin-bottom: 12px;">How to Redeem</p>
              <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin-bottom: 8px;">✦ Book your appointment at <a href="https://acrylicfaerie.com" style="color: #e8839a;">acrylicfaerie.com</a></p>
              <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin-bottom: 8px;">✦ Show this email at your appointment to apply your gift card</p>
              <p style="font-size: 13px; color: #9a7080; line-height: 1.8;">✦ Gift cards never expire · Any remaining balance carries over</p>
            </div>

            <div style="text-align: center; margin-bottom: 28px;">
              <a href="https://acrylicfaerie.com" style="display: inline-block; background: #c4415a; color: white; padding: 14px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Book Now ✦</a>
            </div>

            <div style="text-align: center; border-top: 1px solid #3a1f2e; padding-top: 20px;">
              <p style="font-size: 11px; color: #5a3a48; margin-bottom: 8px; letter-spacing: 1px;">📍 5623 Spring Moon St, San Antonio, TX 78247</p>
              <p style="font-size: 11px; color: #5a3a48; letter-spacing: 1px;">
                <a href="https://instagram.com/acrylicfaerie" style="color: #7a2840;">@acrylicfaerie</a> ·
                <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #7a2840;">acrylicfaerie.biz@gmail.com</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!res2.ok) {
      const err = await res2.text();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send gift email" });
    }

    return res.status(200).json({ message: "Gift email sent!" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
