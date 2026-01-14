'use client';

import { Plus, Edit, Trash2, Search, MonitorPlay } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CarouselItem {
    id: string;
    carouselTitle?: string;
    carouselSubtitle?: string;
    carouselImage?: string;
    image?: string;
    imageUrl?: string;
    name: string;
    isFeatured: boolean;
}

export default function CarouselListPage() {
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        try {
            const res = await fetch('/api/products', { cache: 'no-store' }); // Logic handles fetching all, we filter client side or API side
            if (res.ok) {
                const data = await res.json();
                // Filter for featured items
                const featured = data.filter((p: any) => p.isFeatured === true);
                setItems(featured);
            }
        } catch (error) {
            console.error('Error fetching carousel items:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveFromCarousel = async (id: string) => {
        if (confirm('Voulez-vous retirer cet élément du carrousel ? (Le produit ne sera pas supprimé)')) {
            try {
                // Fetch current data first to keep other fields?
                // Actually our API logic for PUT merges?
                // We'll just PUT with isFeatured: false
                // But we need the full object to avoid overwriting?
                // Ideally API supports PATCH.
                // Assuming PUT requires full object -> safest to fetch then update, OR assuming the API handles partials (json-db usually does replace).
                // Let's rely on the fact that we have the object in `items` state (mostly).
                // BUT `items` might be partial.
                // Best practice: Fetch specific, then update.

                const itemRes = await fetch(`/api/products?id=${id}`);
                const itemData = await itemRes.json();

                const updated = { ...itemData, isFeatured: false };

                const res = await fetch('/api/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                });

                if (res.ok) {
                    setItems(items.filter(i => i.id !== id));
                } else {
                    alert('Erreur lors de la mise à jour');
                }
            } catch (error) {
                console.error(error);
                alert('Erreur serveur');
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion du Carrousel</h1>
                    <p className="text-gray-500">Gérez les diapositives de la page d'accueil.</p>
                </div>
                <Link href="/admin/carousel/new" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                    <Plus className="w-5 h-5" />
                    Nouveau Slide
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-emerald-50 border-b border-emerald-100">
                            <tr>
                                <th className="p-4 font-semibold text-emerald-800">Image</th>
                                <th className="p-4 font-semibold text-emerald-800">Titre (Slide)</th>
                                <th className="p-4 font-semibold text-emerald-800">Sous-titre</th>
                                <th className="p-4 font-semibold text-right text-emerald-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        Aucun slide actif. Ajoutez-en un !
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                <Image
                                                    src={item.carouselImage || item.image || item.imageUrl || '/placeholder.png'}
                                                    alt="Slide"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {item.carouselTitle || item.name}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {item.carouselSubtitle || '-'}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/carousel/edit/${item.id}`}
                                                className="inline-block p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveFromCarousel(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Retirer du carrousel"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
