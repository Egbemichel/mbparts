"use client";
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const router = useRouter();

    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleNewsletterSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Newsletter signup:', newsletterEmail);
    };

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
            {/* Hero Section */}
            <div
                className="relative h-48 md:h-64 bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.7), rgba(139, 69, 19, 0.7)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" fill="%23D4A574"><rect width="1200" height="400"/></svg>')`
                }}
            >
                <div className="text-center text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">Contact</h1>
                    <div className="w-12 md:w-16 h-0.5 bg-white mx-auto"></div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

                {/* Availability Notice Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                We are at your disposal 7 days a week!
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600 lg:flex-shrink-0">
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border">
                                <Phone className="w-4 h-4 text-blue-600" />
                                <span>Phone number</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border">
                                <Mail className="w-4 h-4 text-green-600" />
                                <span>Email</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border">
                                <MapPin className="w-4 h-4 text-red-600" />
                                <span>Address</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="bg-slate-700 text-white rounded-lg p-4 md:p-6 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold mb-1">Want to save time</h3>
                            <p className="text-slate-300 text-sm">
                                Subscribe to our newsletter and get the latest updates
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className="px-4 py-2 rounded text-gray-900 flex-1 lg:w-64 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button
                                onClick={handleNewsletterSubmit}
                                className="bg-white text-slate-700 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                            >
                                Subscribe now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-8">
                    <div className="bg-green-100 border border-green-200 rounded-lg h-48 md:h-64 relative overflow-hidden">
                        {/* Realistic Map Mockup */}
                        <div className="absolute inset-0">
                            <div className="w-full h-full relative">
                                {/* Map background with roads pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-200">
                                    {/* Road lines */}
                                    <svg className="absolute inset-0 w-full h-full opacity-30">
                                        <defs>
                                            <pattern id="roads" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M0,20 L40,20" stroke="#666" strokeWidth="1"/>
                                                <path d="M20,0 L20,40" stroke="#666" strokeWidth="1"/>
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#roads)"/>
                                    </svg>

                                    {/* Water areas */}
                                    <div className="absolute top-8 right-12 w-16 h-8 bg-blue-200 rounded-full opacity-60"></div>
                                    <div className="absolute bottom-12 left-8 w-20 h-6 bg-blue-200 rounded-full opacity-60"></div>

                                    {/* Park areas */}
                                    <div className="absolute top-16 left-16 w-12 h-12 bg-green-300 rounded opacity-50"></div>
                                    <div className="absolute bottom-20 right-20 w-8 h-8 bg-green-300 rounded opacity-50"></div>
                                </div>

                                {/* Location Pin */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                        <MapPin className="w-8 h-8 text-red-600 drop-shadow-lg" fill="currentColor" />
                                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-1 shadow-lg text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Our Location
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Controls */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1">
                            <button className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
                            <button className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">-</button>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        We would love to hear from you
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <div>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name*"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email*"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                                />
                            </div>

                            <div>
                <textarea
                    name="message"
                    placeholder="Your Message*"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none transition-colors"
                ></textarea>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                <p>* Required fields. By submitting this form, you agree to our privacy policy and terms of service.</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="bg-gray-900 text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                Send message
                            </button>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="lg:pl-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm mb-1">Address</div>
                                        <div className="text-gray-600 text-sm leading-relaxed">
                                            New Jersey<br />
                                            United States
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm mb-1">Phone</div>
                                        <div className="text-gray-600 text-sm">+1 (650) 431-7498</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm mb-1">Email</div>
                                        <div className="text-gray-600 text-sm">mbparts.assembly.store@gmail.com</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm mb-1">Business Hours</div>
                                        <div className="text-gray-600 text-sm leading-relaxed">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </div>
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

export default ContactPage;