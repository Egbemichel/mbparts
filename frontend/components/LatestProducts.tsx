'use client';

import React, { useState } from 'react';
import WishlistIcon from "@/public/icons/WishlistIcon";
import GitCompareIcon from "@/public/icons/GitCompare";
import ShoppingCartIcon from "@/public/icons/ShoppingCartIcon";
import DoubleArrowRight from "@/public/icons/DoubleArrowRight";
import ViewIcon from "@/public/icons/ViewIcon";
import Star from "@/public/icons/StarIcon";
import Check from "@/public/icons/Check";
import { Product } from "@/lib/types";
import { useCart } from '@/components/CartContext';
import Image from "next/image";

interface LatestProductsProps {
    title?: string;
    products?: Product[];
    showViewAll?: boolean;
    className?: string;
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
    onCompare?: (product: Product) => void;
    onViewAll?: () => void;
}

const LatestProducts: React.FC<LatestProductsProps> = ({
                                                           title = "Latest Products",
                                                           products = [],
                                                           showViewAll = true,
                                                           className = '',
                                                           onProductClick,
                                                           onAddToCart,
                                                           onAddToWishlist,
                                                           onCompare,
                                                           onViewAll
                                                       }) => {
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
    const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
    const { addToCart } = useCart();

    const handleProductClick = (product: Product) => onProductClick?.(product);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        onAddToCart?.(product);
    };

    const handleAddToWishlist = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = new Set(wishlistItems);
        if (next.has(product.id)) {
            next.delete(product.id);
        } else {
            next.add(product.id);
        }
        setWishlistItems(next);
        onAddToWishlist?.(product);
    };

    // Fix unused variable warning for 'e' in handleCompare:
    const handleCompare = (product: Product, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        onCompare?.(product);
    };

    const renderStars = (stars: number) =>
        Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));


    const getHoverFeatures = (p: Product): string[] => [
        p.stock_status ? 'In stock' : 'Out of stock',
        `${p.warranty} year${p.warranty > 1 ? 's' : ''} warranty`,
        `Delivery in ${p.delivery_days} day${p.delivery_days > 1 ? 's' : ''}`,
        `Return within ${p.return_days} day${p.return_days > 1 ? 's' : ''}`
    ];

    if (!products || products.length === 0) {
        return (
            <section className={`py-12 bg-white ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    No products available.
                </div>
            </section>
        );
    }

    return (
        <section className={`py-12 bg-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
                    {showViewAll && (
                        <button
                            onClick={onViewAll}
                            className="hidden sm:flex items-center text-black hover:text-orange-700 font-medium transition-colors duration-200"
                        >
                            VIEW ALL
                            <DoubleArrowRight className="ml-2 w-4 h-4 text-primary-100" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const isHovered = hoveredProduct === product.id;
                        const hoverFeatures = getHoverFeatures(product);

                        return (
                            <div
                                key={product.id}
                                className="group relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="relative bg-white p-6 h-64 flex items-center justify-center overflow-hidden">
                                    {/* Use next/image for optimization */}
                                    <Image
                                        src={product.image_url ?? '/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        width={400}
                                        height={400}
                                    />

                                    <div
                                        className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
                                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                        }`}
                                    >
                                        <button
                                            onClick={(e) => handleAddToWishlist(product, e)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                wishlistItems.has(product.id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white shadow-md'
                                            }`}
                                            aria-label="Add to wishlist"
                                        >
                                            <WishlistIcon
                                                className="w-5 h-5"
                                                fill={wishlistItems.has(product.id) ? 'currentColor' : 'none'}
                                            />
                                        </button>
                                        <button
                                            onClick={(e) => handleCompare(product, e)}
                                            className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-md"
                                            aria-label="Compare product"
                                        >
                                            <GitCompareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleProductClick(product)}
                                            className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-md"
                                            aria-label="Quick view"
                                        >
                                            <ViewIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 transition-all duration-300">
                                    {isHovered ? (
                                        <div className="space-y-2">
                                            {hoverFeatures.map((feature, index) => {
                                                const isInStock = feature === 'In stock';
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`mt-6 flex font-secondary-2 items-center text-sm ${
                                                            isInStock ? 'text-green-600' : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {isInStock ? (
                                                            <Check className="w-4 h-4 mr-2 text-green-600" />
                                                        ) : (
                                                            <span className="w-1 h-1 bg-black rounded-full mr-1 flex-shrink-0" />
                                                        )}
                                                        {feature}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-2">
                                                <span className="text-sm text-gray-500">{product.category}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <span className="text-xl font-bold text-orange-600">{product.price}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-4">
                                                {renderStars(product.stars ?? 0)}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="px-4 pb-4">
                                    <button
                                        onClick={(e) => handleAddToCart(product, e)}
                                        className={`w-full py-3 px-4 rounded font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                            !product.stock_status
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                                : isHovered
                                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                    : 'bg-gray-700 text-white hover:bg-gray-800'
                                        }`}
                                        disabled={!product.stock_status}
                                    >
                                        <span>{product.stock_status ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                                        <ShoppingCartIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LatestProducts;
