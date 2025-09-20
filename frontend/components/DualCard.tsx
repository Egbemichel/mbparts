'use client';

import React from "react";
import FlexibleBanner, { BannerCard } from "@/components/Hero";

export const DualCardsBanner: React.FC = () => {
    const dualBanners: BannerCard[] = [
        {
            id: "card-1",
            badgeText: "Car Seat Sale",
            discount: "30% OFF",
            title: "REFRESH",
            subtitle: "YOUR RIDE",
            ctaText: "SHOP NOW",
            ctaLink: "/shop",
            backgroundImage: "/images/car-seat.jpg"
        },
        {
            id: "card-2",
            badgeText: "Brake System",
            title: "FOR SAFE",
            subtitle: "DRIVING",
            ctaText: "SHOP NOW",
            ctaLink: "/shop",
            backgroundImage: "/images/car-brake-disc.png"
        }
    ];

    return (
        <div className="hidden md:block w-full max-w-full px-2 sm:px-4 md:px-8 lg:px-0 mx-auto">
            <FlexibleBanner
                layout="dual-cards"
                banners={dualBanners}
            />
        </div>
    );
};
