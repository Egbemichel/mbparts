"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import ArrowDownIcon from "@/public/icons/ArrowDownIcon";
import Phone from "@/public/icons/Phone";
import { useGlobalSearch, ProductResult, CategoryResult } from "@/components/useGlobalSearch";
import SearchIcon from "@/public/icons/SearchIcon";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number | null;
    description?: string;
}

interface NavItem {
    label: string;
    href: string;
    hasDropdown?: boolean;
    dropdownItems?: {
        label: string;
        href: string;
        description?: string;
    }[];
}

interface SecondaryNavProps {
    phoneNumber?: string;
    categories: Category[];
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({
    phoneNumber = "+1 (650) 431-7498",
    categories,
}) => {
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        activeTab,
        setActiveTab,
        isLoading,
        hasSearched,
        overlayRef,
        handleSearchOverlay,
        showSearchOverlay,
        setShowSearchOverlay,
    } = useGlobalSearch();

    // Build dropdown items from categories
    const partsParent = categories.find((cat) => cat.slug === "parts");
    const accessoriesParent = categories.find((cat) => cat.slug === "accessories");

    const partsDropdownItems =
        partsParent && categories.length > 0
            ? categories
                .filter((cat) => cat.parent === partsParent.id)
                .map((cat) => ({
                    label: cat.name,
                    href: `/parts/${cat.slug}`,
                }))
            : [];

    const accessoriesDropdownItems =
        accessoriesParent && categories.length > 0
            ? categories
                .filter((cat) => cat.parent === accessoriesParent.id)
                .map((cat) => ({
                    label: cat.name,
                    href: `/accessories/${cat.slug}`,
                }))
            : [];

    const navItems: NavItem[] = [
        { label: "HOME", href: "/", hasDropdown: false },
        { label: "SHOP", href: "/shop", hasDropdown: false },
        {
            label: "PARTS",
            href: "/parts",
            hasDropdown: true,
            dropdownItems: partsDropdownItems,
        },
        {
            label: "ACCESSORIES",
            href: "/accessories",
            hasDropdown: true,
            dropdownItems: accessoriesDropdownItems,
        },
    ];

