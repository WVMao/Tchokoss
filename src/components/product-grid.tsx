'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Heart, ArrowDown, ShoppingBag, X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ProductGridProps {
    title: string;
    subtitle?: string;
    limit?: number;
    filterType?: 'all' | 'new' | 'rating' | 'promo';
    showTabs?: boolean;
    enableLoadMore?: boolean;
}

export function ProductGrid({
    title,
    subtitle,
    limit = 100,
    filterType = 'all',
    showTabs = true,
    enableLoadMore = false
}: ProductGridProps) {
    const { addToCart } = useCart();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q')?.toLowerCase() || '';
    const [activeCategory, setActiveCategory] = useState("Tout");
    const [products, setProducts] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(limit);

    // Order Modal State
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [deliveryLocation, setDeliveryLocation] = useState("");

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setActiveCategory(categoryParam);
        }
        setVisibleCount(limit);
    }, [limit, searchParams]);

    useEffect(() => {
        fetch('/api/products', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                // Determine badge based on newness or random for demo
                const productsWithBadges = data.map((p: any) => ({
                    ...p,
                    // If created in last 24h, tag new. Else random for demo aesthetics if missing
                    badge: p.badge || ((new Date(p.createdAt).getTime() > Date.now() - 86400000 * 7) ? "Nouveau" : (p.isPromo ? "Promo" : null))
                }));
                setProducts(productsWithBadges);
            })
            .catch(err => console.error("Failed to load products", err));
    }, []);

    const categories = Array.from(new Set([
        "Tout",
        "Nouveautés",
        "Mieux Noté",
        "Chaussures",
        "Accessoires",
        "Maison",
        "Draps",
        "Rideaux",
        "Autre",
        ...products.map(p => p.category)
    ]));

    // Fuzzy Search Helper (Levenshtein Distance)
    const getLevenshteinDistance = (a: string, b: string) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const filteredProducts = products.filter(p => {
        // 0. Exclude Carousel Items (Featured)
        if (p.isFeatured || p.category === 'Featured') return false;

        // 1. Primary Filter (by Section Type) - STRICT MATCHING
        if (filterType === 'new' && p.badge !== 'Nouveau') return false;
        if (filterType === 'rating' && p.badge !== 'Best Seller') return false;
        if (filterType === 'promo' && (p.badge !== 'Promo' && !p.isPromo)) return false;

        // 2. Category Filter
        let matchesCategory = true;
        if (activeCategory === "Tout") {
            matchesCategory = true;
        } else if (activeCategory === "Mieux Noté") {
            matchesCategory = p.badge === "Best Seller";
        } else if (activeCategory === "Nouveautés") {
            matchesCategory = p.badge === "Nouveau";
        } else {
            matchesCategory = p.category === activeCategory;
        }

        // 3. Search Filter (Fuzzy)
        let matchesSearch = true;
        if (searchQuery) {
            const productName = p.name.toLowerCase();
            const productCategory = p.category ? p.category.toLowerCase() : '';

            // Direct text match
            const directMatch = productName.includes(searchQuery) || productCategory.includes(searchQuery);

            // Fuzzy match (allow up to 3 errors for longer words)
            const fuzzyMatchName = getLevenshteinDistance(searchQuery, productName.slice(0, Math.max(searchQuery.length + 2, productName.length))) <= 3;
            // Check if search query is close to category name
            const fuzzyMatchCategory = productCategory && getLevenshteinDistance(searchQuery, productCategory) <= 3;

            matchesSearch = directMatch || fuzzyMatchName || fuzzyMatchCategory;
        }

        return matchesCategory && matchesSearch;
    });

    // Apply limit / pagination
    const displayProducts = filteredProducts.slice(0, visibleCount);

    // Helper to format price if it's a number
    const formatPrice = (price: any) => {
        if (typeof price === 'number') {
            return price.toLocaleString() + ' FCFA';
        }
        return price;
    };

    return (
        <section id="shop" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
                    {subtitle && <p className="text-gray-500 max-w-2xl mx-auto mb-8">{subtitle}</p>}

                    {/* Category Filter Tabs */}
                    {showTabs && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat as string)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                        ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
                                        }`}
                                >
                                    {cat as string}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {displayProducts.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hover:gap-6 transition-all"
                    >
                        {displayProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                addToCart={addToCart}
                                onWhatsAppClick={() => {
                                    setSelectedProduct(product);
                                    setDeliveryLocation("");
                                    setIsOrderModalOpen(true);
                                }}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {searchQuery ? "Oups, aucun produit trouvé." : "Aucun article disponible."}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchQuery ? (
                                <>
                                    Le produit <span className="font-semibold text-emerald-600">"{searchQuery}"</span> n'est pas disponible pour le moment.
                                    <br /> Essayez "chaussures", "montre" ou "sac".
                                </>
                            ) : (
                                "Désolé, il n'y a pas encore d'articles dans cette catégorie. Revenez bientôt !"
                            )}
                        </p>
                    </div>
                )}

                {/* Load More Button */}
                {enableLoadMore && visibleCount < filteredProducts.length && (
                    <div className="text-center mt-12">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setVisibleCount(prev => prev + 8)}
                            className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <ArrowDown className="w-5 h-5 animate-bounce" />
                            Regarder la suite
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Location Request Modal */}
            <AnimatePresence>
                {isOrderModalOpen && selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOrderModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl z-[101]"
                        >
                            <button
                                onClick={() => setIsOrderModalOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="bg-[#25D366]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-[#25D366]" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Lieu de livraison ?</h3>
                                <p className="text-gray-500 mt-2">
                                    Pour accélérer votre commande de <span className="font-bold text-gray-800">{selectedProduct.name}</span>.
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
                                    placeholder="Ex: Douala, Akwa..."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#25D366] focus:ring-0 transition-colors bg-gray-50 font-medium"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && deliveryLocation.trim()) {
                                            const phoneNumber = "237699999999";
                                            const message = `Bonjour, je suis intéressé par : *${selectedProduct.name}* (${formatPrice(selectedProduct.price)}).\n\n📍 *Lieu de livraison* : ${deliveryLocation}`;
                                            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                            window.open(url, '_blank');
                                            setIsOrderModalOpen(false);
                                        }
                                    }}
                                />
                            </div>

                            <button
                                disabled={!deliveryLocation.trim()}
                                onClick={() => {
                                    const phoneNumber = "237699999999";
                                    const message = `Bonjour, je suis intéressé par : *${selectedProduct.name}* (${formatPrice(selectedProduct.price)}).\n\n📍 *Lieu de livraison* : ${deliveryLocation}`;
                                    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                    window.open(url, '_blank');
                                    setIsOrderModalOpen(false);
                                }}
                                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-200/50 flex items-center justify-center gap-2"
                            >
                                Continuer sur WhatsApp
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16H12.05Z" />
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

function ProductCard({ product, index, addToCart, onWhatsAppClick }: any) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Collect all valid images: first 'images' array, then fallback 'image' or 'imageUrl'
    // Ensure unique and valid strings
    const allImages = [
        ...(product.images || []),
        product.image,
        product.imageUrl
    ].filter(img => img && typeof img === 'string' && img.length > 5); // Filter out short placeholder strings possibly

    // Deduplicate
    const uniqueImages = Array.from(new Set(allImages));
    // If empty, use placeholder
    const imagesToUse = uniqueImages.length > 0 ? uniqueImages : ['/placeholder-shoe.png'];

    const currentImage = imagesToUse[currentImageIndex % imagesToUse.length];

    const nextImage = (e: any) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % imagesToUse.length);
    };

    const prevImage = (e: any) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + imagesToUse.length) % imagesToUse.length);
    };

    const formatPrice = (price: any) => {
        if (typeof price === 'number') {
            return price.toLocaleString() + ' FCFA';
        }
        return price;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index % 4 * 0.1 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 relative border border-transparent hover:border-emerald-100 flex flex-row h-36 md:h-40"
        >
            {/* Image Area */}
            <div className="relative w-32 md:w-48 h-full bg-gray-100 shrink-0">
                <motion.img
                    key={currentImage} // Key helps animation on switch
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Navigation Arrows (Only if multiple images) */}
                {imagesToUse.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
                        </button>
                    </>
                )}

                {/* Badge */}
                {product.badge && (
                    <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm
                    ${product.badge === 'Nouveau' ? 'bg-yellow-400 text-yellow-900' : 'bg-emerald-100 text-emerald-800'}`}>
                        {product.badge}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                    <span className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 block">
                        {product.category}
                    </span>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 leading-snug line-clamp-2" title={product.name}>{product.name}</h3>
                </div>
                <div className="flex items-end justify-between">
                    <span className="text-base md:text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    <div className="flex gap-2">
                        {/* WhatsApp Button */}
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onWhatsAppClick();
                            }}
                            className="p-1.5 md:p-2 bg-[#25D366] text-white rounded-full shadow-md hover:shadow-green-200 flex items-center justify-center"
                            title="Commander sur WhatsApp"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16H12.05Z" />
                            </svg>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                            }}
                            className="p-1.5 md:p-2 bg-gray-900 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-md hover:shadow-emerald-200 flex items-center justify-center"
                        >
                            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
