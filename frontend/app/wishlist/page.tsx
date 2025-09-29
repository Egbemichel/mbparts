"use client";

import React from 'react';
import { useWishlist } from '@/components/WishlistContext';
import WishlistItem from '@/components/WishlistItem';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Go Back Button */}
        <button
            className="absolute top-4 left-1 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
            onClick={() => router.back()}
            aria-label="Go back"
        >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 w-full">
              {/* Responsive SVG image */}
              <Image
                  src="/images/amico.svg"
                  alt="Empty cart illustration"
                  className="mb-6 w-40 sm:w-56 h-auto object-contain"
                  loading="lazy"
                  height={200}
                  width={400}
              />
              <div className="text-lg sm:text-xl text-gray-500 mb-4 text-center font-medium">Your wishlist is empty.</div>
              <button
                  onClick={() => router.push('/shop')}
                  className="mt-2 px-6 py-3 bg-orange-500 text-white font-semibold text-base shadow hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label="Go to Shop"
              >
                  Continue to Shop
              </button>
          </div>
      ) : (
        <div className="flex flex-col gap-4">
          {wishlist.map(item => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
