"use client";

import { useState } from "react";
import { VehicleInfo, FitmentResults } from "@/lib/types";
import { fetchFitment } from "@/lib/api";

export function useFitment() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<FitmentResults | null>(null);

    const getFitment = async (vehicleInfo: VehicleInfo) => {
        setLoading(true);
        try {
            const data = await fetchFitment(vehicleInfo);
            setResults(data);
        } finally {
            setLoading(false);
        }
    };

    return { loading, results, getFitment };
}