    const handleMouseEnter = (label: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveDropdown(label);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    const handleDropdownMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleDropdownMouseLeave = () => {
        setActiveDropdown(null);
    };

    // Close dropdown on escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent background scrolling when search overlay is open
    useEffect(() => {
        if (showSearchOverlay) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [showSearchOverlay]);

    return (
        <div ref={navRef} className="relative">
            {/* Desktop Navigation */}
            <nav
                role="navigation"
                aria-label="Secondary navigation"
                className="bg-slate-700 text-white relative hidden md:block"
            >
                <div className="flex items-center justify-between md:h-14 px-4 sm:px-6 lg:px-8">
                    {/* Navigation Items */}
                    <div className="space-x-8 flex items-center">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() =>
                                    item.hasDropdown ? handleMouseEnter(item.label) : undefined
                                }
                                onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-1 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none ${
                                        activeDropdown === item.label
                                            ? "text-primary-40"
                                            : "text-white hover:text-primary-40"
                                    }`}
                                    aria-expanded={
                                        item.hasDropdown ? activeDropdown === item.label : undefined
                                    }
                                    aria-haspopup={item.hasDropdown ? "true" : undefined}
                                >
                                    <span>{item.label}</span>
                                    {item.hasDropdown && (
                                        <ArrowDownIcon
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                activeDropdown === item.label ? "rotate-180" : ""
                                            }`}
                                        />
                                    )}
                                </Link>
                                {/* Dropdown menu */}
                                {item.hasDropdown &&
                                    activeDropdown === item.label &&
                                    item.dropdownItems &&
                                    item.dropdownItems.length > 0 && (
                                        <div
                                            className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                                            onMouseEnter={handleDropdownMouseEnter}
                                            onMouseLeave={handleDropdownMouseLeave}
                                            role="menu"
                                            aria-labelledby={`${item.label.toLowerCase()}-menu`}
                                        >
                                            {item.dropdownItems.map((d) => (
                                                <Link
                                                    key={d.href}
                                                    href={d.href}
                                                    className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-primary-100 transition-colors duration-150"
                                                    role="menuitem"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    <div className="font-medium text-sm">{d.label}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                    {/* Contact Info */}
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-300">Contact our product expert:</span>
                        <a
                            href={`tel:${phoneNumber.replace(/[^\d]/g, "")}`}
                            className="text-primary-40 font-semibold hover:text-primary-30 transition-colors duration-200 flex items-center space-x-1"
                            aria-label={`Contact us at ${phoneNumber}`}
                        >
                            <Phone className="w-4 h-4" />
                            <span>{phoneNumber}</span>
                        </a>
                    </div>
                </div>
            </nav>
            {/* Mobile VIN Identification Section */}
            <div className="md:hidden bg-white px-4 py-4">
                <div className="max-w-md mx-auto">
                    <h1 className="flex items-center justify-center p-6 text-secondary-100 text-[30px]">
                        Mercedes-Benz OEM Parts and Accessories
                    </h1>
                    {/* Mobile Search Bar */}
                    <form onSubmit={(e) => { handleSearchOverlay(e); }} className="relative mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded outline-none focus:outline-none"
                            onFocus={() => setShowSearchOverlay(true)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md text-black hover:bg-accent-50 transition-colors"
                            aria-label="Search"
                        >
                            <SearchIcon/>
                        </button>
                    </form>
                    <label
                        htmlFor="vin-mobile"
                        className="block text-slate-900 text-sm mb-2"
                    >
                        Enter VIN (17 chars)
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="vin-mobile"
                            type="text"
                            maxLength={17}
                            placeholder="e.g. 1HGCM82633A004352"
                            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <button
                            type="button"
                            className="bg-primary-50 hover:bg-primary-100 text-white px-3 rounded-md text-sm"
                        >
                            Search
                        </button>
                    </div>
                    {/* Search Overlay for mobile */}
                    {showSearchOverlay && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 " style={{ transition: 'opacity 0.3s' }}>
                            <div ref={overlayRef} className="bg-white shadow-lg w-full max-w-2xl mx-auto p-6 relative animate-slideInLeft">
                                <form onSubmit={(e) => handleSearchOverlay(e)} className="relative mb-6 border rounded-full ">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full px-4 py-2.5 pr-12 border-none rounded-sm outline-none focus:outline-none"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-0.5 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:bg-gray-700 bg-accent-50 rounded-full transition-colors"
                                        aria-label="Search"
                                    >
                                        <SearchIcon/>
                                    </button>
                                </form>
                                <button
                                    className="absolute top-1 right-1.5 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowSearchOverlay(false)}
                                    aria-label="Close search overlay"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex gap-4 mb-4">
                                    <button className={`px-4 py-2 font-semibold ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveTab('products')}>Products</button>
                                    <button className={`px-4 py-2 font-semibold ${activeTab === 'categories' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveTab('categories')}>Categories</button>
                                </div>
                                <div className="min-h-[200px] flex flex-col items-center justify-center">
                                    {/* Make results scrollable */}
                                    <div className="w-full max-h-[70vh] overflow-y-auto">
                                        {isLoading ? (
                                            <div><LoadingSpinner /></div>
                                        ) : !hasSearched ? (
                                            <Image src="/images/rafiki.svg" alt="Empty search" width={260} height={260} className="mb-4" />
                                        ) : (
                                            <>
                                                {activeTab === 'products' && (
                                                    <>
                                                        <div className="w-full text-sm text-gray-600 mb-2">{searchResults.productCount} product{searchResults.productCount === 1 ? '' : 's'} found</div>
                                                        {searchResults.products.length > 0 ? (
                                                            <ul className="w-full">
                                                                {searchResults.products.map((product: ProductResult) => (
                                                                    <li key={product.id} className="p-4 border-b flex gap-4 items-center">
                                                                        <div className="flex-shrink-0">
                                                                            <Image src={product.image_url || '/images/rafiki.svg'} alt={product.name} width={160} height={160} className="rounded" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <Link href={`/product/${product.slug}`} className="text-orange-600 font-semibold text-lg">{product.name}</Link>
                                                                            <div className="text-sm text-gray-500">{product.category_name || product.category}</div>
                                                                            <div className="text-base font-bold text-gray-900">
                                                                                ${!isNaN(Number(product.price)) ? Number(product.price).toFixed(2) : product.price}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">{product.stock_status ? 'In Stock' : 'Out of Stock'}</div>
                                                                            <div className="text-xs text-gray-500">Warranty: {product.warranty} months</div>
                                                                            <div className="text-xs text-gray-500">Delivery: {product.delivery_days} days</div>
                                                                            <div className="text-xs text-gray-500">Return: {product.return_days} days</div>
                                                                            {product.description && <div className="text-xs text-gray-400 mt-1">{product.description}</div>}
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : <div className="text-gray-500">No products found.</div>}
                                                        <div className="flex justify-between mt-4">
                                                            {searchResults.previous && (
                                                                <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" onClick={() => handleSearchOverlay(undefined, searchResults.previous!)}>Previous</button>
                                                            )}
                                                            {searchResults.next && (
                                                                <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 ml-auto" onClick={() => handleSearchOverlay(undefined, searchResults.next!)}>Next</button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                {activeTab === 'categories' && (
                                                    <>
                                                        <div className="w-full text-sm text-gray-600 mb-2">{searchResults.categoryCount} categor{searchResults.categoryCount === 1 ? 'y' : 'ies'} found</div>
                                                        {searchResults.categories.length > 0 ? (
                                                            <ul className="w-full">
                                                                {searchResults.categories.map((category: CategoryResult) => (
                                                                    <li key={category.id} className="p-2 border-b">
                                                                        <Link href={`/parts/${category.slug}`} className="text-orange-600 font-semibold">{category.name}</Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : <div className="text-gray-500">No categories found.</div>}
                                                        <div className="flex justify-between mt-4">
                                                            {searchResults.previous && (
                                                                <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" onClick={() => handleSearchOverlay(undefined, searchResults.previous!)}>Previous</button>
                                                            )}
                                                            {searchResults.next && (
                                                                <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 ml-auto" onClick={() => handleSearchOverlay(undefined, searchResults.next!)}>Next</button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecondaryNav;
