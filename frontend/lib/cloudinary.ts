export async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: data,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const json = await res.json();
    return json.secure_url as string;
}

/**
 * Delete an image from Cloudinary by its public_id.
 * NOTE: You can only securely delete with an authenticated API call.
 * For client-side, you’d normally proxy this via your backend for security.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    //const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    //const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    //const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;

    // ⚠️ Security: Never expose API secret to frontend!
    // Instead, implement a server-side API route:
    // /api/cloudinary-delete → calls Cloudinary delete
    await fetch(`/api/cloudinary-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
    });
}

/** Utility: extract Cloudinary public_id from secure_url */
export function getPublicIdFromUrl(url: string): string | null {
    try {
        const parts = url.split("/");
        const filename = parts.pop()!;
        return filename.split(".")[0]; // remove extension
    } catch {
        return null;
    }
}
