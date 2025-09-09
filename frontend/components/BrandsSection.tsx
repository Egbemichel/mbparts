import React from 'react';
import Image from "next/image";

const brands = [
    { name: 'Hyundai', image: '/images/hyundai_logo.png', alt: 'Hyundai logo' },
    { name: 'Mercedes-Benz', image: '/images/mercedes_logo.png', alt: 'Mercedes logo' },
    { name: 'Mazda', image: '/images/mazda_logo.png', alt: 'Mazda logo' },
    { name: 'Honda', image: '/images/honda_logo.png', alt: 'Honda logo' },
    { name: 'BMW', image: '/images/bmw_logo.png', alt: 'BMW logo' },
    { name: 'Chevrolet', image: '/images/chevrolet_logo.png', alt: 'Chevrolet logo' },
    { name: 'Toyota', image: '/images/toyota_logo.png', alt: 'Toyota logo' },
    { name: 'Ford', image: '/images/ford_logo.png', alt: 'Ford logo' },
    // Add more brands here as needed
];

const BrandSection: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Automotive Brands Section */}
            <div className="bg-gray-50 py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
                        {brands.map((brand, idx) => {
                            // Calculate if this is the last column for border logic
                            const isLastCol = (idx + 1) % 8 === 0;
                            return (
                                <div
                                    key={brand.name + idx}
                                    className={`bg-white flex items-center justify-center min-h-[120px] lg:min-h-[180px] border-t border-l border-gray-200 ${isLastCol ? '' : 'border-r'}`}
                                    style={{ borderBottom: '1px solid #e5e7eb', minWidth: '140px', height: '168px'}}
                                >
                                    <div className="text-center">
                                        <Image
                                            src={brand.image}
                                            alt={brand.alt}
                                            width={120}
                                            height={120}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandSection;