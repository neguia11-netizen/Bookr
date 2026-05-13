import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

  const { orderId, secret } = req.body || {};

  if (secret !== "faerie-pressons-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get order from Supabase
    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/press_on_orders?id=eq.${orderId}&select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const [order] = await orderRes.json();
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update status to paid
    await fetch(`${SUPABASE_URL}/rest/v1/press_on_orders?id=eq.${orderId}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "paid" }),
    });

    const inspoLinks = order.inspo_url ? order.inspo_url.split(",").filter(Boolean) : [];
    const sizes = order.nail_sizes || {};
    const totalFormatted = `$${(order.total / 100).toFixed(2)}`;

    // Send client confirmation
    await sendEmail(
      order.client_email,
      "Press-On Order Confirmed! 💕 Acrylic Faerie",
      `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 0;">
          <div style="background: linear-gradient(180deg, #1e0d16 0%, #0f0a0c 100%); padding: 40px 32px; text-align: center; border-bottom: 1px solid #3a1f2e;">
            <p style="font-size: 13px; letter-spacing: 8px; color: #c4415a; margin: 0 0 16px;">✦ ✦ ✦</p>
            <h1 style="font-family: Georgia, serif; font-size: 36px; font-style: italic; font-weight: 700; color: #f5e8ee; margin: 0 0 8px;">Acrylic Faerie</h1>
            <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #9a7080; margin: 0;">Press-On Orders</p>
          </div>
          <div style="background: #c4415a; padding: 14px 32px; text-align: center;">
            <p style="font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: white; margin: 0;">✦ Order Confirmed ✦</p>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 15px; color: #f5e8ee; line-height: 1.8; margin: 0 0 24px;">Hi <strong>${order.client_name.split(' ')[0]}</strong>! 💕<br/>Your press-on order has been received and paid. Angie will begin working on your set soon!</p>
            <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 24px; margin-bottom: 20px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, #7a2840, #c4415a, #7a2840); position: absolute; top: 0; left: 0; right: 0;"></div>
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 16px;">Order Details</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 8px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080; width: 40%;">Material</td><td style="padding: 8px 0; font-size: 14px; color: #f5e8ee;">${order.material}</td></tr>
                <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 8px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Shape</td><td style="padding: 8px 0; font-size: 14px; color: #f5e8ee;">${order.shape}</td></tr>
                <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 8px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Length</td><td style="padding: 8px 0; font-size: 14px; color: #f5e8ee;">${order.length}</td></tr>
                ${order.addons ? `<tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 8px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Add-ons</td><td style="padding: 8px 0; font-size: 14px; color: #f5e8ee;">${order.addons}</td></tr>` : ''}
                <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 8px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Pickup/Delivery</td><td style="padding: 8px 0; font-size: 14px; color: #f5e8ee;">${order.delivery}</td></tr>
                <tr><td style="padding: 8px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Total Paid</td><td style="padding: 8px 0; font-size: 16px; color: #e8839a; font-style: italic;">${totalFormatted} ✦</td></tr>
              </table>
            </div>
            ${order.notes ? `<div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 16px 20px; margin-bottom: 20px;"><p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 8px;">Your Notes</p><p style="font-size: 13px; color: #9a7080;">${order.notes}</p></div>` : ''}
            <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 16px 20px; margin-bottom: 24px;">
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">What's Next</p>
              <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0 0 6px;">✦ Angie will review your order and inspo photos</p>
              <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0 0 6px;">✦ She'll reach out if she has any questions</p>
              <p style="font-size: 13px; color: #9a7080; line-height: 1.8; margin: 0;">✦ Questions? DM <a href="https://instagram.com/acrylicfaerie" style="color: #e8839a;">@acrylicfaerie</a> or email <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #e8839a;">acrylicfaerie.biz@gmail.com</a></p>
            </div>
            <div style="text-align: center;">
              <a href="https://acrylicfaerie.com" style="display: inline-block; background: #c4415a; color: white; padding: 14px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Visit Our Site ✦</a>
            </div>
          </div>
          <div style="background: #1a1015; padding: 20px 32px; text-align: center; border-top: 1px solid #3a1f2e;">
            <p style="font-size: 11px; color: #5a3a48; margin: 0;">© 2026 Acrylic Faerie · San Antonio, TX · <a href="mailto:acrylicfaerie.biz@gmail.com" style="color: #7a2840;">acrylicfaerie.biz@gmail.com</a></p>
          </div>
        </div>
      `
    );

    // Send owner notification
    await sendEmail(
      OWNER_EMAIL,
      `New Press-On Order: ${order.client_name} — ${order.length} ${order.shape} (${order.material})`,
      `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0a0c; color: #f5e8ee; padding: 0;">
          <div style="background: #c4415a; padding: 14px 32px; text-align: center;">
            <p style="font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: white; margin: 0;">💅 New Press-On Order — PAID</p>
          </div>
          <div style="padding: 28px 32px;">
            <table style="width: 100%; border-collapse: collapse; background: #1a1015; border: 1px solid #4d2a3d; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080; width: 35%;">Client</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${order.client_name}</td></tr>
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Email</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;"><a href="mailto:${order.client_email}" style="color: #e8839a;">${order.client_email}</a></td></tr>
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Phone</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${order.client_phone || "N/A"}</td></tr>
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Material</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${order.material}</td></tr>
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Shape</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${order.shape}</td></tr>
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Length</td><td style="padding: 10px 14px; font-size: 14px; color: #e8839a; font-style: italic;">${order.length}</td></tr>
              ${order.addons ? `<tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Add-ons</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${order.addons}</td></tr>` : ''}
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Delivery</td><td style="padding: 10px 14px; font-size: 14px; color: #f5e8ee;">${order.delivery}</td></tr>
              <tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Total</td><td style="padding: 10px 14px; font-size: 16px; color: #e8839a; font-style: italic;">${totalFormatted}</td></tr>
              ${order.notes ? `<tr style="border-bottom: 1px solid #3a1f2e;"><td style="padding: 10px 14px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9a7080;">Notes</td><td style="padding: 10px 14px; font-size: 13px; color: #9a7080;">${order.notes}</td></tr>` : ''}
            </table>

            ${Object.keys(sizes).length > 0 ? `
            <div style="background: #1a1015; border: 1px solid #4d2a3d; padding: 16px 20px; margin-bottom: 20px;">
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">Nail Sizes</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 11px; color: #9a7080; padding: 4px 8px; text-align: center;">Left Hand</td>
                  <td style="font-size: 11px; color: #9a7080; padding: 4px 8px; text-align: center;">Right Hand</td>
                </tr>
                <tr>
                  <td style="padding: 8px;">
                    <table style="width:100%">
                      ${['thumb','index','middle','ring','pinky'].map(f => `<tr><td style="font-size:11px;color:#9a7080;padding:2px 4px">${f}</td><td style="font-size:13px;color:#f5e8ee;padding:2px 4px">${sizes.left?.[f] ?? '—'}</td></tr>`).join('')}
                    </table>
                  </td>
                  <td style="padding: 8px;">
                    <table style="width:100%">
                      ${['thumb','index','middle','ring','pinky'].map(f => `<tr><td style="font-size:11px;color:#9a7080;padding:2px 4px">${f}</td><td style="font-size:13px;color:#f5e8ee;padding:2px 4px">${sizes.right?.[f] ?? '—'}</td></tr>`).join('')}
                    </table>
                  </td>
                </tr>
              </table>
            </div>` : ''}

            ${inspoLinks.length > 0 ? `
            <div style="background: #1a1015; border: 1px solid #3a1f2e; padding: 16px 20px; margin-bottom: 20px;">
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c4415a; margin: 0 0 12px;">Inspo Photos</p>
              ${inspoLinks.map(url => `<a href="${url}" style="color: #e8839a; display: block; margin-bottom: 6px; font-size: 13px;">View Photo ↗</a>`).join('')}
            </div>` : ''}

            <div style="text-align: center;">
              <a href="https://acrylicfaerie.com/admin" style="display: inline-block; background: #c4415a; color: white; padding: 12px 32px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">View in Admin ✦</a>
            </div>
          </div>
        </div>
      `
    );

    return res.status(200).json({ message: "Order confirmed and emails sent!" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
