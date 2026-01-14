'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Check, MonitorPlay, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/canvasUtils';

export default function NewCarouselPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Carousel Fields
        carouselTitle: '',
        carouselSubtitle: '',
        carouselDescription: '',
        carouselImage: '',

        // Product Fields (Required by DB)
        name: '', // Will default to Title if empty
        price: '',
        stock: '1',
        category: 'Featured',
        description: '', // Will default to Carousel Desc
        isFeatured: true, // Always true for this form
        images: [] as string[] // Can be empty or same as carousel image
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
                        carouselImage: croppedImage,
                        imageUrl: croppedImage // Also set primary image
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
            // Prepare payload - Fill in required Product fields if missing
            const payload = {
                ...formData,
                name: formData.name || formData.carouselTitle || 'Slide Sans Titre',
                description: formData.description || formData.carouselDescription || '',
                price: Number(formData.price) || 0,
                stock: Number(formData.stock),
                // Ensure images array has at least the carousel image if empty
                images: formData.images.length > 0 ? formData.images : (formData.carouselImage ? [formData.carouselImage] : [])
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/carousel'); // Redirect to carousel list (to be created) or products?
                router.refresh(); // Or redirect to home to see it?
            } else {
                alert('Erreur lors de la création du slide');
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
                    <h1 className="text-2xl font-bold text-gray-900">Nouveau Slide Carrousel</h1>
                    <p className="text-gray-500">Créer un élément mis en avant pour la page d'accueil.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Visuals Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 space-y-6">
                    <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5" />
                        Visuel & Contenu Principal
                    </h2>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image du Slide (Format 4:3 recommandé)</label>
                        {formData.carouselImage ? (
                            <div className="relative h-64 w-full md:w-2/3 border border-gray-200 rounded-xl overflow-hidden group bg-gray-900 mx-auto md:mx-0">
                                <img src={formData.carouselImage} alt="Carousel" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, carouselImage: '' }))}
                                    className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => document.getElementById('carousel-upload')?.click()}
                                className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50 transition-colors w-full md:w-2/3"
                            >
                                <ImageIcon className="w-12 h-12 text-emerald-400 mb-3" />
                                <span className="text-base text-emerald-700 font-bold">Sélectionner une image</span>
                            </div>
                        )}
                        <input
                            id="carousel-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Titre Principal</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Nouvelle Collection"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                                value={formData.carouselTitle}
                                onChange={e => setFormData({ ...formData, carouselTitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre (Catégorie)</label>
                            <input
                                type="text"
                                placeholder="Ex: Élégance"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                                value={formData.carouselSubtitle}
                                onChange={e => setFormData({ ...formData, carouselSubtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description / Accroche</label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Une brève description pour donner envie..."
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.carouselDescription}
                            onChange={e => setFormData({ ...formData, carouselDescription: e.target.value })}
                        />
                    </div>
                </div>

                {/* Product Details (Collapsible or Secondary) */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Détails du Produit (Optionnel)</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom Interne</label>
                            <input
                                type="text"
                                placeholder="Identique au titre par défaut"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Ces informations sont utilisées si l'utilisateur clique sur le bouton "Commander" du slide.
                    </p>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Création...' : 'Créer le Slide'}
                    </button>
                </div>
            </form>

            {/* Cropper Modal */}
            {croppingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl flex flex-col h-[80vh] shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Recadrer pour le Carrousel</h3>
                            <button onClick={() => setCroppingImage(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
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
                                    Valider le visuel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
