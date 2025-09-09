"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Truck, CreditCard, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";

// Types
interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface FAQSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    items: FAQItem[];
}

// FAQ Data
const faqSections: FAQSection[] = [
    {
        id: 'shipping',
        title: 'Shipping Information',
        icon: <Truck className="w-6 h-6" />,
        items: [
            {
                id: 1,
                question: "What are my shipping options?",
                answer: "We offer several shipping options to meet your needs: Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Overnight Shipping (1 business day). All orders over $75 qualify for free standard shipping within the continental United States."
            },
            {
                id: 2,
                question: "What will my order arrive?",
                answer: "Order processing takes 1-2 business days before shipping. Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers the next business day. You&apos;ll receive a tracking number via email once your order ships."
            },
            {
                id: 3,
                question: "Can I track my order once it ships?",
                answer: "Yes! Once your order ships, you&apos;ll receive an email with a tracking number and direct link to track your package. You can also track your order by logging into your account on our website and viewing your order history."
            },
            {
                id: 4,
                question: "What countries do you deliver to?",
                answer: "Currently, we deliver to all 50 US states, Puerto Rico, and Canada. International shipping to other countries is available for select products. Additional customs fees and longer delivery times may apply for international orders."
            },
            {
                id: 5,
                question: "Where do I return an item?",
                answer: "Returns can be initiated through your online account or by contacting our customer service team. We&apos;ll provide you with a prepaid return label and instructions. Items must be returned within 30 days of delivery in original packaging and condition."
            }
        ]
    },
    {
        id: 'payment',
        title: 'Payment Questions',
        icon: <CreditCard className="w-6 h-6" />,
        items: [
            {
                id: 6,
                question: "What methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and financing options through Affirm. All transactions are securely processed with 256-bit SSL encryption for your protection."
            },
            {
                id: 7,
                question: "What will my order arrive?",
                answer: "Payment is processed immediately upon order confirmation. For credit cards, the charge appears within 1-2 business days. PayPal and digital wallet payments are processed instantly. Financing options may take 1-3 business days for approval."
            },
            {
                id: 8,
                question: "Can I track my order once it ships?",
                answer: "Yes, you can track all payments and order status through your account dashboard. We also send email confirmations for payment processing, order confirmation, and shipping notifications with tracking information."
            },
            {
                id: 9,
                question: "What countries do you deliver to?",
                answer: "We process payments in USD for US customers and CAD for Canadian customers. International customers will see prices converted to their local currency at checkout, with final charges processed in USD."
            },
            {
                id: 10,
                question: "Where do I return an item?",
                answer: "Refunds are processed back to your original payment method within 3-5 business days after we receive your return. PayPal refunds may take up to 7 business days. You&apos;ll receive an email confirmation when your refund is processed."
            }
        ]
    },
    {
        id: 'warranty',
        title: 'Product Warranty',
        icon: <Shield className="w-6 h-6" />,
        items: [
            {
                id: 11,
                question: "What are my shipping options?",
                answer: "All our auto parts come with manufacturer warranties ranging from 12 months to lifetime coverage, depending on the part type. OEM parts typically have longer warranties than aftermarket parts. Warranty details are listed on each product page."
            },
            {
                id: 12,
                question: "What will my order arrive?",
                answer: "Warranty coverage begins from the date of purchase and includes defects in materials and workmanship. It does not cover normal wear and tear, misuse, or damage from improper installation. Professional installation is recommended for optimal warranty coverage."
            },
            {
                id: 13,
                question: "Can I track my order once it ships?",
                answer: "To make a warranty claim, contact our customer service with your order number and description of the issue. We may require photos or return of the defective part. Approved warranty claims result in free replacement parts or full refunds."
            },
            {
                id: 14,
                question: "What countries do you deliver to?",
                answer: "Warranty coverage varies by manufacturer and part type. Engine components typically have 2-3 year warranties, brake parts have 12-24 months, electrical components have 12 months, and some premium brands offer lifetime warranties on select items."
            },
            {
                id: 15,
                question: "Where do I return an item?",
                answer: "Warranty claims can be processed through your online account, by phone, or by email. Keep your order confirmation and any installation documentation. Our warranty team will guide you through the process and arrange replacement parts if needed."
            }
        ]
    }
];

