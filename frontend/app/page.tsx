"use client";
import NavbarHome from "@/components/NavbarHome";
import React from "react";
import {HeroBanner} from "@/components/HeroBanner";
import {DualCardsBanner} from "@/components/DualCard";
import CarPartCarrousel from "@/components/CarPartCarrousel";
import LatestProductWrapper from "@/components/LatestProductWrapper";
import PaymentCarousel from "@/components/PaymentCarrousel";
import PopularAccessories from "@/components/PopularAccessories";

export const dynamic = 'force-dynamic';

function SEOContent() {
    return (
        <section className="prose max-w-4xl mx-auto px-4 py-12">
            <h1>Mercedes Benz Parts – OEM & Quality Accessories</h1>
            <h2>Your Trusted Source for Genuine Mercedes Benz Parts</h2>
            <p>
                At <strong>MB Parts Assembly</strong>, we specialize in supplying genuine{" "}
                <strong>Mercedes Benz parts</strong> and accessories that keep your vehicle
                performing at its best. Whether you drive a classic model or the latest
                Mercedes-Benz, finding the right OEM parts is essential for safety,
                reliability, and long-term value.
            </p>
            <p>
                Our catalog includes a wide range of components:{" "}
                <em>engine parts, brake systems, suspension kits, electrical modules,
                    body panels, and interior accessories</em>. All our products undergo strict
                quality checks to ensure compatibility with your vehicle.
            </p>
            <p>
                Why choose MB Parts Assembly? Because we combine{" "}
                <strong>affordable Mercedes Benz parts</strong> with expert support,
                VIN compatibility checks, and fast worldwide shipping. Our mission is to
                provide every Mercedes owner with the confidence of using trusted, durable,
                and authentic components.
            </p>
            <p>
                Explore our collection today and discover why thousands of customers rely
                on us for their <strong>Mercedes Benz parts</strong> and accessories.
            </p>
        </section>
    );
}

export default function Home() {
    return (
        <div>
            <NavbarHome />
            <HeroBanner />
            <DualCardsBanner />
            <CarPartCarrousel />
            <PopularAccessories />
            <LatestProductWrapper />
            <SEOContent />  {/* ✅ Adds keyword-rich content */}
            <PaymentCarousel />
        </div>
    );
}
