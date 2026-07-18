const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export default async function handler(req, res) {
  const secret = req.query?.secret || req.body?.secret;

  if (secret !== "faerie-cleanup-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Delete pending bookings older than 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const deleteRes = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?status=eq.pending&created_at=lt.${twoHoursAgo}`,
      {
        method: "DELETE",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!deleteRes.ok) {
      throw new Error("Failed to delete pending bookings");
    }

    return res.status(200).json({ message: "Cleaned up old pending bookings!" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
