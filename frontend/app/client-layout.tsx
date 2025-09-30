"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import FooterNewsletter from "@/components/FooterNewsletter";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useFetchWithLoading } from "@/lib/fetchWithLoading";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const fetchWithLoading = useFetchWithLoading();

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!sessionStorage.getItem("visitorAlertSent")) {
                fetchWithLoading(() => fetch("/api/visitor-alert", { method: "POST" }));
                sessionStorage.setItem("visitorAlertSent", "true");
            }
        }
    }, [fetchWithLoading]);

    return (
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                <WishlistProvider>
                    {children}
                    <WhatsAppButton />
                    <FooterNewsletter />
                    <Footer />
                </WishlistProvider>
            </CartProvider>
        </QueryClientProvider>
    );
}
