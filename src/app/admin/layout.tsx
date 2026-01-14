'use client';

import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show sidebar on login page
    if (pathname === '/admin') return <>{children}</>;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin/dashboard' },
        { icon: Package, label: 'Produits', href: '/admin/products' },
        { icon: MonitorPlay, label: 'Carrousel', href: '/admin/carousel' },
        { icon: ShoppingBag, label: 'Commandes', href: '/admin/orders' },
        { icon: Users, label: 'Clients', href: '/admin/customers' },
        { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="hover:opacity-80 transition-opacity" title="Retour au site">
                        <h2 className="text-2xl font-bold text-emerald-600 tracking-tighter">TCHOKOSS</h2>
                    </Link>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
