"use client";

import React from 'react';
import { useWishlist } from '@/components/WishlistContext';
import WishlistItem from '@/components/WishlistItem';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import { useRouter } from 'next/navigation';

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
        <div className="text-gray-500">Your wishlist is empty.</div>
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
