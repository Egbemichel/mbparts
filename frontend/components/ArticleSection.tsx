'use client';
import React, { useState } from 'react';
import Image from "next/image";
import DoubleArrowRight from "@/public/icons/DoubleArrowRight";
import { Separator } from "@/components/ui/separator"

const ArticleSection: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    // ArticleCard component for reuse
    const ArticleCard = ({
        tag,
        date,
        title,
        author = 'ADMIN',
        description,
        alt = '',
        className = '',
        showOverlay = true,
        onMouseEnter,
        onMouseLeave,
        image,
    }: {
        tag: string;
        date: string;
        title: string;
        author?: string;
        description: string;
        alt?: string;
        className?: string;
        showOverlay?: boolean;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
        image: string;
    }) => (
        <div
            className={`group cursor-pointer ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="relative overflow-hidden rounded-[2px] mb-4">
                <Image
                    src={image}
                    alt={alt}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                />
                {showOverlay && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/75 to-transparent transition-opacity duration-300" />
                )}
                <div className="absolute left-0 top-0 w-full flex justify-between items-center px-4 py-1 transition-colors duration-200 bg-transparent group-hover:bg-primary-100">
                    <span className="text-primary-100 group-hover:text-white text-xs font-semibold uppercase">{tag}</span>
                    <span className="text-white text-xs font-medium px-2">{date}</span>
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 mb-2">BY <span className="text-black font-secondary-2 font-bold" >{author}</span></p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>
            <button className="text-sm font-semibold text-gray-900 border-b border-gray-900 hover:text-orange-500 hover:border-orange-500 transition-colors">Read More</button>
        </div>
    );

    return (
        <div className="bg-white">
            {/* Helpful Automotive Articles Section */}
            <div className="bg-white py-8 lg:py-2">
                <div className="container mx-auto px-4 lg:px-8">

                    {/* Section Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 lg:mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-0">
                            Helpful Automotive Articles
                        </h2>
                        <button className="hidden lg:flex items-center text-black hover:text-orange-600 font-semibold group">
                            VIEW ALL
                            <DoubleArrowRight className="text-primary-100 w-[18px] h-[18px] ml-2" />
                        </button>
                    </div>

                    {/* Desktop Articles Grid */}
                    <div className="hidden lg:grid lg:grid-cols-4 gap-0.5">
                        {[
                            {
                                tag: "HOW TO",
                                date: "NOVEMBER 3, 2023",
                                title: "Durable Auto Parts: Challenges for...",
                                description: "Learn how to choose durable auto parts and what challenges you may face when selecting the right components for your vehicle. Get tips on quality, compatibility, and longevity.",
                                image: "/images/car_suspension.jpg"
                            },
                            {
                                tag: "LIFESTYLE",
                                date: "NOVEMBER 3, 2023",
                                title: "Using Technology Apps for Convenient Auto Parts...",
                                description: "Discover the best technology apps for finding and ordering auto parts online. Make your shopping experience faster, easier, and more reliable with the latest digital tools.",
                                image: "/images/interior.png"
                            },
                            {
                                tag: "OFF TOPIC",
                                date: "NOVEMBER 3, 2023",
                                title: "The Future of Auto Parts: Autonomous Vehicles and...",
                                description: "Explore how autonomous vehicles are changing the auto parts industry. Learn about new trends, innovations, and what the future holds for car owners and mechanics.",
                                image: "/images/lighting.png"
                            },
                            {
                                tag: "TIPS & TRICKS",
                                date: "NOVEMBER 3, 2023",
                                title: "Restoring Classic Cars: The Concern for Replacement...",
                                description: "Get expert advice on restoring classic cars, including how to find rare replacement parts and maintain authenticity while upgrading performance.",
                                image: "/images/car-seat.jpg"
                            }
                        ].map((item, idx) => (
                            <ArticleCard
                                key={idx}
                                tag={item.tag}
                                date={item.date}
                                title={item.title}
                                description={item.description}
                                alt={item.title}
                                showOverlay={hoveredIndex !== null && hoveredIndex !== idx}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                image={item.image}
                            />
                        ))}
                    </div>

                    {/* Mobile Articles - Single Column with Horizontal Scroll */}
                    <div className="lg:hidden">
                        <div className="overflow-x-auto pb-4">
                            <div className="flex space-x-4" style={{ width: 'max-content' }}>
                                <ArticleCard
                                    tag="LIFESTYLE"
                                    date="NOVEMBER 3, 2023"
                                    title="Using Technology Apps for Convenient Auto Parts Shopping"
                                    description="Discover the best technology apps for finding and ordering auto parts online. Make your shopping experience faster, easier, and more reliable with the latest digital tools."
                                    className="flex-shrink-0 w-80"
                                    image="/images/interior.png"
                                />
                                <ArticleCard
                                    tag="TIPS & TRICKS"
                                    date="NOVEMBER 3, 2023"
                                    title="Restoring Classic Cars: The Concern for Replacement"
                                    description="Get expert advice on restoring classic cars, including how to find rare replacement parts and maintain authenticity while upgrading performance."
                                    className="flex-shrink-0 w-80"
                                    image="/images/car-seat.jpg"
                                />
                                <ArticleCard
                                    tag="HOW TO"
                                    date="NOVEMBER 3, 2023"
                                    title="High-Tech Auto Parts: How They're Transforming"
                                    description="Learn how high-tech auto parts are transforming vehicle performance, safety, and efficiency. Stay updated on the latest advancements in automotive technology."
                                    className="flex-shrink-0 w-80"
                                    image="/images/car_suspension.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="my-12 bg-accent-50" />

                {/* Mobile View All Button */}
                <div className="lg:hidden mt-8 text-center">
                    <button className="inline-flex items-center text-black hover:text-orange-600 font-semibold">
                        VIEW ALL
                        <DoubleArrowRight className="text-primary-100 w-[18px] h-[18px]" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ArticleSection;