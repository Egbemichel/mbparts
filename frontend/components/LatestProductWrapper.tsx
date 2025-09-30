'use client';

import React, { useState, useEffect, useMemo } from 'react';
import LatestProductsOriginal from './LatestProducts';
import { Product } from '@/lib/types';
import { useFetchWithLoading } from '@/lib/fetchWithLoading';

interface LatestProductsWrapperProps {
    title?: string;
    showViewAll?: boolean;
    category?: string;          // "all" by default
    priceRange?: [number, number]; // [0, 999999]
    sortBy?: string;            // "default" means skip ordering
    children?: (props: { products: Product[] }) => React.ReactNode;
}

interface PaginatedResponse {
    results: Product[];
    count: number;
    next?: string;
    previous?: string;
}

const LatestProductsWrapper: React.FC<LatestProductsWrapperProps> = ({
                                                                         title = 'Featured Products',
                                                                         showViewAll = false,
                                                                         category = 'all',
                                                                         priceRange = [0, 999999],
                                                                         sortBy = 'default',
                                                                         children,
                                                                     }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalCount, setTotalCount] = useState(0);
    const endpoint = useMemo(() => `${process.env.NEXT_PUBLIC_API_URL}/parts/parts-public/`, []);
    const fetchWithLoading = useFetchWithLoading();

    useEffect(() => {
        let mounted = true;
        async function fetchProducts() {
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    page_size: pageSize.toString(),
                });
                if (category && category.toLowerCase() !== "all") {
                    params.append("new_category", category);
                }
                if (priceRange[0] > 0) params.append("min_price", priceRange[0].toString());
                if (priceRange[1] < 999999) params.append("max_price", priceRange[1].toString());
                if (sortBy && sortBy !== "default") params.append("ordering", sortBy);

                const res = await fetchWithLoading(() => fetch(`${endpoint}?${params}`));
                if (!res.ok) throw new Error('Failed to fetch products');
                const data: PaginatedResponse = await res.json();
                if (mounted) {
                    setProducts(data.results);
                    setTotalCount(data.count);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchProducts();
        return () => { mounted = false; };
    }, [endpoint, page, pageSize, category, priceRange, sortBy, fetchWithLoading]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    if (products.length === 0) return <p className="text-center py-12">No products available.</p>;

    if (children) {
        return (
            <>
                {children({ products })}
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >Previous</button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-primary-50 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >Next</button>
                </div>
            </>
        );
    }

    return (
        <>
            <LatestProductsOriginal
                title={title}
                products={products}
                showViewAll={showViewAll}
                onAddToCart={(product) => console.log('Add to cart:', product)}
                onCompare={(product) => console.log('Compare product:', product)}
                onViewAll={() => console.log('View all clicked')}
            />
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                >Previous</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-primary-50 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                >Next</button>
            </div>
        </>
    );
};

export default LatestProductsWrapper;
