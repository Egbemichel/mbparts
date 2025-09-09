'use client';
import React, { useState, useEffect, useMemo } from 'react';
import LatestProductsOriginal from './LatestProducts';
import { Product } from '@/lib/types';
import LoadingFallback from "@/components/ui/LoadingFallback";

interface LatestProductsWrapperProps {
    title?: string;
    showViewAll?: boolean;
    children?: (props: { products: Product[] }) => React.ReactNode;
}

const LatestProductsWrapper: React.FC<LatestProductsWrapperProps> = ({
                                                                         title = 'Latest Products',
                                                                         showViewAll = true,
                                                                         children,
                                                                     }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // stable API endpoint reference
    const endpoint = useMemo(() => `${process.env.NEXT_PUBLIC_API_URL}/parts/parts-public/`, []);

    useEffect(() => {
        let isMounted = true;

        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch(endpoint); // public endpoint, no auth
                if (!res.ok) throw new Error('Failed to fetch products');
                const data: Product[] = await res.json();

                //console.log(data[0].image_url);

                // Ensure all fields have fallback values
                const mapped: Product[] = data.map(p => ({
                    id: p.id,
                    name: p.name ?? '—',
                    category: p.category ?? 'uncategorized',
                    price: p.price ?? 0,
                    stars: p.stars ?? null,
                    stock_status: p.stock_status ?? false,
                    image_url: p.image_url ?? null,
                    warranty: p.warranty ?? 0,
                    delivery_days: p.delivery_days ?? 0,
                    return_days: p.return_days ?? 0,
                }));

                if (isMounted) setProducts(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchProducts();
        return () => { isMounted = false; };
    }, [endpoint]);

    if (loading) return <div className="text-center py-12"><LoadingFallback /></div>;

    if (children) {
        return <>{children({ products })}</>;
    }

    return (
        <LatestProductsOriginal
            title={title}
            products={products}
            showViewAll={showViewAll}
            onAddToCart={(product) => console.log('Add to cart:', product)}
            onAddToWishlist={(product) => console.log('Add to wishlist:', product)}
            onCompare={(product) => console.log('Compare product:', product)}
            onProductClick={(product) => console.log('View product:', product)}
            onViewAll={() => console.log('View all clicked')}
        />
    );
};

export default LatestProductsWrapper;
