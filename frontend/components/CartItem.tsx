import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import Image from "next/image";

interface CartItemProps {
    id: number;
    name: string;
    image: string;
    price: number;
    initialQuantity?: number;
    onRemove?: (id: string) => void;
    onMoveToFavorites?: (id: string) => void;
    className?: string;
}

const CartItem: React.FC<CartItemProps> = ({
                                               id,
                                               name,
                                               image,
                                               price,
                                               initialQuantity = 1,
                                               onRemove,
                                               onMoveToFavorites,
                                               className = ''
                                           }) => {
    const [quantity] = useState(initialQuantity);

    const handleRemove = () => {
        onRemove?.(id.toString());
    };

    const handleMoveToFavorites = () => {
        onMoveToFavorites?.(id.toString());
    };

    return (
        <div className={`bg-white border-b border-gray-200 py-6 flex gap-12 items-center ${className}`}>
            {/* Product Image */}
            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {image ? (
                    <Image src={image} alt={name} className="w-full h-full object-contain" height={400} width={150} />
                ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Image
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                    <button
                        onClick={handleRemove}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Remove item"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Bottom Row: Move to Favorites & Price */}
                <div className="flex justify-between items-center gap-4">
                    <button
                        onClick={handleMoveToFavorites}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
                    >
                        <Heart className="w-3 h-3" />
                        <span className="uppercase tracking-wide">Add to wishlist</span>
                    </button>
                    <div className="text-lg font-semibold text-primary-100">
                        ${(price * quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
