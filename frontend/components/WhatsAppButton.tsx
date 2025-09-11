// components/WhatsAppButton.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SHOP_PHONE; // replace with your WhatsApp number

const WhatsAppButton: React.FC = () => {
    const pathname = usePathname();

    // Hide button on checkout or admin login pages
    if (pathname === "/checkout" || pathname === "/admin/login") {
        return null;
    }

    const handleClick = () => {
        const message = "Hi! I want to inquire about MB Parts Assembly.";
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors z-50"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={24} />
        </button>
    );
};

export default WhatsAppButton;
