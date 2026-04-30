const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function getOrCreateClient(email) {
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, secret } = req.body || {};

  if (secret !== "faerie-loyalty-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const client = await getOrCreateClient(email);
    const newCount = (client.booking_count || 0) + 1;

    await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${client.id}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ booking_count: newCount }),
    });

    return res.status(200).json({ message: "Booking count updated", booking_count: newCount });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
