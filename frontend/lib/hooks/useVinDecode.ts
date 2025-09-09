"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchVin(vin: string) {
    const res = await fetch(`/api/vin/${vin}`);
    if (!res.ok) throw new Error("Failed to fetch VIN data");
    return res.json();
}


export function useVinDecode(vin: string) {
    return useQuery({
        queryKey: ["vinDecode", vin],
        queryFn: () => fetchVin(vin),
    });
}
