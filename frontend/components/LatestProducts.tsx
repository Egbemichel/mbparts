'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';

import WishlistIcon from '@/public/icons/WishlistIcon';
import GitCompareIcon from '@/public/icons/GitCompare';
import ShoppingCartIcon from '@/public/icons/ShoppingCartIcon';
import DoubleArrowRight from '@/public/icons/DoubleArrowRight';
import ViewIcon from '@/public/icons/ViewIcon';
import Star from '@/public/icons/StarIcon';
import Check from '@/public/icons/Check';
import { Separator } from "@/components/ui/separator";

interface LatestProductsProps {
    title?: string;
    products: Product[];
    showViewAll?: boolean;
    className?: string;
    onAddToCart?: (product: Product) => void;
    onCompare?: (product: Product) => void;
    onViewAll?: () => void;
}

const LatestProducts: React.FC<LatestProductsProps> = ({
                                                           title = 'Featured Products',
                                                           products,
                                                           showViewAll = false,
                                                           className = '',
                                                           onAddToCart,
                                                           onCompare,
                                                           onViewAll,
                                                       }) => {
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
    const router = useRouter();

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        onAddToCart?.(product);
    };

    const handleCompare = (product: Product) => onCompare?.(product);

    const renderStars = (stars: number) =>
        Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));

    const getHoverFeatures = (p: Product) => [
        p.stock_status ? 'In stock' : 'Out of stock',
        `${p.warranty} year${p.warranty > 1 ? 's' : ''} warranty`,
        `Delivery in ${p.delivery_days} day${p.delivery_days > 1 ? 's' : ''}`,
        `Return within ${p.return_days} day${p.return_days > 1 ? 's' : ''}`,
    ];

    return (
        <section className={`py-12 bg-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                <div className="text-left mb-1">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-primary text-gray-900">{title}</h2>
                </div>
                <Separator className="border-black w-full p-0.5" />
                <div className="flex items-center justify-between mb-8">
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const isHovered = hoveredProduct === product.id;
                        const hoverFeatures = getHoverFeatures(product);
                        const wishlisted = isWishlisted(product.id);

                        return (
                            <div
                                key={product.id}
                                className="group relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer block focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                tabIndex={0}
                                onClick={() => product.slug && router.push(`/product/${product.slug}`)}
                            >
                                <div className="relative bg-white p-6 h-64 flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={product.image_url ?? '/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        width={400}
                                        height={400}
                                    />
                                    <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (wishlisted) {
                                                    removeFromWishlist(product.id);
                                                } else {
                                                    addToWishlist(product);
                                                }
                                            }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white shadow-md'}`}
                                            aria-label="Add to wishlist"
                                        >
                                            <WishlistIcon className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCompare(product); }}
                                            className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-md"
                                            aria-label="Compare product"
                                        >
                                            <GitCompareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); router.push(`/product/${product.slug}`); }}
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
                                            {hoverFeatures.map((feature, index) => (
                                                <div key={index} className={`mt-6 flex font-secondary-2 items-center text-sm ${feature === 'In stock' ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {feature === 'In stock' ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <span className="w-1 h-1 bg-black rounded-full mr-1 flex-shrink-0" />}
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-2">
                                                <span className="text-sm text-gray-500">{product.category_name}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">{product.name}</h3>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <span className="text-xl font-bold text-orange-600">${product.price}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-4">{renderStars(product.stars ?? 0)}</div>
                                        </>
                                    )}
                                </div>

                                <div className="px-4 pb-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
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
