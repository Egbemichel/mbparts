// /lib/vinDecoder.ts
export async function decodeVIN(vin: string) {
    try {
        const res = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
        );
        if (!res.ok) {
            throw new Error("Failed to fetch VIN data");
        }

        const data = await res.json();
        // Simplify the response
        const results: Record<string, string> = {};
        (data.Results as Array<{ Variable: string; Value: string | null }>)?.forEach((item) => {
            if (item.Variable && item.Value) {
                results[item.Variable] = item.Value;
            }
        });

        return {
            vin,
            make: results["Make"] || "Unknown",
            model: results["Model"] || "Unknown",
            year: results["Model Year"] || "Unknown",
            bodyClass: results["Body Class"] || "Unknown",
            engine: results["Engine Model"] || "Unknown",
            raw: results, // full data if you need later
        };
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Unknown error");
        }
    }
}
