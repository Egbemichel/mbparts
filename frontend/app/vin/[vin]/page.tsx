'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeVIN } from "@/lib/vinDecoder";
import CarModel from "@/components/CarModel";
import VinInfoCard from "@/components/VinInfoCard";
import ColorPicker from "@/components/ColorPicker";
import LoadingFallback from "@/components/ui/LoadingFallback";
import ManIcon from "@/public/icons/ManIcon";
import MakeIcon from "@/public/icons/MakeIcon";
import ModelIcon from "@/public/icons/ModelIcon";
import YearIcon from "@/public/icons/YearIcon";
import BodyClassIcon from "@/public/icons/BodyClassIcon";
import EngineIcon from "@/public/icons/EngineIcon";
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import VinResults from "@/app/vin/[vin]/VinResults";

type VinData =
    | { loading: true }
    | { error: string }
    | {
    loading?: false;
    raw: Record<string, string>;
    make: string;
    model: string;
    year: string;
    bodyClass: string;
    engine: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VinDecoderPage({ params }: any) {
    const vin = params?.vin as string; // cast safely
    const [data, setData] = useState<VinData>({ loading: true });
    const [selectedColor, setSelectedColor] = useState("#ffffff");
    const colors = ["#ffffff", "#0000ff", "#00ff00", "#ff0000", "#000000"];
    const router = useRouter();

    useEffect(() => {
        decodeVIN(vin)
            .then(setData)
            .catch(() => setData({ error: "Failed to fetch VIN data" }));
    }, [vin]);

    if ('loading' in data && data.loading) return <LoadingFallback />;
    if ('error' in data && data.error) return <p className="text-red-500">{data.error}</p>;
    if (!('raw' in data)) return null; // safety check

    const infoCards = [
        { label: "Manufacturer", value: data.raw['Manufacturer Name'], icon: <ManIcon className="w-6 h-6 text-primary-100" />, iconBgColor: "bg-accent-50" },
        { label: "Make", value: data.make, icon: <MakeIcon className="w-6 h-6 text-primary-100" />, iconBgColor: "bg-accent-50" },
        { label: "Model", value: data.model, icon: <ModelIcon className="w-6 h-6 text-primary-100" />, iconBgColor: "bg-accent-50" },
        { label: "Year", value: data.year, icon: <YearIcon className="w-6 h-6 text-primary-100" />, iconBgColor: "bg-accent-50" },
        { label: "Body Class", value: data.bodyClass, icon: <BodyClassIcon className="w-6 h-6 text-primary-100" />, iconBgColor: "bg-accent-50" },
        { label: "Engine", value: data.engine, icon: <EngineIcon className="w-6 h-6 text-primary-100" />, iconBgColor: "bg-accent-50" },
    ];

    return (
        <>
            <div className="relative flex flex-col md:flex-row p-8 gap-8 max-w-6xl mx-auto">
                <button
                    className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => router.back()}
                    aria-label="Go back"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
                </button>

                <div className="flex-1 h-96 md:h-[500px] relative">
                    <CarModel bodyClass={data.bodyClass} color={selectedColor}/>
                    <div className="absolute bottom-4 right-4">
                        <ColorPicker colors={colors} selectedColor={selectedColor} onSelect={setSelectedColor}/>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="font-semibold text-lg mb-4">Your Vehicle Specifications:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {infoCards.map(card => (
                            <VinInfoCard key={card.label} label={card.label} value={card.value} icon={card.icon} iconBgColor={card.iconBgColor}/>
                        ))}
                    </div>
                </div>
            </div>

            <VinResults vehicleInfo={{
                vin,
                make: data.make,
                model: data.model,
                year: data.year,
                bodyClass: data.bodyClass,
                engine: data.engine,
            }}/>
        </>
    );
}
