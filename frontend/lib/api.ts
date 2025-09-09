import { VehicleInfo, FitmentResults } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchFitment(vehicleInfo: VehicleInfo): Promise<FitmentResults> {
    const res = await fetch(`${BASE_URL}/parts/fitment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleInfo),
        cache: "no-store", // so Next.js doesn’t cache
    });

    if (!res.ok) {
        throw new Error("Failed to fetch fitment results");
    }

    return res.json();
}
