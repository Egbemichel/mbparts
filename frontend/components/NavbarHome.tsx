'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import SearchIcon from "@/public/icons/SearchIcon";
import CarIcon from "@/public/icons/CarIcon";
import ArrowDownIcon from "@/public/icons/ArrowDownIcon";
import UserIcon from "@/public/icons/UserIcon";
import WishlistIcon from "@/public/icons/WishlistIcon";
import CartIcon from "@/public/icons/CartIcon";
import SecondaryNav from "@/components/SecondaryNav";
import DoubleArrowRight from "@/public/icons/DoubleArrowRight";
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Image from 'next/image';

interface HeaderProps {
    isLoggedIn?: boolean;
    userEmail?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number | null;
    // Add other properties if needed
}

const Header: React.FC<HeaderProps> = ({
                                           isLoggedIn = false,
                                           userEmail = ""
                                       }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const router = useRouter();
    const [vinInput, setVinInput] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);

    const [vehicle, setVehicle] = useState({
        year: "",
        make: "",
        model: "",
    });

    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const wishlistCount = wishlist.length;

    // ✅ Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/categories/`);
                if (!res.ok) throw new Error("Failed to load categories");
                const data = await res.json();
                setCategories(data.results || []); // ✅ only array
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // ✅ Filter parts and accessories from backend
    const partsCategories = categories
        .filter(cat => cat.parent === null && cat.slug === "parts")
        .flatMap(partsParent =>
            categories.filter(sub => sub.parent === partsParent.id)
        );

    const accessoriesCategories = categories
        .filter(cat => cat.parent === null && cat.slug === "accessories")
        .flatMap(accParent =>
            categories.filter(sub => sub.parent === accParent.id)
        );

    const handleVehicleChange = useCallback((key: string, value: string) => {
        setVehicle((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleVehicleSearch = useCallback(() => {
        if (!vehicle.year || !vehicle.make || !vehicle.model) return;
        // Implement search logic here
    }, [vehicle]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleDecodeVIN = () => {
        if (!vinInput || vinInput.length < 17) {
            alert("Please enter a valid VIN (at least 17 characters).");
            return;
        }
        router.push(`/vin/${vinInput}`);
        setShowVehicleDropdown(false);
    };

    const AddVehicleDropdown = ({
                                    show,
                                    vehicle,
                                    handleVehicleChange,
                                    handleVehicleSearch
                                }: {
        show: boolean,
        vehicle: { year: string, make: string, model: string },
        handleVehicleChange: (key: string, value: string) => void,
        handleVehicleSearch: () => void
    }) => (
        show ? (
            <div
                className="absolute left-0 right-0 top-full mt-2 w-full min-w-[16rem] bg-white border-gray-200 z-[9999] shadow-lg"
            >
                <div className="p-4 space-y-3">
                    {/* VIN Input */}
                    <div>
                        <label htmlFor="vin" className="text-xs text-gray-600">Enter VIN (17 chars)</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                id="vin"
                                type="text"
                                maxLength={17}
                                placeholder="e.g. 1HGCM82633A004352"
                                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                value={vinInput}
                                onChange={(e) => setVinInput(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleDecodeVIN}
                                className="bg-primary-50 hover:bg-primary-100 text-white px-3 rounded-md text-sm"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center my-2">
                        <div className="border-t flex-1 border-gray-200"></div>
                        <span className="text-xs text-gray-500 px-2">or</span>
                        <div className="border-t flex-1 border-gray-200"></div>
                    </div>

                    {/* Dropdowns */}
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        onChange={(e) => handleVehicleChange("year", e.target.value)}
                    >
                        <option>Select Year</option>
                    </select>

                    <select
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        onChange={(e) => handleVehicleChange("make", e.target.value)}
                        disabled={!vehicle.year}
                    >
                        <option>Select Make</option>
                    </select>

                    <select
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        onChange={(e) => handleVehicleChange("model", e.target.value)}
                        disabled={!vehicle.make}
                    >
                        <option>Select Model</option>
                    </select>

                    <button
                        onClick={handleVehicleSearch}
                        className="w-full bg-secondary-100 hover:bg-primary-100 text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 group"
                    >
                        Search
                        <DoubleArrowRight className="text-primary-100 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        ) : null
    );

    const HamburgerIcon = ({ className = "w-7 h-7" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );

    // ✅ Build sidebarNavItems dynamically from backend
    const sidebarNavItems = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        {
            label: 'Parts',
            href: '/parts',
            children: partsCategories.map(cat => ({
                label: cat.name,
                href: `/parts/${cat.slug}`
            }))
        },
        {
            label: 'Accessories',
            href: '/accessories',
            children: accessoriesCategories.map(cat => ({
                label: cat.name,
                href: `/accessories/${cat.slug}`
            }))
        },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
        { label: 'About Us', href: '/about' },
        { label: 'FAQ', href: '/faqs' },
        { label: 'Privacy Policy', href: '/' },
        { label: 'Terms', href: '/' },
    ];

    const SidebarNav = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
        const [expanded, setExpanded] = useState<string | null>(null);
        const sidebarRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!open) return;
            const handleClick = (e: MouseEvent) => {
                if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) onClose();
            };
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }, [open, onClose]);

        useEffect(() => {
            document.body.classList.toggle('overflow-hidden', open);
            return () => document.body.classList.remove('overflow-hidden');
        }, [open]);

        return (
            <div className={`fixed inset-0 z-[9999] pointer-events-none`} aria-modal="true" role="dialog">
                <div
                    className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
                    onClick={onClose}
                />
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-[10000] transform transition-transform duration-300 ease-in-out will-change-transform ${open ? 'translate-x-0 pointer-events-auto' : '-translate-x-full'}`}
                    tabIndex={-1}
                    aria-label="Sidebar navigation"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <span className="font-bold text-lg text-primary-50">Menu</span>
                        <button
                            onClick={onClose}
                            aria-label="Close sidebar"
                            className="text-gray-700 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1 px-4 py-4 overflow-y-auto max-h-full">
                        {sidebarNavItems.map(item => (
                            <div key={item.label}>
                                {/* ✅ If no children → normal link */}
                                {!item.children ? (
                                    <Link
                                        href={item.href}
                                        className="block py-2 px-2 rounded text-gray-900 font-medium hover:bg-primary-50 hover:text-white transition-colors"
                                        onClick={onClose}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <>
                                        {/* ✅ If children → button, not link */}
                                        <button
                                            type="button"
                                            onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                                            className="w-full flex justify-between items-center py-2 px-2 rounded text-gray-900 font-medium hover:bg-primary-50 hover:text-white transition-colors"
                                        >
                                            {item.label}
                                            <ArrowDownIcon
                                                className={`w-4 h-4 transition-transform duration-200 ${expanded === item.label ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        {expanded === item.label && (
                                            <div className="pl-6 transition-all duration-300 ease-in-out">
                                                {item.children.map(child => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className="block py-2 px-2 rounded text-gray-700 hover:bg-primary-30 hover:text-white transition-colors"
                                                        onClick={onClose}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        );
    };


    return (
        <>
            <header className="bg-white border-gray-200">
                <div className="w-full max-w-full px-4 sm:px-4 md:px-8 lg:px-6 mx-auto">
                    <div className="flex items-center justify-between h-16 w-full gap-2">
                        {/* Mobile Menu Button */}
                        <div className="block sm:hidden px-2">
                            <button
                                onClick={() => setShowVehicleDropdown(true)}
                                className="text-gray-700 hover:text-primary-100 transition-colors"
                                aria-label="Open menu"
                            >
                                <HamburgerIcon />
                            </button>
                        </div>
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/images/mbparts_logo.jpg"
                                    alt="KARPART Logo"
                                    width={65}
                                    height={65}
                                    className="mr-1"
                                    priority
                                />
                            </Link>
                        </div>

                        <div
                            className="p-0.5 border-accent-50 rounded-sm ml-10 mr-10 flex items-center justify-between w-full max-w-2xl"
                            style={{ maxWidth: '100%' }}
                        >
                            {/* Add Vehicle Button */}
                            <div className="block w-full max-w-xs">
                                <div className="relative w-full hidden md:block">
                                    <button
                                        onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                                        className="bg-primary-50 hover:bg-primary-100 text-white px-6 py-2.5 rounded-sm font-medium flex items-center gap-2 transition-colors duration-200 w-full justify-center"
                                        aria-expanded={showVehicleDropdown}
                                        aria-haspopup="true"
                                    >
                                        <CarIcon/>
                                        ADD YOUR VEHICLE
                                        <ArrowDownIcon/>
                                    </button>
                                    <AddVehicleDropdown
                                        show={showVehicleDropdown}
                                        vehicle={vehicle}
                                        handleVehicleChange={handleVehicleChange}
                                        handleVehicleSearch={handleVehicleSearch}
                                    />
                                </div>

                                {/* Mobile-only Icons */}
                                <div className="flex justify-center gap-8 mt-2 sm:hidden">
                                    {isLoggedIn ? (
                                        <div className="flex items-center text-gray-700">
                                            <UserIcon/>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/admin/login"
                                            className="flex items-center text-gray-700 hover:text-primary-100 transition-colors"
                                            aria-label="Login or Register"
                                        >
                                            <UserIcon/>
                                        </Link>
                                    )}

                                    <Link
                                        href="/wishlist"
                                        className="relative p-2 text-gray-700 hover:text-primary-100 transition-colors"
                                        aria-label="Wishlist"
                                    >
                                        <WishlistIcon/>
                                        {wishlistCount > 0 && (
                                            <span
                                                className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                                {wishlistCount > 99 ? '99+' : wishlistCount}
                                            </span>
                                        )}
                                        <span className="sr-only">{wishlistCount} items in wishlist</span>
                                    </Link>

                                    <Link
                                        href="/cart"
                                        className="relative p-2 text-gray-700 hover:text-primary-50 transition-colors"
                                        aria-label="Shopping cart"
                                    >
                                        <CartIcon/>
                                        {cartCount > 0 && (
                                            <span
                                                className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                                {cartCount > 99 ? '99+' : cartCount}
                                            </span>
                                        )}
                                        <span className="sr-only">{cartCount} items in cart</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="flex-1 max-w-lg mx-4 hidden md:block" style={{ maxWidth: '100%', marginLeft: 0, marginRight: 0 }}>
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for products..."
                                        className="w-full px-4 py-2.5 pr-12 border-none rounded-sm outline-none focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md text-black hover:bg-accent-50 transition-colors"
                                        aria-label="Search"
                                    >
                                        <SearchIcon/>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:block">
                                {isLoggedIn ? (
                                    <div className="flex items-center text-gray-700">
                                        <UserIcon/>
                                        <span className="text-sm">{userEmail || 'Account'}</span>
                                    </div>
                                ) : (
                                    <Link
                                        href="/admin/login"
                                        className="flex items-center text-gray-700 hover:text-primary-100 transition-colors"
                                    >
                                        <UserIcon/>
                                        <span className="text-sm font-medium">Login / Register</span>
                                    </Link>
                                )}
                            </div>

                            <div className="hidden sm:flex items-center space-x-4">
                                <Link
                                    href="/wishlist"
                                    className="relative p-2 text-gray-700 hover:text-primary-100 transition-colors"
                                    aria-label="Wishlist"
                                >
                                    <WishlistIcon/>
                                    {wishlistCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {wishlistCount > 99 ? '99+' : wishlistCount}
                                        </span>
                                    )}
                                    <span className="sr-only">{wishlistCount} items in wishlist</span>
                                </Link>

                                <Link
                                    href="/cart"
                                    className="relative p-2 text-gray-700 hover:text-primary-50 transition-colors"
                                    aria-label="Shopping cart"
                                >
                                    <CartIcon/>
                                    {cartCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                    <span className="sr-only">{cartCount} items in cart</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Click outside to close dropdown */}
                    {showVehicleDropdown && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowVehicleDropdown(false)}
                            aria-hidden="true"/>
                    )}
                </div>

                <SecondaryNav/>
            </header>

            {/* Mobile Sidebar Navigation */}
            <SidebarNav open={showVehicleDropdown} onClose={() => setShowVehicleDropdown(false)} />
        </>
    );
};

export default Header;
