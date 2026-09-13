import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Package, CheckCircle2, Tags, ArrowUpRight } from 'lucide-react';

interface Stats {
    total_products: number;
    active_products: number;
    total_categories: number;
}

interface Props {
    stats: Stats;
}

export default function Dashboard({ stats }: Props) {
    const cards = [
        {
            title: 'Total Produk',
            value: stats.total_products,
            desc: 'Semua produk katalog',
            icon: Package,
            color: 'from-blue-500/10 to-indigo-500/10 text-indigo-600',
            border: 'border-indigo-100',
        },
        {
            title: 'Produk Aktif',
            value: stats.active_products,
            desc: 'Siap ditampilkan di web',
            icon: CheckCircle2,
            color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
            border: 'border-emerald-100',
        },
        {
            title: 'Total Kategori',
            value: stats.total_categories,
            desc: 'Kategori sprei & bedcover',
            icon: Tags,
            color: 'from-red-500/10 to-rose-500/10 text-[#EB2629]',
            border: 'border-gray-200',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            {/* Welcome banner */}
            <div className="bg-white rounded-2xl p-7 border border-gray-200/90 shadow-xs relative overflow-hidden mb-8">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">Selamat Datang di Admin Panel</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Kelola katalog produk sprei, atur varian & gambar, update kategori, serta konfigurasi template WhatsApp pemesanan langsung dari sini.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EB2629] text-white font-medium text-sm rounded-xl shadow-xs hover:bg-[#D01E21] transition-all"
                        >
                            + Tambah Produk
                        </Link>
                        <Link
                            href="/admin/categories"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm rounded-xl border border-gray-200 transition-colors"
                        >
                            Kelola Kategori
                        </Link>
                    </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-50/40 to-transparent pointer-events-none" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className={`bg-white rounded-2xl p-6 border ${card.border} shadow-2xs flex items-center justify-between`}
                        >
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                                <p className="text-3xl font-bold font-serif text-gray-800 mt-1">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <Icon className="w-7 h-7" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions & Tips */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                <h3 className="font-serif font-bold text-lg text-gray-800 mb-4">Akses Cepat & Alur Kerja</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/admin/products"
                        className="p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 transition-all flex items-center justify-between group"
                    >
                        <div>
                            <p className="font-semibold text-sm text-gray-800 group-hover:text-[#EB2629] transition-colors">Katalog Produk</p>
                            <p className="text-xs text-gray-500 mt-0.5">Lihat, ubah harga varian, aktif/nonaktifkan produk</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#EB2629] transition-colors" />
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 transition-all flex items-center justify-between group"
                    >
                        <div>
                            <p className="font-semibold text-sm text-gray-800 group-hover:text-[#EB2629] transition-colors">Pengaturan Toko & WA</p>
                            <p className="text-xs text-gray-500 mt-0.5">Atur nomor WhatsApp tujuan pesanan & hero text</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#EB2629] transition-colors" />
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
