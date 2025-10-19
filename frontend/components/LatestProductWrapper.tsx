'use client';

import React, { useState, useEffect, useMemo } from 'react';
import LatestProductsOriginal from './LatestProducts';
import { Product } from '@/lib/types';
import { useFetchWithLoading } from '@/lib/fetchWithLoading';
import ArrowLeftIcon from '../public/icons/ArrowLeftIcon';
import ArrowRightIcon from '../public/icons/ArrowRightIcon';

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

    // Helper to generate pagination range with ellipsis
    const getPaginationRange = () => {
        const delta = 1; // how many neighbors to show
        const range = [];
        const rangeWithDots = [];
        let l;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                range.push(i);
            }
        }
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l > 2) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    };

    const pagination = (
        <div className="flex justify-center items-center gap-2 mt-8 overflow-x-auto flex-nowrap scrollbar-hide">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 flex items-center justify-center"
                aria-label="Previous page"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            {getPaginationRange().map((p, idx) =>
                p === '...'
                    ? <span key={idx} className="px-2 text-gray-400">...</span>
                    : <button
                        key={p}
                        onClick={() => handlePageChange(Number(p))}
                        className={`px-3 py-1 rounded ${page === p ? 'bg-primary-50 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {p}
                    </button>
            )}
            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 flex items-center justify-center"
                aria-label="Next page"
            >
                <ArrowRightIcon className="w-5 h-5" />
            </button>
        </div>
    );

    if (products.length === 0) return <p className="text-center py-12">No products available.</p>;

    if (children) {
        return (
            <>
                {children({ products })}
                {pagination}
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
            {pagination}
        </>
    );
};

export default LatestProductsWrapper;
