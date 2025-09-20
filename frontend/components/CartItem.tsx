import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import Image from "next/image";
import { useWishlist } from '@/components/WishlistContext';

interface CartItemProps {
    id: number;
    name: string;
    image: string;
    price: number;
    category: string;
    stock_status: boolean;
    warranty: number;
    delivery_days: number;
    return_days: number;
    initialQuantity?: number;
    onRemove?: (id: string) => void;
    className?: string;
}

const CartItem: React.FC<CartItemProps> = ({
                                               id,
                                               name,
                                               image,
                                               price,
                                               category,
                                               stock_status,
                                               warranty,
                                               delivery_days,
                                               return_days,
                                               initialQuantity = 1,
                                               onRemove,
                                               className = ''
                                           }) => {
    const [quantity] = useState(initialQuantity);
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
    const wishlisted = isWishlisted(id);

    const handleRemove = () => {
        onRemove?.(id.toString());
    };

    const handleWishlist = () => {
        if (wishlisted) {
            removeFromWishlist(id);
        } else {
            addToWishlist({
                id,
                name,
                image_url: image,
                price,
                category,
                category_slug: category,
                category_name: category,
                stock_status,
                warranty,
                delivery_days,
                return_days
            });
        }
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
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                        <div className="text-xs text-gray-500 mt-1">Qty: {quantity}</div>
                    </div>
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
                        onClick={handleWishlist}
                        className={`flex items-center gap-1 text-xs transition-colors ${wishlisted ? 'text-red-500' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <Heart className={`w-3 h-3 ${wishlisted ? 'fill-current text-red-500' : ''}`} />
                        <span className="uppercase tracking-wide">{wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</span>
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
