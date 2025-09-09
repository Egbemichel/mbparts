import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ keep secret server-side only
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ error: "Missing publicId" });

    try {
        await cloudinary.v2.uploader.destroy(publicId);
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: "Cloudinary delete failed", details: err });
    }
}
