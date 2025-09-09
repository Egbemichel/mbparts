'use client';

import React from "react";
import FlexibleBanner, { BannerCard, PromoBanner } from "@/components/Hero";

export const HeroBanner: React.FC = () => {
    const promoBanner: PromoBanner = {
        promoText: "Flash sale:",
        promoCode: "Batt50",
        promoDiscount: "50% off car batteries",
        promoLink: "/shop"
    };

    const heroBanner: BannerCard = {
        id: "hero-1",
        badgeText: "Limited Stock",
        title: "MODIFY",
        subtitle: "YOUR CAR",
        description: "Led sequential headlights",
        ctaText: "SHOP NOW",
        ctaLink: "/shop",
        backgroundImage: "/images/hero.jpg"
    };

    return (
        <div className="w-full max-w-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 mx-auto">
            <FlexibleBanner
                layout="hero"
                promoBanner={promoBanner}
                banners={heroBanner}
            />
        </div>
    );
};
