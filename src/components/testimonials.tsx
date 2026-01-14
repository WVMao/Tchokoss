'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    { id: 1, name: "Aminata D.", role: "Entrepreneuse", text: "J'ai reçu ma commande en 24h. La qualité des chaussures est incroyable, digne des grandes marques.", rating: 5 },
    { id: 2, name: "Moussa S.", role: "Étudiant", text: "Le service client est au top. J'ai pu échanger ma taille sans problème. Tchokoss est mon site préféré !", rating: 5 },
    { id: 3, name: "Sophie K.", role: "Maman", text: "Les draps sont d'une douceur... Je recommande vivement pour la maison.", rating: 4 },
];

export function Testimonials() {
    return (
        <section className="py-20 bg-emerald-900 text-white overflow-hidden relative">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ils nous font confiance</h2>
                    <p className="text-emerald-100 max-w-2xl mx-auto">Rejoignez des milliers de clients satisfaits qui ont choisi la qualité et le style Tchokoss.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-emerald-800/50 backdrop-blur-sm p-8 rounded-3xl border border-emerald-700 hover:border-emerald-500 transition-colors"
                        >
                            <Quote className="w-10 h-10 text-yellow-400 mb-6 opacity-80" />
                            <p className="text-emerald-50 mb-6 leading-relaxed italic">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-800 font-bold text-xl">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold">{t.name}</h4>
                                    <p className="text-xs text-emerald-300">{t.role}</p>
                                </div>
                                <div className="ml-auto flex gap-1">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-sm">★</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
