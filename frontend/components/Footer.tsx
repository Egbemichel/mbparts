"use client";
import React from 'react';
import { ChevronUp } from 'lucide-react';

interface FooterLink {
    label: string;
    href: string;
}

const SimpleFooter: React.FC = () => {
    const footerLinks: FooterLink[] = [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Sitemap", href: "/sitemap" }
    ];

    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-white border-t border-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    {/* Copyright */}
                    <div className="text-gray-500 text-sm order-2 md:order-1">
                        Copyright © {currentYear} <span className="text-orange-500 font-medium">Karpart</span>. All rights reserved
                    </div>

                    {/* Go To Top Button */}
                    <div className="order-1 md:order-2">
                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-gray-600 transition-colors duration-200 group"
                        >
                            <span className="text-sm font-medium hover:text-primary-50">Go To Top</span>
                            <ChevronUp className="w-4 h-4 text-primary-50 transform group-hover:-translate-y-0.5 transition-transform duration-200" />
                        </button>
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center space-x-6 order-3 md:order-3">
                        {footerLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="text-gray-500 text-sm hover:text-gray-700 underline transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SimpleFooter;