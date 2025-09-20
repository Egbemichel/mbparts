"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface Category {
    id: number;
    name: string;
    slug: string;
    productCount: number;
    image: string;
    link: string;
    bgColor?: string;
}

interface FetchedCategory {
    id: number;
    name: string;
    slug: string;
    product_count?: number;
    products?: unknown[];
    first_product_image?: string;
}

interface CategoriesCarouselProps {
    title?: string;
    className?: string;
}

const PopularAccessories: React.FC<CategoriesCarouselProps> = ({
                                                                   title = "Popular Accessories",
                                                                   className = "",
                                                               }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // ✅ Fetch from accessories endpoint
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/parts/categories/accessories/children/`
                );
                const data: FetchedCategory[] = await res.json();
                const mapped = data.map((cat: FetchedCategory) => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    productCount: cat.product_count ?? cat.products?.length ?? 0,
                    image: cat.first_product_image || "/images/placeholder.png",
                    link: `/accessories/${cat.slug}`,
                }));

                // ✅ Only include categories with products
                setCategories(mapped.filter((cat: Category) => cat.productCount > 0));
            } catch (error) {
                console.error("Failed to fetch accessories categories", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className={`py-12 bg-gray-50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-left mb-1">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-primary text-gray-900">
                        {title}
                    </h2>
                </div>
                <Separator className="border-black w-full p-0.5" />

                {/* Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-6 [@media(min-width:430px)]:grid-cols-3 gap-4 mt-8">
                    {categories.map((category) => (
                        <React.Fragment key={category.id}>
                            <Link
                                href={category.link}
                                className={`flex flex-col items-center justify-center p-4 ${category.bgColor || ""} cursor-pointer`}
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={130}
                                    height={130}
                                    className="mb-2 object-contain"
                                />
                                <div className="text-base font-bold text-gray-900 text-center mb-1">
                                    {category.name}
                                </div>
                                <div className="text-xs text-gray-500 text-center">
                                    {category.productCount} product(s)
                                </div>
                            </Link>
                            <Separator className="my-2" />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularAccessories;
