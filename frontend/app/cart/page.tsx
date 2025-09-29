"use client";

import React from 'react';
import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import CartItem from '@/components/CartItem';
import Image from "next/image"; // Ensure path is correct

export default function CartPage() {
    const { cart, removeFromCart, clearCart  } = useCart();
    const router = useRouter();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Handlers for CartItem
    const handleRemove = (id: string) => removeFromCart(parseInt(id));


    return (
        <div className="max-w-3xl mx-auto py-12 px-4 relative">
            {/* Go Back Button */}
            <button
                className="absolute top-4 left-1 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>

            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 w-full">
                    {/* Responsive SVG image */}
                    <Image
                        src="/images/oc-empty-cart.svg"
                        alt="Empty cart illustration"
                        className="mb-6 w-40 sm:w-56 h-auto object-contain"
                        loading="lazy"
                        height={200}
                        width={400}
                    />
                    <div className="text-lg sm:text-xl text-gray-500 mb-4 text-center font-medium">Your cart is empty.</div>
                    <button
                        onClick={() => router.push('/shop')}
                        className="mt-2 px-6 py-3 bg-orange-500 text-white font-semibold text-base shadow hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                        aria-label="Go to Shop"
                    >
                        Continue to Shop
                    </button>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-gray-200 mb-8">
                        {cart.map(item => (
                            <CartItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                image={item.image_url ?? '/placeholder.png'}
                                price={item.price}
                                category={item.category}
                                stock_status={item.stock_status}
                                warranty={item.warranty}
                                delivery_days={item.delivery_days}
                                return_days={item.return_days}
                                initialQuantity={item.quantity}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
                        <button
                            onClick={clearCart}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Clear Cart
                        </button>
                    </div>

                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-orange-500 text-white py-3 rounded font-bold text-lg hover:bg-orange-600 transition-colors"
                    >
                        Proceed to Checkout
                    </button>
                </>
            )}
        </div>
    );
}
