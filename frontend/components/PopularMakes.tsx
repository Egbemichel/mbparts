'use client';

import React, { useState } from 'react';
import Image from "next/image";

interface CarMake {
    id: string;
    name: string;
    image: string;
    link: string;
    modelsCount?: number;
}

interface PopularMakesProps {
    title?: string;
    makes?: CarMake[];
    className?: string;
    backgroundImage?: string;
    onMakeClick?: (make: CarMake) => void;
}

const defaultMakes: CarMake[] = [
    {
        id: 'audi',
        name: 'Audi',
        image: '/images/audi.png',
        link: '/',
        modelsCount: 45
    },
    {
        id: 'bmw',
        name: 'BMW',
        image: '/images/bmw.png',
        link: '/',
        modelsCount: 52
    },
    {
        id: 'mercedes',
        name: 'Mercedes',
        image: '/images/mercedes.png',
        link: '/',
        modelsCount: 38
    },
    {
        id: 'porsche',
        name: 'Porsche',
        image: '/images/porsche.png',
        link: '/',
        modelsCount: 28
    },
    {
        id: 'volvo',
        name: 'Volvo',
        image: '/images/volvo.png',
        link: '/',
        modelsCount: 34
    },
    {
        id: 'peugeot',
        name: 'Peugeot',
        image: '/images/peugeot.png',
        link: '/',
        modelsCount: 29
    },
    {
        id: 'renault',
        name: 'Renault',
        image: '/images/renault.png',
        link: '/',
        modelsCount: 31
    },
    {
        id: 'skoda',
        name: 'Skoda',
        image: '/images/skoda.png',
        link: '/',
        modelsCount: 23
    },
    {
        id: 'lexus',
        name: 'Lexus',
        image: '/images/lexus.png',
        link: '/',
        modelsCount: 27
    },
    {
        id: 'hyundai',
        name: 'Hyundai',
        image: '/images/hyundai.png',
        link: '/',
        modelsCount: 41
    }
];

const PopularMakes: React.FC<PopularMakesProps> = ({
                                                       title = "Popular Makes",
                                                       makes = defaultMakes,
                                                       className = '',
                                                       backgroundImage = '/images/car-seat.jpg',
                                                       onMakeClick
                                                   }) => {
    const [hoveredMake, setHoveredMake] = useState<string | null>(null);

    const handleMakeClick = (make: CarMake) => {
        if (onMakeClick) {
            onMakeClick(make);
        } else {
            // Default behavior - navigate to the link
            window.location.href = make.link;
        }
    };

    return (
        <section className={`relative py-4 overflow-hidden ${className} rounded-2xl`}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 ">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-slate-800/60 bg-opacity-90" />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-slate-800 to-slate-700 opacity-80" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
                    {/* Title */}
                    <div className="text-center mb-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            {title}
                        </h2>
                    </div>

                    {/* Makes Grid */}
                    <div className="bg-transparent p-6 md:p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 rounded-2xl">
                            {makes.map((make, index) => {
                                // Calculate if this is the last column or last row for border logic
                                const isLastCol = (index + 1) % 5 === 0;
                                const isLastRow = index >= makes.length - (makes.length % 5 || 5);
                                return (
                                    <div
                                        key={make.id}
                                        className={`relative cursor-pointer transition-all duration-300 group
                        border-gray-200
                        ${!isLastCol ? 'border-r' : ''}
                        ${!isLastRow ? 'border-b' : ''}
                        border
                        bg-white
                    `}
                                        onMouseEnter={() => setHoveredMake(make.id)}
                                        onMouseLeave={() => setHoveredMake(null)}
                                        onClick={() => handleMakeClick(make)}
                                    >
                                        {/* Content Container */}
                                        <div className="relative p-4 md:p-4 flex flex-row items-center space-x-4 min-h-[120px] md:min-h-[100px]">
                                            {/* Car Make Name */}
                                            <div className="flex-shrink-0 text-left w-1/2">
                                                <h3 className={`font-bold text-lg md:text-xl transition-colors duration-300 ${hoveredMake === make.id ? 'text-orange-600' : 'text-gray-900'}`}>{make.name}</h3>
                                            </div>
                                            {/* Car Image */}
                                            <div className="flex-1 flex justify-end w-1/2">
                                                <div className="relative w-20 h-16 md:w-24 md:h-14 flex items-center justify-center bg-white overflow-hidden">
                                                    <Image
                                                        src={make.image}
                                                        alt={`${make.name} car`}
                                                        className={`w-full h-full object-contain object-center transition-all duration-300 ${hoveredMake === make.id ? 'scale-150' : 'scale-100'}`}
                                                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                        width={150}
                                                        height={100}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                    <circle cx="20" cy="20" r="2" fill="currentColor">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="30" r="1.5" fill="currentColor">
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="40" r="1" fill="currentColor">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                </svg>
            </div>

            <div className="absolute bottom-10 right-10 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                    <polygon points="50,15 61,35 85,35 67,50 73,74 50,60 27,74 33,50 15,35 39,35" fill="currentColor">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 50 50;360 50 50"
                            dur="20s"
                            repeatCount="indefinite"
                        />
                        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
                    </polygon>
                </svg>
            </div>
        </section>
    );
};

export default PopularMakes;