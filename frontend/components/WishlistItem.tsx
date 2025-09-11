import React from 'react';
import Image from 'next/image';
import { WishlistedProduct, useWishlist } from './WishlistContext';
import { useCart } from './CartContext';

interface WishlistItemProps {
  item: WishlistedProduct;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item }) => {
  const { removeFromWishlist, updateWishlistQuantity } = useWishlist();
  const { addToCart } = useCart();

  const handleQuantityChange = (delta: number) => {
    updateWishlistQuantity(item.id, item.quantity + delta);
  };

  const handleAddToCart = () => {
    addToCart(item, item.quantity);
    removeFromWishlist(item.id);
  };

  return (
    <div className="flex items-center gap-6 border-b py-4">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 border rounded flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name} width={80} height={80} className="object-contain w-full h-full" />
        ) : (
          <div className="w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Image</div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{item.name}</div>
        <div className="text-gray-500 text-sm">${item.price}</div>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => handleQuantityChange(-1)} className="px-2 py-1 border rounded disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
          <span className="px-2">{item.quantity}</span>
          <button onClick={() => handleQuantityChange(1)} className="px-2 py-1 border rounded">+</button>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <button onClick={handleAddToCart} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Add to Cart</button>
        <button onClick={() => removeFromWishlist(item.id)} className="text-red-500 text-xs">Remove</button>
      </div>
    </div>
  );
};

export default WishlistItem;
