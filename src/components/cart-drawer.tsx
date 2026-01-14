'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, MapPin } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import { useState } from 'react';

export function CartDrawer() {
    const { isCartOpen, closeCart, items, removeFromCart } = useCart();

    // Group items or calculate total
    const totalPrice = items.reduce((sum, item) => { // Renamed 'total' to 'totalPrice'
        // Extract numerical value from price string (e.g. "45 000 FCFA" -> 45000)
        const price = parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;
        return sum + price;
    }, 0);

    // Checkout Modal State
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [deliveryLocation, setDeliveryLocation] = useState("");

    const handleCheckout = () => {
        setIsCheckoutModalOpen(true);
    };

    const confirmCheckout = () => {
        const phoneNumber = "237699999999"; // Replace with real number
        let message = "Bonjour Tchokoss ! Je souhaite commander ces articles :\n\n";
        items.forEach(item => {
            // Assuming item.price is already a number for toLocaleString, or parse it again if it's a string
            const itemPriceNum = parseInt(item.price.toString().replace(/[^0-9]/g, '')) || 0;
            message += `- ${item.name} (${itemPriceNum.toLocaleString()} FCFA)\n`;
        });
        message += `\n💰 *Total : ${totalPrice.toLocaleString()} FCFA*`;
        message += `\n\n📍 *Lieu de livraison* : ${deliveryLocation}`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setIsCheckoutModalOpen(false);
        closeCart(); // Close the cart drawer after confirming checkout
    };

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeCart}
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-emerald-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Mon Panier ({items.length})</h2>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="bg-gray-50 p-6 rounded-full">
                                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">Votre panier est vide</p>
                                        <button
                                            onClick={closeCart}
                                            className="text-emerald-600 font-bold hover:underline"
                                        >
                                            Commencer mes achats
                                        </button>
                                    </div>
                                ) : (
                                    items.map((item, idx) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={`${item.id}-${idx}`}
                                            className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 line-clamp-2">{item.name}</h4>
                                                    <p className="text-emerald-600 font-bold mt-1">{item.price}</p>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => removeFromCart(idx)}
                                                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Retirer du panier"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="p-6 border-t border-gray-100 bg-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-gray-500 font-medium">Total</span>
                                        <span className="text-2xl font-black text-gray-900">{totalPrice.toLocaleString()} FCFA</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Commander via WhatsApp
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16H12.05Z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Checkout Location Modal */}
            <AnimatePresence>
                {isCheckoutModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCheckoutModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl z-[101]"
                        >
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="bg-[#25D366]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-[#25D366]" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Adresse de livraison</h3>
                                <p className="text-gray-500 mt-2">
                                    Où souhaitez-vous recevoir votre commande de <span className="font-bold text-gray-800">{items.length} articles</span> ?
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Votre Quartier / Ville
                                </label>
                                <input
                                    type="text"
                                    value={deliveryLocation}
                                    onChange={(e) => setDeliveryLocation(e.target.value)}
                                    placeholder="Ex: Yaoundé, Bastos..."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#25D366] focus:ring-0 transition-colors bg-gray-50 font-medium"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && deliveryLocation.trim()) {
                                            confirmCheckout();
                                        }
                                    }}
                                />
                            </div>

                            <button
                                disabled={!deliveryLocation.trim()}
                                onClick={confirmCheckout}
                                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-200/50 flex items-center justify-center gap-2"
                            >
                                Valider la commande
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16H12.05Z" />
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
