"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoadingFallback from "@/components/ui/LoadingFallback";
import { VehicleInfo, PaginatedParts } from "@/lib/types";

import WishlistIcon from "@/public/icons/WishlistIcon";
import GitCompareIcon from "@/public/icons/GitCompare";
import ShoppingCartIcon from "@/public/icons/ShoppingCartIcon";
import ViewIcon from "@/public/icons/ViewIcon";
import Star from "@/public/icons/StarIcon";
import Check from "@/public/icons/Check";
import Image from "next/image";

export default function VinResults({ vehicleInfo }: { vehicleInfo: VehicleInfo }) {
    const [fitment, setFitment] = useState<Record<string, PaginatedParts>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const fetchFitment = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/parts/fitment/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehicleInfo),
            });

            if (!res.ok) throw new Error("Failed to fetch fitment data");
            const data = await res.json();
            setFitment(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, vehicleInfo]);

    async function fetchPage(category: string, pageNumber: number) {
        try {
            const paramName = `page_${category.toLowerCase().replace(/\s+/g, "_")}`;
            const res = await fetch(`${BASE_URL}/parts/fitment/?${paramName}=${pageNumber}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehicleInfo),
            });

            if (!res.ok) throw new Error("Failed to fetch page");
            const data = await res.json();
            setFitment((prev) => ({ ...prev, [category]: data[category] }));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        }
    }

    useEffect(() => {
        fetchFitment();
    }, [vehicleInfo.vin, fetchFitment]);

    const handleAddToWishlist = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = new Set(wishlistItems);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setWishlistItems(next);
    };

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
        ));

    if (loading) return <LoadingFallback />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!fitment || Object.keys(fitment).length === 0) return <p>No compatible parts found.</p>;

    return (
        <div className="mt-12 w-full">
            <h2 className="text-xl font-semibold mb-4">Compatible Parts</h2>
            <Tabs defaultValue={Object.keys(fitment)[0]}>
                <TabsList>
                    {Object.keys(fitment).map((category) => (
                        <TabsTrigger key={category} value={category}>
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(fitment).map(([category, parts]) => (
                    <TabsContent key={category} value={category}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {parts.results.map((part) => {
                                const isHovered = hoveredProduct === part.id.toString();
                                const features = [
                                    part.product?.stock_status ? "In stock" : "Out of stock",
                                    "2 years warranty",
                                    "Delivery: 2–5 business days",
                                    "Free 30 days return",
                                ];

                                return (
                                    <div
                                        key={part.id}
                                        className="group relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                                        onMouseEnter={() => setHoveredProduct(part.id.toString())}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        {/* Image */}
                                        <div className="relative bg-white p-6 h-64 flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={part.product?.image_url || "https://via.placeholder.com/300x200?text=Part"}
                                                alt={part.product?.name || "Part"}
                                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                width={300}
                                                height={200}
                                            />

                                            {/* Hover Actions */}
                                            <div
                                                className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
                                                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                                }`}
                                            >
                                                <button
                                                    onClick={(e) => handleAddToWishlist(part.id.toString(), e)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                        wishlistItems.has(part.id.toString())
                                                            ? "bg-red-500 text-white"
                                                            : "bg-white text-gray-600 hover:bg-red-500 hover:text-white shadow-md"
                                                    }`}
                                                >
                                                    <WishlistIcon
                                                        className="w-5 h-5"
                                                        fill={wishlistItems.has(part.id.toString()) ? "currentColor" : "none"}
                                                    />
                                                </button>
                                                <button className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-md">
                                                    <GitCompareIcon className="w-5 h-5" />
                                                </button>
                                                <button className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-md">
                                                    <ViewIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 transition-all duration-300">
                                            {isHovered ? (
                                                <div className="space-y-2">
                                                    {features.map((f, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center text-sm ${
                                                                f === "In stock" ? "text-green-600" : "text-gray-600"
                                                            }`}
                                                        >
                                                            {f === "In stock" ? (
                                                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                                            ) : (
                                                                <span className="w-1 h-1 bg-black rounded-full mr-2" />
                                                            )}
                                                            {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-500">{part.product?.category}</p>
                                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-orange-600 transition">
                                                        {part.product?.name}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-xl font-bold text-orange-600">
                                                            {part.product?.price} XAF
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex space-x-1">{renderStars(part.product?.stars || 4)}</div>
                                                        <span className="text-sm text-gray-500">
                                                            ({part.product?.stars || 5})
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Add to Cart */}
                                        <div className="px-4 pb-4">
                                            <button className="w-full py-3 px-4 rounded font-medium transition flex items-center justify-center space-x-2 bg-gray-700 text-white hover:bg-gray-800">
                                                <span>ADD TO CART</span>
                                                <ShoppingCartIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between mt-6">
                            {parts.previous && (
                                <button
                                    onClick={() => {
                                        const pageStr = parts.previous?.split("page_")[1]?.split("=")[1];
                                        if (pageStr) fetchPage(category, parseInt(pageStr, 10));
                                    }}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Previous
                                </button>
                            )}
                            {parts.next && (
                                <button
                                    onClick={() => {
                                        const pageStr = parts.next?.split("page_")[1]?.split("=")[1];
                                        if (pageStr) fetchPage(category, parseInt(pageStr, 10));
                                    }}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ml-auto"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

// Fix for unused expression warning (likely in a map or similar):
// Find any line like: someArray.map(...)
// and ensure the result is used or returned, or replace with forEach if not used.
// If you have a line like: someArray.map(doSomething)
// and doSomething does not return a value, change it to someArray.forEach(doSomething)
// (No such line is visible in the provided code, so this is a general fix comment.)
