import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SITE_URL = "https://acrylicfaerie.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    clientName, clientEmail, clientPhone,
    material, shape, length, addons,
    nailSizes, notes, inspoUrls,
    total, delivery
  } = req.body || {};

  if (!clientEmail || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Build line items
    const lengthPrices = { short: 2000, medium: 2500, long: 3000, xl: 3000 };
    const basePrice = lengthPrices[length] || 2500;
    const addonsList = addons || [];
    const addonTotal = addonsList.length * 500;
    const deliveryFee = delivery === "delivery" ? 500 : 0;

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Press-On Nails — ${length?.charAt(0).toUpperCase() + length?.slice(1)} ${shape} (${material})`,
            description: `Shape: ${shape} | Material: ${material} | Length: ${length}`,
          },
          unit_amount: basePrice,
        },
        quantity: 1,
      },
    ];

    if (addonsList.length > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Add-ons",
            description: addonsList.join(", "),
          },
          unit_amount: addonTotal,
        },
        quantity: 1,
      });
    }

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery Fee" },
          unit_amount: deliveryFee,
        },
        quantity: 1,
      });
    }

    // Save order to Supabase first
    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/press_on_orders`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        material, shape, length,
        addons: addonsList.join(", "),
        nail_sizes: nailSizes,
        notes, delivery,
        inspo_url: inspoUrls?.join(",") || "",
        total,
        status: "pending",
      }),
    });

    const [order] = await orderRes.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${SITE_URL}/pressonsuccess?order=${order.id}`,
      cancel_url: `${SITE_URL}/pressons`,
      customer_email: clientEmail,
      metadata: { orderId: order.id },
    });

    // Update order with session ID
    await fetch(`${SUPABASE_URL}/rest/v1/press_on_orders?id=eq.${order.id}`, {
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
