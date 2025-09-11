"use client"

import React, {  useState } from "react";
import Image from "next/image";
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import NavbarHome from "@/components/NavbarHome";
import Check from "@/public/icons/Check";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product, ProductImage } from "@/lib/types";

export default function ProductDetailsClient({ product }: { product: Product }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedTab, setSelectedTab] = useState("Reviews");

    const {addToCart} = useCart();
    const {addToWishlist, removeFromWishlist, isWishlisted} = useWishlist();

    const handleQuantityChange = (delta: number) => setQuantity(prev => Math.max(1, prev + delta));
    const handleAddToCart = () => product && addToCart(product, quantity);
    const handleWishlist = () => {
        if (!product) return;

        if (isWishlisted(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };
    const renderStars = (rating: number) => (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${
                        i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                />
            ))}
        </>
    );

    const wishlisted = isWishlisted(product.id);

    return (
        <div className="bg-gray-50">
            <NavbarHome/>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <Image
                                src={product.images?.[selectedImageIndex]?.image_url || product.image_url || "/placeholder.png"}
                                alt={product.name}
                                fill
                                className="object-contain p-8"
                                priority
                            />
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                {product.images.map((img: ProductImage, index: number) => (
                                    <div
                                        key={img.id}
                                        className={`flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 ${
                                            index === selectedImageIndex ? "border-orange-500" : "border-gray-200"
                                        }`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <Image
                                            src={img.image_url}
                                            alt={`${product.name} ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-contain p-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold text-gray-900">{product.name}</h1>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">{renderStars(product.stars || 0)}</div>
                            {product.stock_status ? (
                                <span className="flex items-center text-green-600 text-sm font-medium ml-3">
                  <Check className="w-4 h-4 mr-1 text-green-600"/> In stock
                </span>
                            ) : (
                                <span className="flex items-center text-gray-400 text-sm font-medium ml-3">
                  <span className="w-2 h-2 bg-black rounded-full mr-1 flex-shrink-0"/> Out of stock
                </span>
                            )}
                        </div>

                        {/* Price & Description */}
                        <div className="border-t border-b border-gray-200 py-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl font-bold text-primary-100">${product.price}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <div className="flex items-center border border-gray-300 w-full sm:w-auto">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}
                                        className="p-2 hover:bg-gray-100">-
                                </button>
                                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-100">+</button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock_status}
                                className="flex-1 sm:w-auto bg-orange-500 text-white px-6 py-3 font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
                            >
                                <ShoppingCart className="w-5 h-5"/> Add to Cart
                            </button>
                        </div>

                        {/* Wishlist */}
                        <button
                            onClick={handleWishlist}
                            className={`w-full sm:w-auto px-4 py-3 rounded-lg border-2 transition-colors mt-3 ${
                                wishlisted ? "border-red-500 text-red-500 bg-red-50" : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`}/>
                        </button>

                        {/* Info Bullets */}
                        <ul className="space-y-2 mb-4">
                            <li className="flex items-center text-gray-600 text-sm font-medium">
                  <span
                      className="w-1 h-1 bg-black rounded-full mr-2 flex-shrink-0"/> {product.warranty} year{product.warranty > 1 ? "s" : ""} warranty
                            </li>
                            <li className="flex items-center text-gray-600 text-sm font-medium">
                                <span className="w-1 h-1 bg-black rounded-full mr-2 flex-shrink-0"/> Delivery
                                in {product.delivery_days} day{product.delivery_days > 1 ? "s" : ""}
                            </li>
                            <li className="flex items-center text-gray-600 text-sm font-medium">
                                <span className="w-1 h-1 bg-black rounded-full mr-2 flex-shrink-0"/> Return
                                within {product.return_days} day{product.return_days > 1 ? "s" : ""}
                            </li>
                        </ul>

                        {/* Categories */}
                        <div className="text-sm text-gray-500 mb-6">
                            <span className="font-semibold text-gray-700">Categories:</span> {product.category}
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M6.18182 10.3333C5.20406 10.3333 5 10.5252 5 11.4444V13.1111C5 14.0304 5.20406 14.2222 6.18182 14.2222H8.54545V20.8889C8.54545 21.8081 8.74951 22 9.72727 22H12.0909C13.0687 22 13.2727 21.8081 13.2727 20.8889V14.2222H15.9267C16.6683 14.2222 16.8594 14.0867 17.0631 13.4164L17.5696 11.7497C17.9185 10.6014 17.7035 10.3333 16.4332 10.3333H13.2727V7.55556C13.2727 6.94191 13.8018 6.44444 14.4545 6.44444H17.8182C18.7959 6.44444 19 6.25259 19 5.33333V3.11111C19 2.19185 18.7959 2 17.8182 2H14.4545C11.191 2 8.54545 4.48731 8.54545 7.55556V10.3333H6.18182Z"
                                      stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                                    stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
                                <path
                                    d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z"
                                    stroke="#141B34" strokeWidth="1.5"/>
                                <path d="M17.5078 6.5H17.4988" stroke="#141B34" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            {["Reviews"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-6 py-4 text-sm font-medium capitalize border-b-2 ${
                                        selectedTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-6">

                        {selectedTab === "Reviews" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-medium text-gray-900">Customer Reviews</h3>
                                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Write a Review
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {/* Example reviews */}
                                    <div className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex">{renderStars(5)}</div>
                                            <span className="font-medium text-gray-900">Great Product!</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">Verified Purchase • Posted 2 weeks ago</p>
                                        <p className="text-gray-700">Works perfectly. Easy to install and very quiet operation.</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex">{renderStars(4)}</div>
                                            <span className="font-medium text-gray-900">Solid quality</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">Verified Purchase • Posted 1 month ago</p>
                                        <p className="text-gray-700">The part fit my vehicle as described. Shipping was fast and
                                            customer service was helpful.</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex">{renderStars(5)}</div>
                                            <span className="font-medium text-gray-900">Highly recommend</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">Verified Purchase • Posted 3 days ago</p>
                                        <p className="text-gray-700">Excellent value for the price. Will definitely buy again for my
                                            next project.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related products</h2>
                    {/* Placeholder grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Map related products here */}
                    </div>
                </div>
            </div>
        </div>
    );

}