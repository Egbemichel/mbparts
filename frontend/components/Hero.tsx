'use client';

import React from "react";
import Link from "next/link";
import Zap from "@/public/icons/Zap";
import ArrowRight from "@/public/icons/DoubleArrowRight";

export interface BannerCard {
    id: string;
    badgeText: string;
    discount?: string;
    title: string;
    subtitle?: string;
    description?: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
    onCtaClick?: () => void;
}

export interface PromoBanner {
    promoText: string;
    promoCode: string;
    promoDiscount: string;
    promoLink: string;
}

export interface FlexibleBannerProps {
    layout: 'hero' | 'dual-cards';
    promoBanner?: PromoBanner;
    banners: BannerCard | BannerCard[];
    className?: string;
    containerHeight?: string;
}

const FlexibleBanner: React.FC<FlexibleBannerProps> = ({
                                                           layout,
                                                           promoBanner,
                                                           banners,
                                                           className = '',
                                                           containerHeight = 'h-96 md:h-[500px]'
                                                       }) => {

    const renderPromoBanner = () => {
        if (!promoBanner || layout !== 'hero') return null;

        return (
            <div className="bg-gray-100 py-2 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 w-full">
                <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                    <Zap className="w-4 h-4 text-primary-50" />
                    <span className="text-gray-700 whitespace-nowrap">{promoBanner.promoText}</span>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">{promoBanner.promoDiscount}</span>
                    <span className="text-gray-600 hidden sm:inline">| use code</span>
                    <span className="bg-primary-30 text-primary-200 px-2 py-1 rounded font-mono text-xs font-bold whitespace-nowrap">
                        {promoBanner.promoCode}
                    </span>
                    <Link
                        href={promoBanner.promoLink}
                        className="text-primary-100 hover:text-primary-200 font-medium underline ml-0 sm:ml-2"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    };

    const renderBannerCard = (banner: BannerCard, isFullWidth: boolean = false) => {
        const handleCtaClick = (e: React.MouseEvent) => {
            if (banner.onCtaClick) {
                e.preventDefault();
                banner.onCtaClick();
            }
        };

        return (
            <div
                key={banner.id}
                className={`relative group ${isFullWidth ? containerHeight : 'h-64 md:h-80'} overflow-hidden ${!isFullWidth ? 'flex-1' : ''}`}
                style={{ width: '100%', maxWidth: isFullWidth ? '100%' : undefined }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-500 ${!isFullWidth ? 'group-hover:scale-110' : ''}`}
                        style={{ backgroundImage: `url(${banner.backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className={`absolute inset-0 ${isFullWidth ? 'bg-gradient-to-r from-black via-black/60 to-transparent' : 'bg-gradient-to-r from-black via-black/60 to-transparent'}`} />
                </div>

                <div className="relative z-10 h-full flex items-center md:ml-18 p-4">
                    <div className={isFullWidth ? 'w-full mt-2' : 'mt-2'} style={{ width: '100%' }}>
                        <div className={isFullWidth ? '' : ''} style={{ maxWidth: '100%' }}>
                            <div className="inline-flex items-center mb-4">
                <span className="bg-primary-50 text-white text-xs font-bold font-primary px-3 py-1 rounded-full uppercase tracking-wide">
                  {banner.badgeText}
                </span>
                            </div>

                            {banner.discount && (
                                <div className="mb-2">
                  <span className="text-primary-40 text-lg md:text-xl font-bold">
                    {banner.discount}
                  </span>
                                </div>
                            )}

                            <div className="mb-4">
                                <h2 className={`text-white leading-tight ${
                                    isFullWidth
                                        ? 'text-4xl md:text-6xl lg:text-7xl'
                                        : 'text-2xl md:text-3xl lg:text-4xl'
                                }`}>
                                    <div className="font-primary font-bold">{banner.title}</div>
                                    {banner.subtitle && <div className="font-primary" >{banner.subtitle}</div>}
                                </h2>
                            </div>

                            {banner.description && (
                                <p className={`text-gray-200 mb-6 font-semibold font-secondary-1 ${
                                    isFullWidth ? 'text-lg md:text-xl' : 'text-sm md:text-base'
                                }`}>
                                    {banner.description}
                                </p>
                            )}

                            <div className="flex items-center">
                                <Link
                                    href={banner.ctaLink}
                                    onClick={handleCtaClick}
                                    className={`group inline-flex items-center bg-white text-black rounded-lg font-bold font-secondary-2 tracking-wide hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 ${
                                        isFullWidth ? 'px-8 py-4 text-lg' : 'px-6 py-3 mb-4 text-xs md:text-sm'
                                    }`}
                                >
                                    {banner.ctaText}
                                    <ArrowRight className={`ml-2 text-primary-50 group-hover:translate-x-1 transition-transform duration-300 ${
                                        isFullWidth ? 'w-6 h-6' : 'w-3 h-3 md:w-4 md:h-4'
                                    }`} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (layout === 'hero') {
            const banner = Array.isArray(banners) ? banners[0] : banners;
            return renderBannerCard(banner, true);
        }

        if (layout === 'dual-cards') {
            const bannerArray = Array.isArray(banners) ? banners : [banners];
            return (
                <div className="w-full py-8 cursor-pointer">
                    <div className="flex flex-col md:flex-row gap-6 w-full">
                        {bannerArray.map(banner => renderBannerCard(banner, false))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`relative ${className}`}>
            {renderPromoBanner()}
            {renderContent()}
        </div>
    );
};

export default FlexibleBanner;
