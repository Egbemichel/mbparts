"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import FooterNewsletter from "@/components/FooterNewsletter";
import { CartProvider } from "@/components/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            paddingLeft: "2rem",
            paddingRight: "2rem",
            maxWidth: "100vw",
          }}
        >
          <QueryClientProvider client={queryClient}>
            <CartProvider>
              {children}
              <FooterNewsletter />
              <Footer />
            </CartProvider>
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}
