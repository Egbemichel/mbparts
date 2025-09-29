import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    // 1. Get visitor IP
    const ip = req.headers.get("x-forwarded-for") || "Unknown";

    // 2. Fetch country from ipapi.co
    let country = "Unknown";
    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoRes.json();
      country = geoData.country_name || "Unknown";
    } catch (err) {
      console.error("Geo lookup failed:", err);
    }

    // 3. Send Telegram message
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🚀 New visitor on your website!\nIP: ${ip}\nCountry: ${country}`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
