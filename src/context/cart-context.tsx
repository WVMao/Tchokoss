'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';

type Product = {
    id: string | number;
    name: string;
    price: string | number;
    image: string;
};

type CartContextType = {
    items: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (index: number) => void;
    cartCount: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToast } = useToast();

    const addToCart = (product: Product) => {
        setItems((prev) => [...prev, product]);
        addToast(`${product.name} ajouté au panier !`, 'success');
        setIsCartOpen(true); // Auto open cart on add
    };

    const removeFromCart = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, cartCount: items.length, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
