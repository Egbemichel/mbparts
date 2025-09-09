"use client";
import React, { useEffect, useState } from "react";
import VisaIcon from "@/public/icons/logos/Visa";
import MastercardIcon from "@/public/icons/logos/Mastercard";
import PaypalIcon from "@/public/icons/logos/Paypal";
import ApplepayIcon from "@/public/icons/logos/Applepay";
import ZelleIcon from "@/public/icons/logos/Zelle";
import ChimeIcon from "@/public/icons/logos/Chime";
import CashappIcon from "@/public/icons/logos/Cashapp";
import BitcoinIcon from "@/public/icons/logos/Bitcoin";
import {Separator} from "@/components/ui/separator";

interface PaymentLogo {
    name: string;
    svg: React.ReactNode;
}

const PaymentCarousel: React.FC = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    const logoClass = isDesktop ? "text-accent-50" : "text-black";
    const paymentLogos: PaymentLogo[] = [
        { name: "Visa", svg: <VisaIcon className={`w-[70px] h-full ${logoClass} hover:text-black `} /> },
        { name: "Mastercard", svg: <MastercardIcon className={`w-[70px] h-full ${logoClass} hover:text-black `} /> },
        { name: "PayPal", svg: <PaypalIcon className={`w-[60px] mt-6 h-full ${logoClass} hover:text-black `} /> },
        { name: "Apple Pay", svg: <ApplepayIcon className={`w-[70px] mt-6 h-full ${logoClass} hover:text-black `} /> },
        { name: "Zelle", svg: <ZelleIcon className={`w-[70px] h-full mt-1 ${logoClass} hover:text-black `} /> },
        { name: "Chime", svg: <ChimeIcon className={`w-[70px] h-full ${logoClass} hover:text-black `} /> },
        { name: "Cash App", svg: <CashappIcon className={`w-[45px] mt-1 h-full ${logoClass} hover:text-black `} /> },
        { name: "Bitcoin", svg: <BitcoinIcon className={`w-[45px] mt-1 h-full ${logoClass} hover:text-black `} /> },
    ];

    // Infinite spinning animation for desktop
    // Duplicate logos for seamless loop
    const duplicatedLogos = [...paymentLogos, ...paymentLogos];

    return (
        <div className="w-full overflow-hidden bg-white py-8">
            {/* Desktop: one logo at a time */}
            <div className="hidden md:block">
                <div className="overflow-hidden w-full">
                    <div className="flex animate-scroll">
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={`${logo.name}-${index}`}
                                className="flex-shrink-0 mx-4 group cursor-pointer"
                            >
                                <div className="w-24 h-12 flex items-center justify-center">
                                    {logo.svg}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Separator className="bg-primary-100 mt-20 py-[1px]" />
            </div>

            {/* Mobile: scrollable */}
            <div className="md:hidden">
                <div className="flex overflow-x-auto no-scrollbar gap-4 px-4">
                    {paymentLogos.map((logo) => (
                        <div key={logo.name} className="flex-shrink-0 flex justify-center">
                            <div className="w-24 h-12 flex items-center justify-center">{logo.svg}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .animate-scroll {
            animation: none;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default PaymentCarousel;
