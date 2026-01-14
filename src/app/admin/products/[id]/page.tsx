'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Check } from 'lucide-react';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/canvasUtils';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Chaussures',
        stock: '',
        imageUrl: '',
        images: [] as string[],
        isPromo: false,
        badge: '',
    });

    // Cropper State
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCroppingImage(reader.result as string);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            });
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleCropSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            if (croppingImage && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(croppingImage, croppedAreaPixels);
                if (croppedImage) {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, croppedImage]
                    }));
                    setCroppingImage(null);
                }
            }
        } catch (e) {
            console.error(e);
            alert('Erreur lors du recadrage');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.error) {
                        alert('Produit non trouvé');
                        router.push('/admin/products');
                    } else {
                        setFormData({
                            name: data.name,
                            description: data.description,
                            price: data.price,
                            category: data.category,
                            stock: data.stock,
                            imageUrl: data.image || data.imageUrl,
                            images: data.images || (data.image || data.imageUrl ? [data.image || data.imageUrl] : []),
                            isPromo: data.isPromo || false,
                            badge: data.badge || ''
                        });
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetching(false);
            }
        };
        if (id) fetchProduct();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                    image: formData.images.length > 0 ? formData.images[0] : formData.imageUrl,
                    images: formData.images,
                    badge: formData.badge
                })
            });

            if (res.ok) {
                alert('Produit modifié avec succès !');
                router.push('/admin/products');
                router.refresh();
            } else {
                alert('Erreur lors de la modification');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Chargement du produit...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le Produit</h1>
                    <p className="text-gray-500">Mettez à jour les informations ci-dessous.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Chaussures</option>
                            <option>Accessoires</option>
                            <option>Maison</option>
                            <option>Draps</option>
                            <option>Rideaux</option>
                            <option>Autre</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
                        <input
                            type="number"
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                        <input
                            type="number"
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.stock}
                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Badge / Étiquette</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.badge}
                            onChange={e => setFormData({ ...formData, badge: e.target.value })}
                        >
                            <option value="">Aucun</option>
                            <option value="Nouveau">Nouvel Arrivage</option>
                            <option value="Promo">En Promotion</option>
                            <option value="Best Seller">Mieux Noté</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images du produit (Plusieurs possibles)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {/* Image Previews */}
                        {formData.images && formData.images.map((img, idx) => (
                            <div key={idx} className="relative h-32 w-full border border-gray-200 rounded-xl overflow-hidden group">
                                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImages = formData.images.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, images: newImages });
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Upload Button */}
                        <div
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 font-medium">+ Ajouter</span>
                        </div>
                    </div>

                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">Vous pouvez sélectionner plusieurs images à la fois.</p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Enregistrement...' : 'Mettre à jour'}
                    </button>
                </div>
            </form>

            {croppingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl flex flex-col h-[80vh] shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Recadrer</h3>
                            <button onClick={() => setCroppingImage(null)} className="p-2 hover:bg-gray-200 rounded-full">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="relative flex-1 bg-gray-900 cursor-move">
                            <Cropper
                                image={croppingImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="p-6 bg-white border-t space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-600 min-w-[3rem]">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <span className="text-sm text-gray-500 w-8">{zoom.toFixed(1)}x</span>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setCroppingImage(null)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100">Annuler</button>
                                <button type="button" onClick={handleCropSave} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2"><Check className="w-5 h-5" /> Valider</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
