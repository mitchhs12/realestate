import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { homeid } = req.query;

  if (!homeid) {
    return res.status(400).json({ error: "homeid is required" });
  }

  try {
    const key = `home:viewcount:${homeid}`;

    // Handle incrementing view count on GET request (or POST, depending on your design)
    if (req.method === "POST") {
      await kv.incr(key);
    }

    // Retrieve current view count
    const viewCount = await kv.get(key);

    res.status(200).json({ homeid, viewCount });
  } catch (error) {
    console.error("Error handling view count:", error);
    res.status(500).json({ error: "Failed to update or retrieve view count" });
  }
}
