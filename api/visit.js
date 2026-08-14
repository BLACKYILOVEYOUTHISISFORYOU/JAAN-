import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    // Get visitor IP from Vercel's forwarded header
    const forwarded = req.headers["x-forwarded-for"];

    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket?.remoteAddress || "unknown";

    // Get some additional visit information
    const userAgent = req.headers["user-agent"] || "unknown";
    const referer = req.headers["referer"] || null;

    // Save the visit to Neon
    await sql`
      INSERT INTO visits (
        ip_address,
        user_agent,
        referer
      )
      VALUES (
        ${ip},
        ${userAgent},
        ${referer}
      )
    `;

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("Database error:", error);

    return res.status(500).json({
      error: "Failed to save visit"
    });
  }
}
