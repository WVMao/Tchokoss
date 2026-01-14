'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, ShoppingBag, Phone, ArrowRight, Zap, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Fallback items if no featured products are found
const DEFAULT_CAROUSEL_ITEMS = [
    {
        id: 1,
        title: "Élégance Moderne",
        subtitle: "La nouvelle collection 2026",
        description: "Découvrez des vêtements conçus pour allier confort et prestige. Des coupes ajustées et des tissus premium pour une allure incomparable.",
        price: "À partir de 15.000 FCFA",
        color: "bg-emerald-900",
        image: "/hero_man.jpg",
    },
    {
        id: 2,
        title: "Style Urbain",
        subtitle: "Pour ceux qui osent",
        description: "Affirmez votre personnalité avec notre gamme Streetwear. Des designs audacieux pour un look qui ne passe pas inaperçu.",
        price: "Nouvelle Arrivée",
        color: "bg-indigo-900",
        image: "/sneakers_urban.png",
    },
    {
        id: 3,
        title: "Accessoires Premium",
        subtitle: "La touche finale parfaite",
        description: "Montres, bracelets et sacs qui subliment votre style. L'élégance se cache dans les détails.",
        price: " -20% cette semaine",
        color: "bg-amber-900",
        image: "/watch_luxury.png",
    }
];

const BG_COLORS = ['bg-emerald-900', 'bg-indigo-900', 'bg-amber-900', 'bg-rose-900', 'bg-slate-900'];

export function Hero() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselItems, setCarouselItems] = useState<any[]>(DEFAULT_CAROUSEL_ITEMS);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=100'); // Fetch all to filter client side or backend should support filtering
                // For now assuming we filter client side as API is simple
                if (res.ok) {
                    const products = await res.json();
                    const featured = products.filter((p: any) => p.isFeatured === true);

                    if (featured.length > 0) {
                        const mappedItems = featured.map((p: any, index: number) => ({
                            id: p.id,
                            title: p.carouselTitle || p.name,
                            subtitle: p.carouselSubtitle || p.category,
                            description: p.carouselDescription || p.description,
                            price: typeof p.price === 'number' ? `${p.price.toLocaleString()} FCFA` : p.price,
                            color: BG_COLORS[index % BG_COLORS.length],
                            image: p.carouselImage || (p.images && p.images[0]) || p.image || '/placeholder-shoe.png' // Priority: Carousel Image -> First Product Image -> Image -> Placeholder
                        }));
                        setCarouselItems(mappedItems);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch featured products", err);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [carouselItems.length]); // Dep changes if items loaded

    const currentItem = carouselItems[currentIndex];

    return (
        <section className="relative bg-white min-h-[50vh] flex flex-col items-center pt-0 pb-16 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-100 rounded-full blur-[100px]" />
            </div>

            {/* 1. FULL WIDTH CAROUSEL - REDUCED HEIGHT - HIDDEN ON MOBILE */}
            <div className="w-full relative group h-[45vh] md:h-[55vh] hidden md:block">
                <div className="absolute inset-0 w-full h-full overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`absolute inset-0 w-full h-full ${currentItem.color}`}
                        >
                            <div className="container mx-auto px-4 h-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-0">
                                {/* Left: Text Content - MAXIMIZED */}
                                <div className="flex-1 md:pl-10 flex flex-col justify-center items-start text-left z-10 min-h-[50%] md:min-h-full py-8 md:py-0 w-full md:max-w-[60%]">
                                    <motion.div
                                        key={`text-${currentIndex}`} // Re-trigger animation
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="space-y-4 md:space-y-6 w-full pr-0 md:pr-12"
                                    >
                                        <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white/90 text-sm font-medium mb-2 border border-white/10">
                                            {currentItem.price}
                                        </div>
                                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight line-clamp-2">
                                            {currentItem.title}
                                        </h2>
                                        <p className="text-white/90 text-xl md:text-2xl font-light border-l-4 border-white/30 pl-6">
                                            {currentItem.subtitle}
                                        </p>
                                        <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed hidden md:block line-clamp-3">
                                            {currentItem.description}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Right: Image - ROUNDED & CONTAINED */}
                                <div className="flex-1 w-full h-[50%] md:h-full relative flex items-center justify-center p-4">
                                    <motion.div
                                        key={`img-${currentIndex}`}
                                        initial={{ x: 50, opacity: 0, scale: 0.9 }}
                                        animate={{ x: 0, opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="relative w-full h-full md:h-[85%] w-auto aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                                    >
                                        {/* Use img tag for base64 or Next Image with unoptimized for strict base64 */}
                                        <img
                                            src={currentItem.image}
                                            alt={currentItem.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Inner Border Highlight */}
                                        <div className="absolute inset-0 rounded-[3rem] border border-white/20 pointer-events-none" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows - Side */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full text-white transition-all transform hover:scale-105 border border-white/20 backdrop-blur-sm z-20"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full text-white transition-all transform hover:scale-105 border border-white/20 backdrop-blur-sm z-20"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-10 flex gap-2 z-20">
                        {carouselItems.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentIndex ? 'w-10 bg-white' : 'w-3 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center gap-8 max-w-7xl mt-8">

                {/* 2. SEARCH BAR - WIDENED */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-7xl relative"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex items-center bg-white rounded-xl shadow-xl">
                            <div className="pl-6 text-gray-400">
                                <Search className="w-6 h-6" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher un produit, une catégorie..."
                                className="w-full bg-transparent border-none px-4 py-5 text-gray-800 placeholder-gray-400 focus:ring-0 text-lg outline-none font-medium rounded-xl"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const term = encodeURIComponent(e.currentTarget.value);
                                        router.push(`/?q=${term}#shop`);
                                    }
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    if (input && input.value) {
                                        const term = encodeURIComponent(input.value);
                                        router.push(`/?q=${term}#shop`);
                                    }
                                }}
                                className="m-2 px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg hidden sm:block"
                            >
                                Recherche
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 3. UNIFIED ACTION BAR (Filters + Actions) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center justify-between gap-3 w-full max-w-7xl px-4 md:px-0"
                >
                    {/* Unified Minimal Buttons */}
                    <button className="flex-1 px-4 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
                        <Zap className="w-4 h-4" />
                        Flash Sale
                    </button>

                    <button
                        onClick={() => router.push('/?category=Mieux Noté#shop')}
                        className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap">
                        <Star className="w-4 h-4 text-gray-900" />
                        Les Mieux Notés
                    </button>

                    <button
                        onClick={() => router.push('/?category=Nouveautés#shop')}
                        className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap">
                        <Clock className="w-4 h-4 text-gray-900" />
                        Nouvel Arrivage
                    </button>

                    <button
                        onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <ArrowRight className="w-4 h-4 text-gray-900" />
                        Découvrir
                    </button>

                    <button
                        onClick={() => window.open('https://wa.me/237699999999', '_blank')}
                        className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Phone className="w-4 h-4 text-gray-900" />
                        Contact
                    </button>
                </motion.div>

            </div>
        </section >
    );
}
