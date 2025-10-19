"use client";

import React, { useState, useEffect, useRef } from "react";
import FlexibleBanner, { BannerCard, PromoBanner } from "@/components/Hero";
import { motion, AnimatePresence } from "framer-motion";

export const HeroBanner: React.FC = () => {
    const promoBanner: PromoBanner = {
        promoText: "Flash sale:",
        promoCode: "Batt50",
        promoDiscount: "50% off car batteries",
        promoLink: "/shop"
    };

    // 3 banners for the carousel
    const banners: BannerCard[] = [
        {
            id: "hero-1",
            badgeText: "Limited Stock",
            title: "MODIFY",
            subtitle: "YOUR CAR",
            description: "Led sequential headlights",
            ctaText: "SHOP NOW",
            ctaLink: "/shop",
            backgroundImage: "/images/hero.jpg",
            alt: "Mercedes Benz parts - headlights"
        },
        {
            id: "hero-2",
            badgeText: "New Arrival",
            title: "UPGRADE",
            subtitle: "YOUR DRIVE",
            description: "Premium brake kits",
            ctaText: "SHOP NOW",
            ctaLink: "/shop",
            backgroundImage: "/images/car-brake-disc.png",
            alt: "Mercedes Benz brake parts"
        },
        {
            id: "hero-3",
            badgeText: "Hot Deal",
            title: "ENHANCE",
            subtitle: "YOUR COMFORT",
            description: "Luxury seat covers",
            ctaText: "SHOP NOW",
            ctaLink: "/shop",
            backgroundImage: "/images/car-seat.jpg",
            alt: "Mercedes Benz interior parts"
        }
    ];

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const slideCount = banners.length;
    const AUTO_SLIDE_INTERVAL = 5000;

    // Auto-advance carousel
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (!isAnimating) {
                setDirection(1);
                setCurrent((prev) => (prev + 1) % slideCount);
            }
        }, AUTO_SLIDE_INTERVAL);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [current, slideCount, isAnimating]);

    // Manual indicator click
    const handleIndicatorClick = (idx: number) => {
        if (isAnimating || idx === current) return;
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
    };

    // Animation variants
    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
            position: 'absolute',
        }),
        center: {
            x: 0,
            opacity: 1,
            position: 'relative',
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
            position: 'absolute',
        })
    };

    return (
        <section
            className="w-full max-w-full px-2 sm:px-4 md:px-8 lg:px-0 mx-auto relative"
            aria-label="Mercedes Benz Parts Hero Banner"
        >
            {/* Main H1 for SEO */}
            <header className="text-center py-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    Mercedes Benz Parts – OEM & Quality Accessories
                </h1>
                <h2 className="text-lg md:text-xl text-gray-600 mt-2">
                    Shop Genuine Mercedes Benz Parts, OEM Components & Accessories
                </h2>
            </header>

            <div className="relative overflow-hidden">
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={banners[current].id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 200, damping: 20 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full h-full absolute left-0 top-0"
                        onAnimationStart={() => setIsAnimating(true)}
                        onAnimationComplete={() => setIsAnimating(false)}
                        role="img"
                        aria-label={banners[current].alt}
                    >
                        <FlexibleBanner
                            layout="hero"
                            promoBanner={promoBanner}
                            banners={banners[current]}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Indicators */}
                <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center gap-3 z-20">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            aria-label={`Go to slide ${idx + 1}`}
                            onClick={() => handleIndicatorClick(idx)}
                            className={`w-3 h-3 rounded-full border-2 border-primary-50 focus:outline-none transition-all duration-300 ${
                                current === idx ? 'bg-primary-50' : 'bg-white'
                            }`}
                            style={{ boxShadow: current === idx ? '0 0 0 2px #f97316' : undefined }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
