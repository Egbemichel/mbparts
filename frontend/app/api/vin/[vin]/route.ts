import { NextResponse } from "next/server";
import { decodeVIN } from "@/lib/vinDecoder";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
    const vin = context?.params?.vin as string;

    if (!vin || vin.length < 11) {
        return NextResponse.json(
            { error: "Invalid VIN. Must be at least 11 characters." },
            { status: 400 }
        );
    }

    const result = await decodeVIN(vin);
    return NextResponse.json(result);
}
