'use client';

import React, { useState } from 'react';
import { ChevronDown, Grid, List } from 'lucide-react';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import { useRouter } from 'next/navigation';
import LatestProductsWrapper from '@/components/LatestProductWrapper';
import LatestProducts from '@/components/LatestProducts';
import { Product } from "@/lib/types";

// Categories to filter
const CATEGORY_KEYS = [
    "body",
    "exterior",
    "interior",
    "audio",
    "parts",
    "performance",
    "lighting",
    "uncategorized",
];

// Sidebar Component
const Sidebar: React.FC<{
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
}> = ({ selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
    const categories = CATEGORY_KEYS.map(key => ({ id: key, label: key }));

    return (
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
                <div className="space-y-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`w-full flex justify-between items-center py-2 px-3 rounded-md text-sm transition-colors ${
                                selectedCategory === category.id
                                    ? 'bg-orange-50 text-orange-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter By Price</h3>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="3000"
                        value={priceRange[1]}
                        onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hero Banner Component
const HeroBanner: React.FC = () => (
    <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-lg p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
            <div className="text-white">
                <div className="text-orange-500 text-sm font-medium mb-2">SPECIAL OFFER</div>
                <h2 className="text-3xl font-bold mb-2">BRAKES AND<br />ROTORS FOR SALE</h2>
                <button className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors">
                    SHOP NOW
                </button>
            </div>
            <div className="text-right">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                    <div className="text-sm">Starting at</div>
                    <div className="text-2xl font-bold">$199</div>
                </div>
            </div>
        </div>
        <div className="absolute right-0 top-0 opacity-20">
            <div className="w-32 h-32 border-8 border-white rounded-full"></div>
            <div className="w-24 h-24 border-6 border-white rounded-full absolute top-4 left-4"></div>
        </div>
    </div>
);

// Toolbar Component
const Toolbar: React.FC<{
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    totalProducts: number;
}> = ({ viewMode, onViewModeChange, sortBy, onSortChange, totalProducts }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
                Showing 1-{totalProducts} of {totalProducts} results
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="default">Default sorting</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Average Rating</option>
                        <option value="newest">Newest First</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-3 pointer-events-none" />
                </div>

                <div className="flex border border-gray-300 rounded-md">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Main Shop Page
const ShopPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('default');
    const router = useRouter();

    const handleAddToCart = (product: Product) => {
        console.log(`Added product ${product.id} to cart`);
    };

    // Sorting helper
    const sortProducts = (products: Product[]) => {
        switch (sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...products].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
            case 'newest':
                return [...products].sort((a, b) => b.id - a.id);
            default:
                return products;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Go Back Button */}
            <button
                className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>

            {/* Header */}
            <div className="bg-gray-800 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-2">Shop</h1>
                <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>Home</span>
                    <span>/</span>
                    <span className="text-orange-500">Shop</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="hidden md:block">
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <HeroBanner />

                    <LatestProductsWrapper
                        title=""
                        showViewAll={false}
                    >
                        {({ products }) => {
                            // Apply category + price filters
                            let filtered = products.filter(p => {
                                if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
                                return !(p.price < priceRange[0] || p.price > priceRange[1]);
                            });
                            filtered = sortProducts(filtered);

                            return (
                                <>
                                    <Toolbar
                                        viewMode={viewMode}
                                        onViewModeChange={setViewMode}
                                        sortBy={sortBy}
                                        onSortChange={setSortBy}
                                        totalProducts={filtered.length}
                                    />
                                    <div className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                            : 'flex flex-col gap-6'
                                    }>
                                        <LatestProducts
                                            products={filtered}
                                            showViewAll={false}
                                            onAddToCart={handleAddToCart}
                                            // Add other handlers as needed
                                        />
                                    </div>
                                </>
                            );
                        }}
                    </LatestProductsWrapper>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
