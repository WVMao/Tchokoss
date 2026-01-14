'use client';

import { Plus, Edit, Trash2, Search, Loader2, MonitorPlay } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interface matching our Model
interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    isPromo: boolean;
    badge?: string;
    isFeatured?: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch('/api/products', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = products
        .filter(p => !p.isFeatured && p.category !== 'Featured') // Exclude Carousel Items
        .filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div>
            {/* ... (header and search) ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
                    <p className="text-gray-500">Ajoutez, modifiez ou supprimez vos articles.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/carousel/new" className="bg-white text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                        <MonitorPlay className="w-5 h-5" />
                        Nouveau Carrousel
                    </Link>
                    <Link href="/admin/products/new" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                        <Plus className="w-5 h-5" />
                        Nouveau Produit
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="flex-1 outline-none text-gray-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Nom</th>
                                <th className="p-4 font-semibold text-gray-600">Catégorie</th>
                                <th className="p-4 font-semibold text-gray-600">Prix</th>
                                <th className="p-4 font-semibold text-gray-600">Stock</th>
                                <th className="p-4 font-semibold text-gray-600">État</th>
                                <th className="p-4 font-semibold text-right text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="p-4 text-gray-500">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-emerald-600">{product.price.toLocaleString()} FCFA</td>
                                    <td className="p-4 text-gray-600">{product.stock}</td>
                                    <td className="p-4">
                                        {product.badge ? (
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${product.badge === 'Nouveau' ? 'bg-blue-50 text-blue-600' :
                                                product.badge === 'Promo' ? 'bg-orange-50 text-orange-600' :
                                                    product.badge === 'Best Seller' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {product.badge}
                                            </span>
                                        ) : (
                                            product.isPromo ? (
                                                <span className="text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded">Promo</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Aucun</span>
                                            )
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="inline-block p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('Delete requested for:', product.id);
                                                if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                                                    try {
                                                        const res = await fetch(`/api/products?id=${product.id}`, { method: 'DELETE' });
                                                        console.log('Delete response status:', res.status);
                                                        if (res.ok) {
                                                            setProducts(products.filter(p => p.id !== product.id));
                                                        } else {
                                                            const errText = await res.text();
                                                            console.error('Delete failed:', errText);
                                                            alert('Erreur lors de la suppression');
                                                        }
                                                    } catch (error) {
                                                        console.error('frontend delete error', error);
                                                        alert('Erreur serveur');
                                                    }
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        Aucun produit trouvé.
                    </div>
                )}
            </div>
        </div>
    );
}
