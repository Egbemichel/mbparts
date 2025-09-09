'use client'
import React, { useState, useCallback } from 'react';
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

interface HeaderProps {
    wishlistItemCount?: number;
    isLoggedIn?: boolean;
    userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({
                                           wishlistItemCount = 0,
                                           isLoggedIn = false,
                                           userEmail = ""
                                       }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const router = useRouter(); // 👈 initialize
    const [vinInput, setVinInput] = useState("");

    const [vehicle, setVehicle] = useState({
        year: "",
        make: "",
        model: "",
    });

    const { cartCount } = useCart();

    const handleVehicleChange = useCallback((key: string, value: string) => {
        setVehicle((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleVehicleSearch = useCallback(() => {
        if (!vehicle.year || !vehicle.make || !vehicle.model) {
            // You can set an error state here or show a message
            return;
        }
        // Implement search logic here, e.g., call an API or update state
    }, [vehicle]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search logic here
        console.log('Searching for:', searchQuery);
    };

    const handleDecodeVIN = () => {
        if (!vinInput || vinInput.length < 17) {
            alert("Please enter a valid VIN (at least 17 characters).");
            return;
        }
        // Navigate to the dynamic VIN decoder page
        router.push(`/vin/${vinInput}`);
        // Close dropdown (if applicable)
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
                className="absolute left-0 right-0 top-full mt-2 w-full min-w-[16rem] bg-white rounded-md shadow-lg border border-gray-200 z-[9999]"
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
                                value={vinInput}                          // 👈 bind state
                                onChange={(e) => setVinInput(e.target.value)} // 👈 update state
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
                        {/* TODO: populate dynamically from CarQuery API */}
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

    return (
        <>
            <header className="bg-white border-gray-200 w-full">
                <div className="w-full max-w-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 mx-auto">
                    <div className="flex items-center justify-between h-16 w-full">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <div className="bg-orange-500 rounded-full p-2 mr-2">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-orange-500 font-bold text-sm">K</span>
                                    </div>
                                </div>
                                <span className="text-xl font-bold">
                                <span className="text-gray-900">KAR</span>
                                <span className="text-orange-500">PART</span>
                            </span>
                            </Link>
                        </div>

                        <div
                            className="p-0.5 border border-accent-50 rounded-sm ml-10 mr-10 flex items-center justify-between w-full max-w-2xl"
                            style={{ maxWidth: '100%' }}
                        >
                            {/* Add Vehicle Button (Visible on all screens) */}
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

                                {/* Mobile-only: User, Wishlist & Cart icons row below Add Vehicle button */}
                                <div className="flex justify-center gap-6 mt-2 sm:hidden">
                                    {/* User Icon (mobile) */}
                                    {isLoggedIn ? (
                                        <div className="flex items-center text-gray-700">
                                            <UserIcon/>
                                            {/* Optionally show email or 'Account' on mobile, or just icon */}
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

                                    {/* Wishlist Icon (mobile) */}
                                    <Link
                                        href="/wishlist"
                                        className="relative p-2 text-gray-700 hover:text-primary-100 transition-colors"
                                        aria-label="Wishlist"
                                    >
                                        <WishlistIcon/>
                                        {wishlistItemCount > 0 && (
                                            <span
                                                className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                                {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                                            </span>
                                        )}
                                        <span className="sr-only">{wishlistItemCount} items in wishlist</span>
                                    </Link>

                                    {/* Cart Icon (mobile) */}
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
                                        <span className="sr-only text-black">{cartCount} items in cart</span>
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
                            {/* Login/Register or User Menu (Desktop) */}
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


                            {/* Wishlist */}
                            <div className="hidden sm:flex items-center space-x-4">
                                <Link
                                    href="/wishlist"
                                    className="relative p-2 text-gray-700 hover:text-primary-100 transition-colors"
                                    aria-label="Wishlist"
                                >
                                    <WishlistIcon/>
                                    {wishlistItemCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                        {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                                    </span>
                                    )}
                                    <span className="sr-only">{wishlistItemCount} items in wishlist</span>
                                </Link>

                                {/* Cart */}
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
        </>
    );
};

export default Header;