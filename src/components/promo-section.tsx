'use client';

import { motion } from 'framer-motion';
import { Timer, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useSearchParams } from 'next/navigation';

export function PromoSection() {
    const { addToCart } = useCart();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q')?.toLowerCase() || '';
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [promoProducts, setPromoProducts] = useState<any[]>([]);

    useEffect(() => {
        // Fetch real products
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                // Filter for promo items (either isPromo flag or 'Promo' badge)
                const promos = data.filter((p: any) => p.isPromo || p.badge === 'Promo');
                setPromoProducts(promos);
            })
            .catch(err => console.error("Failed to load promo products", err));

        // Set a future date (2 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const scrollContainer = (direction: 'left' | 'right') => {
        const container = document.getElementById('promo-carousel');
        if (container) {
            const scrollAmount = 300;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        const slider = document.getElementById('promo-carousel');
        if (slider) {
            setStartX(e.pageX - slider.offsetLeft);
            setScrollLeft(slider.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const slider = document.getElementById('promo-carousel');
        if (slider) {
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        }
    };

    // Helper to format price
    const formatPrice = (price: any) => {
        if (typeof price === 'number') {
            return price.toLocaleString() + ' FCFA';
        }
        return price;
    };

    return (
        <section className="py-16 bg-white overflow-hidden relative">
            <div className="container mx-auto px-4 relative group/section">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold text-gray-900">Flash Sales</h2>
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1 rounded-full text-sm font-semibold border border-red-100 animate-pulse">
                            <Timer className="w-4 h-4" />
                            <span>Fin dans : {timeLeft.days}j {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                        </div>
                    </div>
                    <button
                        onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all hover:text-emerald-700"
                    >
                        Voir tout <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation Arrows - Stylized */}
                <button
                    onClick={() => scrollContainer('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-emerald-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform -translate-x-1/2 md:translate-x-0 opacity-0 group-hover/section:opacity-100 duration-300 pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    onClick={() => scrollContainer('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-emerald-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform translate-x-1/2 md:translate-x-0 opacity-0 group-hover/section:opacity-100 duration-300 pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {/* Carousel */}
                <div
                    id="promo-carousel"
                    className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-thin cursor-grab active:cursor-grabbing px-4"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {promoProducts.length === 0 ? (
                        <div className="w-full text-center text-gray-500 py-12 italic">
                            Aucun produit en promotion pour le moment.
                        </div>
                    ) : (
                        promoProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl shadow-lg border-2 border-orange-100 hover:border-orange-500 transition-colors p-4 snap-center group relative select-none"
                            >
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 animate-pulse">
                                    PROMO
                                </div>
                                <div className="h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden shadow-inner group-hover:bg-orange-50 transition-colors pointer-events-none">
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        src={product.image || product.imageUrl || '/placeholder-shoe.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
                                </div>

                                <div className="flex gap-2">
                                    {/* WhatsApp Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        onClick={(e) => {
                                            const phoneNumber = "237699999999";
                                            const message = `Bonjour, je suis intéressé par la promotion : *${product.name}* (${formatPrice(product.price)})`;
                                            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="p-3 bg-[#25D366] text-white rounded-full shadow-md hover:shadow-green-200 z-20 relative"
                                        title="Commander sur WhatsApp"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16H12.05Z" />
                                        </svg>
                                    </motion.button>

                                    {/* Cart Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                                        }}
                                        className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors z-20 relative shadow-md"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Ajouter
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
