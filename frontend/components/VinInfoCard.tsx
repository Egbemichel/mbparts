import React from 'react';

interface VinInfoCardProps {
    icon: React.ReactElement;
    label: string;
    value: string;
    iconBgColor?: string;
}

const VinInfoCard: React.FC<VinInfoCardProps> = ({
    icon,
    label,
    value,
    iconBgColor = "bg-pink-100",
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            {/* Icon */}
            <div className={`w-12 h-12 ${iconBgColor} rounded-md flex items-center justify-center mb-4`}>
                {icon}
            </div>
            {/* Content */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    {label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default VinInfoCard;
