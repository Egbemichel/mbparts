"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    Truck,
    RotateCcw,
    Grid3X3,
    Users,
    Settings,
    CheckCircle,
    Star,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import Image from "next/image";

// Types
interface Statistic {
    number: string;
    label: string;
    icon?: React.ReactNode;
}

interface Reason {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

// Components
const HeroSection: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white py-16 text-center relative overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

            {/* Background image simulation */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"></div>

            <div className="relative z-20 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="hover:text-orange-500 cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="text-orange-500">About Us</span>
                </div>
            </div>
        </div>
    );
};

const IntroSection: React.FC = () => {
    const statistics: Statistic[] = [
        { number: "10M+", label: "Parts Available" },
        { number: "8M+", label: "Happy Customers" }
    ];

    const teamMembers: TeamMember[] = [
        {
            name: "John Smith",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
        },
        {
            name: "Sarah Johnson",
            role: "Operations Manager",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=60&h=60&fit=crop&crop=face"
        }
    ];

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Side - Years Badge and Image */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative">
                            <Image
                                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop"
                                alt="Auto parts warehouse"
                                className="w-full h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                                width={100}
                                height={80}
                            />

                            {/* Years in Business Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-6 rounded-lg shadow-lg text-center">
                                <div className="text-3xl font-bold">15</div>
                                <div className="text-sm uppercase tracking-wide">Years in Business</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-1/2 mt-8 lg:mt-0">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            We are a retail business, specialising in automotive parts and accessories
                        </h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                        {/* Statistics */}
                        <div className="flex flex-wrap gap-8 mb-8">
                            {statistics.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-orange-500 mb-1">{stat.number}</div>
                                    <div className="text-gray-600 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Team Members */}
                        <div className="flex items-center space-x-4">
                            <div className="flex -space-x-2">
                                {teamMembers.map((member, index) => (
                                    <Image
                                        key={index}
                                        src={member.image}
                                        alt={member.name}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                        width={12}
                                        height={12}
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-gray-600">
                                <div className="font-medium">Our Expert Team</div>
                                <div>Ready to help you</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReasonsSection: React.FC = () => {
    const reasons: Reason[] = [
        {
            icon: <Award className="w-8 h-8" />,
            title: "Guaranteed Fitted",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: "Hassle Free Shipping",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            icon: <RotateCcw className="w-8 h-8" />,
            title: "30 Days Return",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            icon: <Grid3X3 className="w-8 h-8" />,
            title: "Wide Selection",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Expert Advice",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: "Professional Service",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    ];

    return (
        <div className="py-16 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Reasons to cooperate with us
                    </h2>
                </div>

                {/* Reasons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow group"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-50 transition-colors">
                                <div className="text-gray-500 group-hover:text-orange-500 transition-colors">
                                    {reason.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {reason.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 100% Genuine Parts Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-2/3 p-8 lg:p-12">
                            <div className="flex items-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    100% Genuine Parts
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <div className="flex items-center space-x-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">5000+</div>
                                    <div className="text-sm text-gray-600">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">98%</div>
                                    <div className="text-sm text-gray-600">Satisfaction</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-600">Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/3">
                            <Image
                                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
                                alt="Auto parts"
                                className="w-full h-64 lg:h-full object-cover"
                                width={300}
                                height={300}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        More questions? We&apos;d love to help you find the right solution.
                    </p>
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors">
                        Contact Us Today
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContactSection: React.FC = () => {
    const contactInfo = [
        {
            icon: <Phone className="w-5 h-5" />,
            label: "Call Us",
            value: "+1 (650) 431-7498"
        },
        {
            icon: <Mail className="w-5 h-5" />,
            label: "Email Us",
            value: "mbparts.assembly.store@gmail.com"
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            label: "We are at",
            value: "New Jersey, USA"
        }
    ];

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Get In Touch With Us
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have questions about our products or services? Our expert team is ready to help you find the perfect auto parts solution.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {info.label}
                            </h3>
                            <p className="text-gray-600">
                                {info.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main About Us Page Component
const AboutUsPage: React.FC = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white">
            {/* Go Back Button */}
            <button
                className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            <HeroSection />
            <IntroSection />
            <ReasonsSection />
            <ContactSection />
        </div>
    );
};

export default AboutUsPage;