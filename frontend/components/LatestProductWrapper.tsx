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
                if (!res.ok) {
                    console.error('Failed to fetch products', res.status);
                    if (mounted) {
                        setProducts([]);
                        setTotalCount(0);
                    }
                    return;
                }
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
    const getPaginationRange = (): (number | '...')[] => {
        const DOTS = '...' as const;
        const siblingCount = 1; // number of pages to show around current
        const total = totalPages;

        const range = (start: number, end: number) => {
            const res: number[] = [];
            for (let i = start; i <= end; i++) res.push(i);
            return res;
        };

        if (total === 0) return [];

        // total page numbers to show without dots
        const totalPageNumbers = siblingCount * 2 + 5;

        // If the number of pages is small, show all
        if (total <= totalPageNumbers) {
            return range(1, total);
        }

        const leftSiblingIndex = Math.max(page - siblingCount, 1);
        const rightSiblingIndex = Math.min(page + siblingCount, total);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < total - 1;

        // Only right dots
        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            return [...range(1, leftItemCount), DOTS, total];
        }

        // Only left dots
        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            return [1, DOTS, ...range(total - rightItemCount + 1, total)];
        }

        // Both sides dots
        return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, total];
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
                    ? <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    : <button
                        key={`page-${p}`}
                        onClick={() => handlePageChange(Number(p))}
                        className={`px-3 py-1 rounded ${page === Number(p) ? 'bg-primary-50 text-white' : 'bg-gray-100 text-gray-700'}`}
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
