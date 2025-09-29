"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import FooterNewsletter from "@/components/FooterNewsletter";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LoadingProvider, useLoading } from "@/components/LoadingContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFetchWithLoading } from "@/lib/fetchWithLoading";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const fetchWithLoading = useFetchWithLoading();

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!sessionStorage.getItem("visitorAlertSent")) {
                fetchWithLoading("/api/visitor-alert", { method: "POST" });
                sessionStorage.setItem("visitorAlertSent", "true");
            }
        }
    }, [fetchWithLoading]);

    return (
        <LoadingProvider>
            <LoadingConsumer>{children}</LoadingConsumer>
        </LoadingProvider>
    );
}

function LoadingConsumer({ children }: { children: React.ReactNode }) {
    const { loading } = useLoading();
    const [queryClient] = useState(() => new QueryClient());

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
                    <LoadingSpinner />
                </div>
            )}
            <QueryClientProvider client={queryClient}>
                <WishlistProvider>
                    <CartProvider>
                        {children}
                        <WhatsAppButton />
                        <FooterNewsletter />
                        <Footer />
                    </CartProvider>
                </WishlistProvider>
            </QueryClientProvider>
        </>
    );
}
