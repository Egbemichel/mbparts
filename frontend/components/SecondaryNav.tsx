import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ArrowDownIcon from "@/public/icons/ArrowDownIcon";
import Phone from "@/public/icons/Phone";

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
    navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
    {
        label: 'HOME',
        href: '/',
        hasDropdown: false,
    },
    {
        label: 'SHOP',
        href: '/shop',
        hasDropdown: false,
    },
    {
        label: 'BLOG',
        href: '/blog',
        hasDropdown: false,
    },
    {
        label: 'PAGE',
        href: '/pages',
        hasDropdown: true,
        dropdownItems: [
            { label: 'About Us', href: '/about', description: 'Learn about our company' },
            { label: 'FAQ', href: '/faqs', description: 'Frequently asked questions' },
        ]
    },
    {
        label: 'CONTACT',
        href: '/contact',
        hasDropdown: false,
    }
];

const SecondaryNav: React.FC<SecondaryNavProps> = ({
                                                       phoneNumber = '(888) 910-2390',
                                                       navItems = defaultNavItems
                                                   }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

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
            if (event.key === 'Escape') {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav
                ref={navRef}
                role="navigation"
                aria-label="Secondary navigation"
                className="bg-slate-700 text-white relative rounded-sm"
            >
                {/* nav itself has the colored background and is exactly the content width */}
                <div className="flex items-center justify-between md:h-14 px-4 sm:px-6 lg:px-8">
                    {/* Navigation Items */}
                    <div className="space-x-8 hidden md:flex items-center">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => (item.hasDropdown ? handleMouseEnter(item.label) : undefined)}
                                onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-1 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none ${
                                        activeDropdown === item.label ? "text-primary-40" : "text-white hover:text-primary-40"
                                    }`}
                                    aria-expanded={item.hasDropdown ? activeDropdown === item.label : undefined}
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

                                {/* Dropdown menu (positioned relative to the item container) */}
                                {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
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
                                                {d.description && <div className="text-xs text-gray-500 mt-1">{d.description}</div>}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div className="hidden md:flex items-center space-x-2 text-sm">
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

                    {/* Mobile contact */}
                    <div className="md:hidden">
                        <a
                            href={`tel:${phoneNumber.replace(/[^\d]/g, "")}`}
                            className="text-primary-40 font-semibold hover:text-primary-30 transition-colors duration-200 flex items-center space-x-1 text-sm"
                            aria-label={`Call us at ${phoneNumber}`}
                        >
                            <span className="hidden sm:inline">{phoneNumber}</span>
                        </a>
                    </div>
                </div>

                {/* Mobile nav row (still constrained inside the same centered container) */}
                <div className="md:hidden">
                    <div className="flex flex-wrap gap-4 py-2 border-t border-slate-600 px-4 sm:px-6">
                        {navItems.map((item) => (
                            <React.Fragment key={item.label}>
                                <div className="flex items-center">
                                    <Link
                                        href={item.href}
                                        className="text-sm font-medium text-white hover:text-primary-40 transition-colors duration-200"
                                    >
                                        {item.label}
                                    </Link>
                                    {item.hasDropdown && (
                                        <button
                                            type="button"
                                            aria-label={`Toggle ${item.label} dropdown`}
                                            className="ml-1 focus:outline-none"
                                            onClick={() => setMobileDropdownOpen(mobileDropdownOpen === item.label ? null : item.label)}
                                        >
                                            <ArrowDownIcon className={`w-4 h-4 transition-transform duration-200 ${mobileDropdownOpen === item.label ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}
                                </div>
                                {/* Render dropdown items for mobile if present and open */}
                                {item.hasDropdown && item.dropdownItems && mobileDropdownOpen === item.label && (
                                    <div className="pl-6 flex flex-col gap-1 w-full">
                                        {item.dropdownItems.map((d) => (
                                            <Link
                                                key={d.href}
                                                href={d.href}
                                                className="text-xs font-medium text-white/80 hover:text-primary-40 transition-colors duration-200 py-1"
                                            >
                                                {d.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </nav>
            <div className="md:hidden">
                <div className="bg-slate-800 px-4 py-2 text-center border-t border-slate-600 rounded-b-sm">
                    <span className="text-gray-300 text-sm">Contact our product expert: </span>
                    <a
                        href={`tel:${phoneNumber.replace(/[^\d]/g, "")}`}
                        className="text-primary-40 font-semibold hover:text-primary-30 transition-colors duration-200"
                    >
                        {phoneNumber}
                    </a>
                </div>
            </div>
        </>
    );
};

export default SecondaryNav;

