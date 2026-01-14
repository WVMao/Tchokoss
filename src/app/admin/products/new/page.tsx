'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Check } from 'lucide-react';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/canvasUtils';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
        badge: ''
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                    imageUrl: formData.images.length > 0 ? formData.images[0] : (formData.imageUrl || '/placeholder-shoe.png'),
                    images: formData.images
                })
            });

            if (res.ok) {
                router.push('/admin/products');
                router.refresh();
            } else {
                alert('Erreur lors de la création');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nouveau Produit</h1>
                    <p className="text-gray-500">Ajouter et recadrer vos images.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">

                {/* Basic Info Grid */}
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
                            {/* Categories */}
                            {['Chaussures', 'Accessoires', 'Maison', 'Draps', 'Rideaux', 'Autre'].map(cat => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
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

                {/* Price/Stock Grid */}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.badge}
                            onChange={e => setFormData({ ...formData, badge: e.target.value })}
                        >
                            <option value="">Aucun</option>
                            <option value="Nouveau">Nouveau</option>
                            <option value="Promo">Promo</option>
                            <option value="Best Seller">Best Seller</option>
                        </select>
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images (Recadrage automatique)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative h-32 w-full border border-gray-200 rounded-xl overflow-hidden group">
                                <img src={img} alt="Product" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <div
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 font-medium">+ Ajouter Image</span>
                        </div>
                    </div>

                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>

            {/* Cropper Modal */}
            {croppingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl flex flex-col h-[80vh] shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-lg text-gray-800">Recadrer l'image</h3>
                            <button onClick={() => setCroppingImage(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="relative flex-1 bg-gray-900">
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

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCroppingImage(null)}
                                    className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropSave}
                                    className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200"
                                >
                                    <Check className="w-5 h-5" />
                                    Valider le recadrage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
