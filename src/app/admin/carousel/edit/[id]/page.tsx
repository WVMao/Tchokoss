'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Check, MonitorPlay, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/canvasUtils';

export default function EditCarouselPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        carouselTitle: '',
        carouselSubtitle: '',
        carouselDescription: '',
        carouselImage: '',

        name: '',
        price: '',
        stock: '1',
        category: 'Featured',
        description: '',
        isFeatured: true,
        images: [] as string[]
    });

    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`/api/products?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        carouselTitle: data.carouselTitle || '',
                        carouselSubtitle: data.carouselSubtitle || '',
                        carouselDescription: data.carouselDescription || '',
                        carouselImage: data.carouselImage || '',

                        name: data.name || '',
                        price: data.price || '',
                        stock: data.stock || '1',
                        category: data.category || 'Featured',
                        description: data.description || '',
                        isFeatured: data.isFeatured || true,
                        images: data.images || []
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetching(false);
            }
        };
        if (id) fetchItem();
    }, [id]);

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
                        carouselImage: croppedImage
                        // We might NOT want to overwrite the main image here if editing, unless intended.
                        // Ideally keep them sync if it's purely a slide, but if it was a product, maybe not.
                        // For SAFETY, let's ONLY update carouselImage.
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
            const payload = {
                id,
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Mise à jour réussie');
                router.push('/admin/carousel');
                router.refresh();
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/carousel" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le Slide</h1>
                    <p className="text-gray-500">Mettez à jour les informations du carrousel.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 space-y-6">
                    <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5" />
                        Visuel & Contenu
                    </h2>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image du Slide</label>
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
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                                value={formData.carouselTitle}
                                onChange={e => setFormData({ ...formData, carouselTitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                                value={formData.carouselSubtitle}
                                onChange={e => setFormData({ ...formData, carouselSubtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            rows={3}
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                            value={formData.carouselDescription}
                            onChange={e => setFormData({ ...formData, carouselDescription: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                </div>
            </form>

            {/* Cropper Modal */}
            {croppingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
