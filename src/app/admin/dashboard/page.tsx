'use client';

import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        { label: "Ventes du mois", value: "1 250 000 FCFA", icon: DollarSign, color: "bg-emerald-500" },
        { label: "Commandes", value: "145", icon: ShoppingBag, color: "bg-orange-500" },
        { label: "Nouveaux Clients", value: "34", icon: Users, color: "bg-blue-500" },
        { label: "Taux de conversion", value: "3.2%", icon: TrendingUp, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-500">Bienvenue sur votre espace de gestion Tchokoss.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                    <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Commandes Récentes</h3>
                    <button className="text-sm text-emerald-600 font-medium hover:underline">Voir tout</button>
                </div>
                <div className="p-6 text-center py-12 text-gray-400">
                    En attente de commandes...
                </div>
            </div>
        </div>
    );
}
