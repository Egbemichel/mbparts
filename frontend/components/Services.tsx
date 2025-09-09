import React from 'react';
import BoxIcon from "@/public/icons/BoxIcon";
import PistonIcon from "@/public/icons/PistonIcon";
import BrakeDiscIcon from "@/public/icons/BrakeDiscIcon";
import ReturnIcon from "@/public/icons/ReturnIcon";
import {Separator} from "@/components/ui/separator";

interface ServiceItem {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServicesHighlight: React.FC = () => {
    const services: ServiceItem[] = [
        {
            icon: <PistonIcon className="w-12 h-12 text-orange-500" />,
            title: "Guaranteed Fitted",
            description: "Today our catalogue includes more than 10 million different parts"
        },
        {
            icon: <BoxIcon className="w-12 h-12 text-orange-500" />,
            title: "Hassle Free Shipping",
            description: "We use advanced encryption to keep your payment"
        },
        {
            icon: <ReturnIcon className="w-12 h-12 text-orange-500" />,
            title: "30 Days Return",
            description: "Top-notch aftermarket car spare parts supplied"
        },
        {
            icon: <BrakeDiscIcon className="w-12 h-12 text-orange-500" />,
            title: "Wide Selection",
            description: "We offer over 2500000 OEM-style quality auto parts"
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        {/* Icon Container */}
                        <div className="flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full">
                            {service.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-900">
                            {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
            <Separator className='bg-accent-50 my-13' />
        </div>
    );
};

export default ServicesHighlight;