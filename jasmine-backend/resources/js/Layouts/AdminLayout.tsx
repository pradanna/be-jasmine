import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Package, Tags, Settings, LogOut, Store } from 'lucide-react';

interface Props {
    title?: string;
    children: React.ReactNode;
}

export default function AdminLayout({ title, children }: Props) {
    const { url, props } = usePage<any>();
    const flash = props.flash || {};

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, active: url.startsWith('/admin/dashboard') },
        { name: 'Produk', href: '/admin/products', icon: Package, active: url.startsWith('/admin/products') },
        { name: 'Kategori', href: '/admin/categories', icon: Tags, active: url.startsWith('/admin/categories') },
        { name: 'Pengaturan', href: '/admin/settings', icon: Settings, active: url.startsWith('/admin/settings') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-xs">
                <div className="p-6 border-b border-gray-100 flex flex-col items-start gap-2">
                    <picture>
                        <source srcSet="/assets/images/logo.webp" type="image/webp" />
                        <img
                            src="/assets/images/logo.png"
                            alt="Jasmine Sprei Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </picture>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#EB2629] bg-[#EB2629]/10 px-2 py-0.5 rounded-md">
                        Admin Backoffice
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                                    item.active
                                        ? 'bg-[#EB2629]/10 text-[#EB2629] font-semibold shadow-2xs'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${item.active ? 'text-[#EB2629]' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
                    <h2 className="text-xl font-bold font-serif text-gray-800">
                        {title || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium border border-gray-200">
                            Admin Mode
                        </span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-8">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center justify-between shadow-xs">
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between shadow-xs">
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