// Components
const HeroSection: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white py-16 text-center relative overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"></div>

            <div className="relative z-20 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">FAQ&apos;s</h1>
                <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="hover:text-orange-500 cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="text-orange-500">FAQ</span>
                </div>
            </div>
        </div>
    );
};

const SearchSection: React.FC<{
    searchTerm: string;
    onSearchChange: (term: string) => void;
}> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="mb-8">
                    <HelpCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Do you have
                    </h2>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        some Questions?
                    </h2>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-sm"
                    />
                    <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                </div>

                <p className="text-gray-600 mt-4">
                    Can&apos;t find what you&apos;re looking for? Try searching above or browse our categories below.
                </p>
            </div>
        </div>
    );
};

const FAQAccordion: React.FC<{
    section: FAQSection;
    expandedItems: Set<number>;
    onToggleItem: (itemId: number) => void;
    searchTerm: string;
}> = ({ section, expandedItems, onToggleItem, searchTerm }) => {
    // Filter items based on search term
    const filteredItems = section.items.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredItems.length === 0 && searchTerm) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="text-orange-500">
                        {section.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {section.title}
                    </h3>
                </div>
            </div>

            {/* FAQ Items */}
            <div className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                    <div key={item.id} className="px-6 py-4">
                        <button
                            onClick={() => onToggleItem(item.id)}
                            className="w-full flex items-center justify-between text-left hover:bg-gray-50 -mx-6 -my-4 px-6 py-4 transition-colors"
                        >
                            <h4 className="text-lg font-medium text-gray-900 pr-4">
                                {item.question}
                            </h4>
                            <div className="flex-shrink-0">
                                {expandedItems.has(item.id) ? (
                                    <ChevronUp className="w-5 h-5 text-orange-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </button>

                        {expandedItems.has(item.id) && (
                            <div className="mt-4 pb-2">
                                <p className="text-gray-600 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContactSection: React.FC = () => {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Still Have Questions?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Can&apos;t find the answer you&apos;re looking for? Our friendly customer support team is here to help.
                    Get in touch and we&apos;ll get back to you as soon as possible.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors">
                        Contact Support
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
                        Call Us: (555) 123-4567
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">24/7</div>
                        <div className="text-sm text-gray-600">Customer Support</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">&lt;2hr</div>
                        <div className="text-sm text-gray-600">Average Response Time</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">98%</div>
                        <div className="text-sm text-gray-600">Customer Satisfaction</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main FAQ Page Component
const FAQPage: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleToggleItem = (itemId: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        // If searching, expand all matching items
        if (term) {
            const matchingItems = new Set<number>();
            faqSections.forEach(section => {
                section.items.forEach(item => {
                    if (
                        item.question.toLowerCase().includes(term.toLowerCase()) ||
                        item.answer.toLowerCase().includes(term.toLowerCase())
                    ) {
                        matchingItems.add(item.id);
                    }
                });
            });
            setExpandedItems(matchingItems);
        } else {
            setExpandedItems(new Set());
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Go Back Button */}
            <button
                className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            <HeroSection />
            <SearchSection
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {faqSections.map((section) => (
                        <FAQAccordion
                            key={section.id}
                            section={section}
                            expandedItems={expandedItems}
                            onToggleItem={handleToggleItem}
                            searchTerm={searchTerm}
                        />
                    ))}

                    {/* No Results Message */}
                    {searchTerm && !faqSections.some(section =>
                        section.items.some(item =>
                            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    ) && (
                        <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No results found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your search terms or browse our categories above.
                            </p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-orange-500 font-medium hover:text-orange-600"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ContactSection />
        </div>
    );
};

export default FAQPage;