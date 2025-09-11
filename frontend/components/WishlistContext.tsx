"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';

export interface WishlistedProduct extends Product {
  quantity: number;
}

interface WishlistContextType {
  wishlist: WishlistedProduct[];
  addToWishlist: (product: Product, quantity?: number) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  updateWishlistQuantity: (productId: number, quantity: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product, quantity: number = 1) => {
    setWishlist(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev;
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isWishlisted = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const updateWishlistQuantity = (productId: number, quantity: number) => {
    setWishlist(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, updateWishlistQuantity }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
