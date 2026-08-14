import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const forwarded = req.headers["x-forwarded-for"];

    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket?.remoteAddress || "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";
    const referer = req.headers["referer"] || null;

    await sql`
      INSERT INTO visits (ip_address, user_agent, referer)
      VALUES (${ip}, ${userAgent}, ${referer})
    `;

    return res.status(200).json({
      success: true,
      ip: ip
    });

  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
