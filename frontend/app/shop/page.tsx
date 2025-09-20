'use client';

import React, { useState, useEffect } from 'react';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import { useRouter } from 'next/navigation';
import LatestProductsWrapper from '@/components/LatestProductWrapper';
import LatestProducts from '@/components/LatestProducts';
import { Product } from "@/lib/types";

// Sidebar Component
const Sidebar: React.FC<{
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    categories: CategoryType[];
}> = ({ selectedCategory, onCategoryChange, priceRange, onPriceChange, categories }) => {
    // Track expanded state for each category by id
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

    const toggleCategory = (id: number) => {
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderCategory = (cat: CategoryType, level = 0) => {
        const expanded = expandedCategories[cat.id] ?? true;
        return (
            <div key={cat.id} className={`ml-${level * 4}`}>
                <div className="flex items-center">
                    {Array.isArray(cat.children) && cat.children.length > 0 && (
                        <button
                            onClick={() => toggleCategory(cat.id)}
                            className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                            {expanded ? <ArrowLeftIcon className="rotate-270" /> : <ArrowLeftIcon className="rotate-180" /> }
                        </button>
                    )}
                    <button
                        onClick={() => onCategoryChange(cat.slug)}
                        className={`flex-1 text-left py-2 px-3 rounded-md text-sm transition-colors ${
                            selectedCategory === cat.slug
                                ? 'bg-orange-50 text-orange-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {cat.name}
                    </button>
                </div>
                {expanded && Array.isArray(cat.children) && cat.children.length > 0 && (
                    <div className="ml-4">
                        {cat.children.map(child => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => onCategoryChange('all')}
                        className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                            selectedCategory === 'all'
                                ? 'bg-orange-50 text-orange-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        All
                    </button>
                    {categories.map(cat => renderCategory(cat))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter By Price</h3>
                <div className="space-y-4">
                    <input
                        type="range"
                        min={0}
                        max={10000}
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

// Type for Category
type CategoryType = {
    id: number;
    name: string;
    slug: string;
    parent?: number | null;
    children?: CategoryType[];
};

// Main Shop Page
const ShopPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const router = useRouter();

    // Fetch categories from API
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/categories/`)
            .then(res => res.json())
            .then(data => {
                // Convert flat list to tree
                const map: Record<number, CategoryType> = {};
                const roots: CategoryType[] = [];
                data.results.forEach((c: CategoryType) => { map[c.id] = { ...c, children: [] }; });
                data.results.forEach((c: CategoryType) => {
                    if (c.parent) map[c.parent]?.children?.push(map[c.id]);
                    else roots.push(map[c.id]);
                });
                setCategories(roots);
            });
    }, []);

    const handleAddToCart = (product: Product) => {
        console.log(`Added product ${product.id} to cart`);
    };

    const getOrdering = (sort: string) => {
        switch (sort) {
            case 'price-low': return 'price';
            case 'price-high': return '-price';
            case 'rating': return '-stars';
            case 'newest': return '-id';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <button
                className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>

            <div className="bg-gray-800 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-2">Shop</h1>
                <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>Home</span>
                    <span>/</span>
                    <span className="text-orange-500">Shop</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                <div className="hidden md:block">
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        categories={categories}
                    />
                </div>

                <div className="flex-1">
                    <LatestProductsWrapper
                        title=""
                        showViewAll={false}
                        category={selectedCategory}
                        priceRange={priceRange}
                        sortBy={getOrdering('')}
                    >
                        {({ products }) => (
                            <LatestProducts
                                products={products}
                                showViewAll={false}
                                onAddToCart={handleAddToCart}
                            />
                        )}
                    </LatestProductsWrapper>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
