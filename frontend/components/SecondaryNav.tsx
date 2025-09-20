"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ArrowDownIcon from "@/public/icons/ArrowDownIcon";
import Phone from "@/public/icons/Phone";

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
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({
                                                       phoneNumber = "+1 (650) 431-7498",
                                                   }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/categories/`);
                const data = await res.json();
                if (data && data.results) {
                    setCategories(data.results);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

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

    return (
        <>
            {/* Desktop Navigation */}
            <nav
                ref={navRef}
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
                </div>
            </div>
        </>
    );
};

export default SecondaryNav;
