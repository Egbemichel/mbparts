"use client";
import React from 'react';
import Star from '@/public/icons/StarIcon'
import DoubleArrowRight from "@/public/icons/DoubleArrowRight";
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface Product {
    id: number;
    title: string;
    price: string;
    rating: number;
    reviewCount: number;
    image: string;
}

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                />
            ))}
            <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
        </div>
    );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-row items-center" style={{ width: 422, height: 168 }}>
            <div className="h-full w-[140px] bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-1"
                    width={140}
                    height={140}
                />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full pl-2">
                <h3 className="text-gray-800 font-medium text-sm leading-tight mb-1 line-clamp-2">
                    {product.title}
                </h3>
                <div className="text-orange-500 font-bold text-lg mb-1">{product.price}</div>
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
        </div>
    );
};

const TopPicks: React.FC = () => {
    const router = useRouter();

    const products: Product[] = [
        {
            id: 1,
            title: "Hosim RC Car Suspension Shock Absorbers",
            price: "$575.46",
            rating: 5,
            reviewCount: 5,
            image: "/images/car_suspension.jpg"
        },
        {
            id: 2,
            title: "10.25\" Car Multimedia Wifi Android 10.0 Car Dvd",
            price: "$80.89",
            rating: 4,
            reviewCount: 5,
            image: "/images/multimedia.jpeg"
        },
        {
            id: 3,
            title: "10inch 12V 24V 80W Car Auto Radiator Cooling Fan For Car",
            price: "$912.07",
            rating: 5,
            reviewCount: 5,
            image: "/images/radiator.jpg"
        },
        {
            id: 4,
            title: "American Racing VN474 Gasser Polished Custom Wheels Rims",
            price: "$600.00-$658.00",
            rating: 4,
            reviewCount: 5,
            image: "/images/wheel_rims.jpg"        },
        {
            id: 5,
            title: "Car Battery N50L Auto Batteries For Cars",
            price: "$994.26",
            rating: 5,
            reviewCount: 5,
            image: "/images/batteries.jpg"        },
        {
            id: 6,
            title: "Portable Mini 12V Inflator Air Compressor 150 PSI",
            price: "$919.80",
            rating: 4,
            reviewCount: 5,
            image: "/images/air_compressor.jpg"        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Picks</h2>
                {/* Desktop View All Button */}
                <button className="hidden sm:flex items-center gap-1 text-black hover:text-orange-600 font-medium">
                    VIEW ALL
                    <DoubleArrowRight className="w-4 h-4 text-primary-100" />
                </button>
            </div>
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {/* Promotional Banner */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 h-full min-h-[400px] relative overflow-hidden">
                        <div className="relative z-10 text-white h-full flex flex-col justify-between">
                            <div className="text-right">
                                <div className="text-sm font-medium mb-1">START FROM</div>
                                <div className="text-3xl font-bold text-orange-500">$99</div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-4xl font-bold leading-tight">
                                        GENUINE<br />
                                        PARTS<br />
                                        YOU NEED
                                    </div>
                                </div>

                                <button onClick={() => router.push("/shop")} className="bg-white text-gray-900 px-6 py-3 rounded font-bold hover:bg-primary-30 transition-colors flex items-center gap-2 w-full justify-center">
                                    SHOP NOW
                                    <DoubleArrowRight className="w-4 h-4 text-primary-100" />
                                </button>
                            </div>
                        </div>

                        {/* Background automotive parts images */}
                        <div className="absolute inset-0">
                            <Image
                                src="/images/car-brake-disc.png"
                                alt="Automotive parts background"
                                className="w-full h-full object-cover opacity-30"
                                fill
                                width={150}
                                height={150}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/70" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile View All Button at the bottom center */}
            <div className="flex sm:hidden justify-center mt-8">
                <button className="flex items-center gap-1 text-black hover:text-orange-600 font-medium px-6 py-2">
                    VIEW ALL
                    <DoubleArrowRight className="ml-2 w-4 h-4 text-primary-100" />
                </button>
            </div>
        </div>
    );
};

export default TopPicks;