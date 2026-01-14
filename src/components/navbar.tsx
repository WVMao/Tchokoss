'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCart } from '@/context/cart-context';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cartCount, openCart } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-emerald-800">
                        TCHOKOSS<span className="text-orange-500">.</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">Boutique</button>
                        <button onClick={() => document.getElementById('new')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">Nouveautés</button>
                        <button onClick={() => document.getElementById('promo')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">Promos</button>
                    </div>
                </div>

                {/* Search Bar (Conditionally rendered) */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="hidden md:block flex-1 mx-4 max-w-lg overflow-hidden"
                        >
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-gray-50"
                                autoFocus
                                onBlur={() => setIsSearchOpen(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/?q=${encodeURIComponent(e.currentTarget.value)}`;
                                    }
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Icons */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {isSearchOpen ? <X className="w-5 h-5 text-gray-600" /> : <Search className="w-5 h-5 text-gray-600" />}
                    </button>
                    <button
                        onClick={openCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                    >
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                        <motion.span
                            key={cartCount}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full"
                        >
                            {cartCount}
                        </motion.span>
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                staggerChildren: 0.1
                            }
                        }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-gray-100 overflow-hidden bg-white"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {[
                                { href: "#shop", label: "Boutique" },
                                { href: "#new", label: "Nouveautés" },
                                { href: "#promo", label: "Promos" }
                            ].map((item) => (
                                <motion.div
                                    key={item.href}
                                    variants={{
                                        hidden: { x: -20, opacity: 0 },
                                        visible: { x: 0, opacity: 1 }
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-lg font-medium text-gray-800 hover:text-emerald-600 w-full text-left py-2"
                                    >
                                        {item.label}
                                    </button>
                                </motion.div>
                            ))}
                            <Link href="/admin" className="text-xs text-gray-300 mt-4 hover:text-emerald-600 w-fit">Espace Gestion</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
