"use client";

import React, { useState, useRef, useEffect } from "react";
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/public/icons/ArrowRightIcon";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Image from "next/image";

interface Category {
    id: string;
    name: string;
    productCount: number;
    image: string;
    link: string;
    bgColor?: string;
}

interface CategoriesCarouselProps {
    title?: string;
    categories?: Category[];
    className?: string;
    onCategoryClick?: (category: Category) => void;
}

const defaultCategories: Category[] = [
    {
        id: "body-parts",
        name: "Body Parts",
        productCount: 4,
        image: "/images/car-brake-disc.png",
        link: "/category/body-parts",
        bgColor: "bg-white border border-accent-50",
    },
    {
        id: "exterior",
        name: "Exterior",
        productCount: 1,
        image: "/images/radiator-grill.png",
        link: "/category/exterior",
        bgColor: "bg-white border border-accent-50",
    },
    {
        id: "interior",
        name: "Interior",
        productCount: 7,
        image: "/images/interior.png",
        link: "/category/interior",
        bgColor: "bg-white border border-accent-50",
    },
    {
        id: "parts",
        name: "Parts",
        productCount: 15,
        image: "/images/parts.png",
        link: "/category/parts",
        bgColor: "bg-white border border-accent-50",
    },
    {
        id: "performance",
        name: "Performance",
        productCount: 7,
        image: "/images/performance.png",
        link: "/category/performance",
        bgColor: "bg-white border border-accent-50",
    },
    {
        id: "maintenance",
        name: "Maintenance",
        productCount: 12,
        image: "/images/radiator-grill.png",
        link: "/category/maintenance",
        bgColor: "bg-white border border-accent-50",
    },
];

const CategoriesCarousel: React.FC<CategoriesCarouselProps> = ({
                                                                   title = "Choose The Car Part",
                                                                   categories = defaultCategories,
                                                                   className = "",
                                                                   onCategoryClick,
                                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isMobile, setIsMobile] = useState(false);
    const maxIndex = Math.max(0, categories.length - itemsPerView);

    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsPerView(2);
                setIsMobile(true);
            } else if (width < 1024) {
                setItemsPerView(3);
                setIsMobile(false);
            } else if (width < 1280) {
                setItemsPerView(4);
                setIsMobile(false);
            } else {
                setItemsPerView(5);
                setIsMobile(false);
            }
        };
        updateItemsPerView();
        window.addEventListener("resize", updateItemsPerView);
        return () => window.removeEventListener("resize", updateItemsPerView);
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
        }, 3000); // 3 seconds per slide
        return () => clearInterval(interval);
    }, [maxIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const handleCategoryClick = (category: Category) => {
        if (onCategoryClick) onCategoryClick(category);
    };

    return (
        <section className={`py-12 bg-gray-50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-primary text-gray-900 mb-2">
                        {title}
                    </h2>
                </div>

                <div className="relative">
                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <>
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                                    currentIndex === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50 hover:shadow-xl transform hover:scale-105"
                                }`}
                                aria-label="Previous categories"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= maxIndex}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                                    currentIndex >= maxIndex
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50 hover:shadow-xl transform hover:scale-105"
                                }`}
                                aria-label="Next categories"
                            >
                                <ArrowRightIcon className="w-5 h-5 text-gray-600" />
                            </button>
                        </>
                    )}

                    {/* Scrollable container on mobile, fixed grid on desktop */}
                    <div
                        ref={carouselRef}
                        className={`overflow-hidden ${
                            isMobile ? "overflow-x-auto scrollbar-hide -mx-2 px-2" : ""
                        }`}
                    >
                        <div
                            className={`flex transition-transform duration-300 ease-in-out gap-6 ${
                                isMobile ? "flex-nowrap" : ""
                            }`}
                            style={
                                !isMobile
                                    ? {
                                        transform: `translateX(-${
                                            currentIndex * (100 / categories.length)
                                        }%)`,
                                        width: `${categories.length * (100 / itemsPerView)}%`,
                                    }
                                    : {}
                            }
                        >
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`flex-shrink-0 ${
                                        isMobile ? "w-[45%] sm:w-[40%]" : ""
                                    }`}
                                    style={!isMobile ? { width: `${100 / itemsPerView}%` } : {}}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="group cursor-pointer"
                                                onMouseEnter={() => setHoveredCategory(category.id)}
                                                onMouseLeave={() => setHoveredCategory(null)}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <div className="relative flex items-center justify-center group w-full mx-auto aspect-square">
                                                    {/* Colored Circle Background */}
                                                    <div
                                                        className={`absolute rounded-full ${isMobile ? 'bg-orange-500' : (category.bgColor || 'bg-orange-500')} transition-all duration-300 group-hover:bg-primary-50 group-hover:border-primary-50`}
                                                        style={{ width: '40%', height: '40%', left: '30%', top: '25%', zIndex: 1, position: 'absolute' }}
                                                    />
                                                    {/* Product Image absolutely positioned on top of the circle */}
                                                    <div
                                                        className="absolute"
                                                        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '70%', height: '70%', zIndex: 2 }}
                                                    >
                                                        <Image
                                                            src={category.image}
                                                            alt={category.name}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain drop-shadow-lg hover:scale-110 transition-transform duration-200 w-full h-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <h3
                                                        className={`text-base sm:text-lg font-bold transition-colors duration-200 ${
                                                            hoveredCategory === category.id
                                                                ? "text-primary-100"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                        {category.productCount} Product
                                                        {category.productCount !== 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent sideOffset={8}>
                                            {category.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoriesCarousel;
