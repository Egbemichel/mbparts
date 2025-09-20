// app/client-layout.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import FooterNewsletter from "@/components/FooterNewsletter";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                width: "100%",
                boxSizing: "border-box",
                paddingLeft: "0rem",
                paddingRight: "0rem",
                maxWidth: "100vw",
            }}
        >
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
        </div>
        </body>
        </html>
    );
}
