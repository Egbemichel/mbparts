import React, { useState } from 'react';
import { ArrowRight, Mail, Check } from 'lucide-react';

interface NewsletterSignupProps {
    className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '' }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            console.log('Newsletter signup:', email);

            // Reset after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail('');
            }, 3000);
        }, 1000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <div className={`relative min-h-96 flex items-center justify-center overflow-hidden ${className}`}>
            {/* Background with automotive/luxury car theme */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 800"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23333" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="1920" height="800" fill="%23000"/><rect width="1920" height="800" fill="url(%23grid)"/><ellipse cx="960" cy="400" rx="600" ry="200" fill="url(%23gradient)" opacity="0.3"/><defs><radialGradient id="gradient"><stop offset="0%" stop-color="%23444"/><stop offset="100%" stop-color="%23000"/></radialGradient></defs></svg>')`
                }}
            />

            {/* Overlay pattern for depth */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-600 via-transparent to-gray-800"></div>
                <div className="absolute top-10 left-10 w-32 h-32 border border-gray-500 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 border border-gray-400 rounded-full opacity-15"></div>
                <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-gray-600 rotate-45 opacity-10"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Join our mailing list to receive future
                        <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              exclusive offers!
            </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Sign-up and save! Receive exclusive offers through email.
                    </p>
                </div>

                {/* Newsletter Form */}
                <div className="max-w-2xl mx-auto">
                    {!isSubmitted ? (
                        <div className="flex flex-col sm:flex-row gap-0 bg-white rounded-lg overflow-hidden shadow-2xl">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 md:py-5 text-gray-800 text-lg placeholder-gray-500 border-0 outline-none focus:ring-0"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !email}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 md:px-8 py-4 md:py-5 font-bold text-lg uppercase tracking-wide hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-fit"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <>
                                        Subscribe
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-600 text-white rounded-lg p-6 shadow-2xl">
                            <div className="flex items-center justify-center gap-3">
                                <Check className="w-6 h-6" />
                                <span className="text-lg font-semibold">
                  Thanks for subscribing! Check your email for exclusive offers.
                </span>
                            </div>
                        </div>
                    )}

                    {/* Trust indicators */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400 mb-2">
                            Join over 10,000+ subscribers already receiving exclusive deals
                        </p>
                        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No spam
              </span>
                            <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Unsubscribe anytime
              </span>
                            <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Weekly deals
              </span>
                        </div>
                    </div>
                </div>

                {/* Additional visual elements */}
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2 hidden lg:block">
                    <div className="w-1 h-24 bg-gradient-to-b from-orange-500 to-transparent opacity-60"></div>
                </div>

                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden lg:block">
                    <div className="w-1 h-24 bg-gradient-to-b from-orange-500 to-transparent opacity-60"></div>
                </div>
            </div>

            {/* Bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent opacity-50"></div>
        </div>
    );
};

export default NewsletterSignup;