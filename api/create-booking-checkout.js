import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SITE_URL = "https://acrylicfaerie.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingId, clientEmail, clientName, service, date, time } = req.body || {};

  if (!bookingId || !clientEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Acrylic Faerie — Appointment Deposit",
            description: `${service} · ${date} at ${time}`,
          },
          unit_amount: 1000, // $10.00
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${SITE_URL}/success?booking=${bookingId}`,
      cancel_url: `${SITE_URL}/`,
      customer_email: clientEmail,
      metadata: { bookingId, type: "appointment_deposit" },
    });

    // Save session ID to booking
    await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stripe_session_id: session.id }),
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
