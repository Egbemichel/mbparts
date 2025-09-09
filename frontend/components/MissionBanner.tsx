import React from 'react';
import Image from 'next/image';

const AutomotiveHero: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Main Container */}
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-8 lg:py-16">

                    {/* Left Side - Image */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="relative overflow-hidden">
                            <Image
                                src="/images/mission.png"
                                alt="Professional automotive service technician working on orange sports car"
                                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                                width={735}
                                height={424}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-6 lg:space-y-8">

                        {/* Mission Badge */}
                        <div className="inline-flex items-center">
              <span className="text-orange-500 font-medium text-sm sm:text-base tracking-wide uppercase">
                Our Mission.
              </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-2xl font-bold text-gray-900 leading-tight">
                            Your Trusted Auto Parts & Service Partner
                        </h1>

                        {/* Description */}
                        <div className="space-y-4 text-gray-600">
                            <p className="text-base sm:text-lg leading-relaxed">
                                At MB Parts, our mission is to keep you on the road with quality parts and expert service. Whether you’re a DIY enthusiast or a professional mechanic, we provide reliable automotive solutions, honest advice, and fast, friendly support.
                            </p>

                            <p className="text-sm sm:text-base leading-relaxed">
                                From routine maintenance to major repairs, our experienced team is dedicated to helping you find the right part at the right price. We stand behind every product we sell and every service we provide—because your safety and satisfaction drive us.
                            </p>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                            <div className="flex items-center space-x-4">

                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                                            alt="Customer service specialist"
                                            className="w-full h-full object-cover"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="flex-grow">
                                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                                        Have a Question? Ask a Specialist
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                                        <a
                                            href="tel:888-910-2330"
                                            className="text-gray-900 font-bold text-lg sm:text-xl hover:text-orange-500 transition-colors"
                                        >
                                            (888) 910-2330
                                        </a>
                                        {/* <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 self-start sm:self-auto">
                                            Live Chat
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomotiveHero;