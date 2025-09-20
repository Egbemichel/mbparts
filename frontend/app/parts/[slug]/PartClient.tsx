"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import LoadingFallback from "@/components/ui/LoadingFallback";
import {useCart} from "@/components/CartContext";

interface PartsClientProps {
    categorySlug: string;
    categoryName?: string;
}

interface PaginatedResponse {
    results: Product[];
    count: number;
    next?: string;
    previous?: string;
}

const PartsClient: React.FC<PartsClientProps> = ({ categorySlug, categoryName = "" }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalCount, setTotalCount] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const endpoint = useMemo(
        () => `${process.env.NEXT_PUBLIC_API_URL}/parts/parts-public/`,
        []
    );

    useEffect(() => {
        let isMounted = true;

        async function fetchProducts() {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    page_size: pageSize.toString(),
                    new_category: categorySlug, // fixed category
                });

                if (priceRange[0] > 0) params.append("min_price", priceRange[0].toString());
                if (priceRange[1] < 10000) params.append("max_price", priceRange[1].toString());

                const res = await fetch(`${endpoint}?${params.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch products");

                const data: PaginatedResponse = await res.json();

                if (isMounted) {
                    setProducts(data.results || []);
                    setTotalCount(data.count);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchProducts();
        return () => { isMounted = false; };
    }, [endpoint, page, pageSize, priceRange, categorySlug]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        //onAddToCart?.(product);
    };

    const handleQuantityChange = (delta: number) => setQuantity(prev => Math.max(1, prev + delta));

    if (loading) return <div className="text-center py-12"><LoadingFallback /></div>;
    if (products.length === 0) return <p className="text-center py-12">No products available.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Category Name */}
            <h1 className="text-3xl md:text-left text-center font-bold mb-6">{categoryName || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar: Price Filter */}
                <div className="md:w-64 flex-shrink-0">
                    <h2 className="text-lg font-semibold mb-2">Filter by Price</h2>
                    <input
                        type="range"
                        min={0}
                        max={10000}
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>

                {/* Products */}
                <div className="flex-1 space-y-6">
                    {products.map(product => (
                        <React.Fragment key={product.id}>
                            <div
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg bg-white"
                            >
                                {/* Image */}
                                <div className="flex justify-center items-center">
                                    <Image
                                        src={product.image_url || "/images/placeholder.png"}
                                        alt={product.name}
                                        width={120}
                                        height={120}
                                        className="object-contain"
                                    />
                                </div>

                                {/* Name, Price, Rating, Description */}
                                <div className="md:col-span-2 space-y-1">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="text-orange-600 font-semibold">${product.price}</p>
                                    <p className="text-yellow-500">{"★".repeat(product.stars || 0)}</p>
                                    <p className="text-gray-600 text-sm">{product.description}</p>
                                </div>

                                {/* Stock, Quantity, Add to Cart */}
                                <div className="flex flex-col items-center justify-between space-y-2">
                                    <p className={`font-semibold ${product.stock_status ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock_status ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                    {product.stock_status && (
                                        <>
                                            <div className="flex items-center border border-gray-300 w-auto">
                                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2 hover:bg-gray-100">-</button>
                                                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                                                <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-100">+</button>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-orange-600 text-white py-1 px-3 hover:bg-orange-700"
                                            >
                                                Add to Cart
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </React.Fragment>
                    ))}

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartsClient;
