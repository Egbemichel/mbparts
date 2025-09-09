'use client';

import React, { useState } from 'react';
import DoubleArrowRight from "@/public/icons/DoubleArrowRight";
import Star from "@/public/icons/StarIcon";
import Image from "next/image";

interface SpecialOfferProduct {
    id: string;
    name: string;
    category: string;
    currentPrice: number;
    originalPrice: number;
    discount: string;
    rating: number;
    reviewCount: number;
    image: string;
    link: string;
}

interface MainOffer {
    id: string;
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    backgroundColor: string;
}

interface SpecialOfferProps {
    title?: string;
    showViewAll?: boolean;
    mainOffer?: MainOffer;
    products?: SpecialOfferProduct[];
    className?: string;
    onProductClick?: (product: SpecialOfferProduct) => void;
    onMainOfferClick?: (offer: MainOffer) => void;
    onViewAll?: () => void;
}

const defaultMainOffer: MainOffer = {
    id: 'tire-offer',
    badge: 'ONLY THIS WEEK',
    title: 'SAVE UP TO $60',
    subtitle: '',
    description: 'on a set of select tires',
    ctaText: 'SHOP NOW',
    ctaLink: '/offers/tires',
    image: '/images/car-brake-disc.png',
    backgroundColor: 'bg-orange-500'
};

const defaultProducts: SpecialOfferProduct[] = [
    {
        id: 'spark-plug',
        name: 'Denso Iridium Power Spark Plug ITY20',
        category: 'Automotive Tools, Interior',
        currentPrice: 5.84,
        originalPrice: 459.45,
        discount: '99% OFF',
        rating: 5,
        reviewCount: 5,
        image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=400&auto=format&fit=crop',
        link: '/product/spark-plug-ity20'
    },
    {
        id: 'steering-wheel',
        name: 'Dub Steering Wheel 28',
        category: 'Body Parts, Parts',
        currentPrice: 357.55,
        originalPrice: 707.04,
        discount: '55% OFF',
        rating: 4,
        reviewCount: 5,
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=400&auto=format&fit=crop',
        link: '/product/steering-wheel-28'
    }
];

const SpecialOffer: React.FC<SpecialOfferProps> = ({
                                                       title = "Special Offer",
                                                       showViewAll = true,
                                                       mainOffer = defaultMainOffer,
                                                       products = defaultProducts,
                                                       className = '',
                                                       onProductClick,
                                                       onMainOfferClick,
                                                       onViewAll
                                                   }) => {
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    const handleProductClick = (product: SpecialOfferProduct) => {
        if (onProductClick) {
            onProductClick(product);
        }
    };

    const handleMainOfferClick = () => {
        if (onMainOfferClick) {
            onMainOfferClick(mainOffer);
        }
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${
                    index < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <section className={`py-12 bg-gray-50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {title}
                    </h2>
                    {/* Desktop View All Button */}
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

                {/* Offers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Offer Card */}
                    <div
                        className={`${mainOffer.backgroundColor} rounded-2xl p-8 text-white cursor-pointer transition-all duration-300 relative overflow-hidden group`}
                        onClick={handleMainOfferClick}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
                        </div>

                        <div className="relative z-10">
                            {/* Badge */}
                            <div className="inline-block mb-4">
                <span className="bg-opacity-20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide underline">
                  {mainOffer.badge}
                </span>
                            </div>

                            {/* Main Content */}
                            <div className="mb-6">
                                <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                                    {mainOffer.title}
                                </h3>
                                {mainOffer.subtitle && (
                                    <h4 className="text-xl font-semibold mb-2">{mainOffer.subtitle}</h4>
                                )}
                                <p className="text-white text-opacity-90 text-lg">
                                    {mainOffer.description}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <button className="bg-white text-gray-900 px-6 py-3 rounded font-bold text-sm hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2 group">
                                <span>{mainOffer.ctaText}</span>
                                <DoubleArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                        </div>

                        {/* Product Image */}
                        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-80 transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src={mainOffer.image}
                                alt="Special offer product"
                                className="w-full h-full object-contain"
                                width={200}
                                height={200}
                            />
                        </div>
                    </div>

                    {/* Product Offer Cards */}
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 border border-primary-100 group"
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                            onClick={() => handleProductClick(product)}
                        >
                            {/* Discount Badge */}
                            <div className="flex justify-end mb-4">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}
                </span>
                            </div>

                            {/* Product Image */}
                            <div className="flex justify-center mb-6 h-32">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full object-contain"
                                    width={150}
                                    height={150}
                                />
                            </div>

                            {/* Product Info */}
                            <div>
                                {/* Category */}
                                <p className="text-sm text-gray-500 mb-2">{product.category}</p>

                                {/* Product Name */}
                                <h3 className={`text-lg font-semibold mb-4 line-clamp-2 transition-colors duration-200 ${
                                    hoveredProduct === product.id ? 'text-orange-600' : 'text-gray-900'
                                }`}>
                                    {product.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(product.currentPrice)}
                  </span>
                                    <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        {renderStars(product.rating)}
                                    </div>
                                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button at the bottom center */}
                {showViewAll && (
                    <div className="flex sm:hidden justify-center mt-8">
                        <button
                            onClick={onViewAll}
                            className="flex items-center text-black hover:text-orange-700 font-medium transition-colors duration-200 px-6 py-2"
                        >
                            VIEW ALL
                            <DoubleArrowRight className="ml-2 w-4 h-4 text-primary-100" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SpecialOffer;