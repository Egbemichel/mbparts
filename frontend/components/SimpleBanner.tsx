"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import DoubleArrowRight from "@/public/icons/DoubleArrowRight";

const SimpleBanner: React.FC = () => {
    const router = useRouter();
    return (
        <div className="relative overflow-hidden rounded-2xl">
            {/* Main Banner Container */}
            <div className="relative px-8 py-12 md:py-10">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/images/car-brake-disc.png')`,
                    }}
                />

                {/* Orange Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/85 via-orange-500/80 to-orange-700/85"></div>


                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-6 md:gap-0">
                    {/* Main Text */}
                    <div className="text-white text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            GET THE RIGHT PARTS, RIGHT NOW
                        </h1>
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0 ml-0 md:ml-8 w-full md:w-auto flex justify-center md:justify-start">
                        <button onClick={() => router.push("/shop")} className="bg-white text-gray-900 px-6 py-4 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base hover:bg-gray-100 transition-all flex items-center gap-3 group w-full md:w-auto justify-center">
                            EXPLORE PRODUCTS
                            <DoubleArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleBanner;