import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, Star, Package, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import ProductDetailModal, { ProductDetailModalData } from '@/Components/Admin/ProductDetailModal';

interface Category {
    id: number;
    name: string;
}

interface VariantItem {
    id: number;
    label: string;
    price: number;
    final_price?: number;
}

interface ProductItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    stock_status: 'available' | 'out_of_stock' | 'pre_order';
    preorder_days?: number;
    category_id: number;
    is_active: boolean;
    is_featured: boolean;
    primary_image?: { path: string };
    images?: Array<{ id: number; path: string; is_primary?: boolean }>;
    variants?: VariantItem[];
}

interface Props {
    products: ProductItem[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        search?: string;
        category_id?: number | null;
    };
}

export default function ProductIndex({ products, meta, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
        filters.category_id ? String(filters.category_id) : ''
    );
    const [previewProduct, setPreviewProduct] = useState<ProductDetailModalData | null>(null);

    const applyFilters = (newSearch: string, newCategoryId: string) => {
        const query: Record<string, any> = {};
        if (newSearch) query.search = newSearch;
        if (newCategoryId) query.category_id = newCategoryId;
        router.get('/admin/products', query, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, selectedCategoryId);
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategoryId(catId);
        applyFilters(search, catId);
    };

    const handleResetFilter = () => {
        setSearch('');
        setSelectedCategoryId('');
        router.get('/admin/products', {}, { preserveState: true });
    };

    const handleToggle = (id: number) => {
        router.patch(`/admin/products/${id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
            router.delete(`/admin/products/${id}`, { preserveScroll: true });
        }
    };

    const getStockBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">Tersedia</span>;
            case 'out_of_stock':
                return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs rounded-full border border-rose-200">Habis</span>;
            case 'pre_order':
                return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">Pre-Order</span>;
            default:
                return null;
        }
    };

    const getCategoryName = (catId: number) => {
        const found = categories.find((c) => c.id === catId);
        return found ? found.name : '-';
    };

    return (
        <AdminLayout title="Katalog Produk">
            <Head title="Katalog Produk" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-serif font-bold text-gray-800">Daftar Produk</h3>
                    <p className="text-xs text-gray-500">Total {meta.total} produk terdaftar di toko</p>
                </div>

                <Link
                    href="/admin/products/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EB2629] hover:bg-[#D01E21] text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Produk Baru
                </Link>
            </div>

            {/* Filter & Search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama sprei atau motif..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                        />
                    </form>

                    {/* Category Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                value={selectedCategoryId}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="pl-8.5 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none cursor-pointer appearance-none"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]">▼</span>
                        </div>

                        {(search || selectedCategoryId) && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="text-xs text-gray-500 hover:text-[#EB2629] font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                <span className="text-xs text-gray-400 hidden sm:inline">
                    Menampilkan <strong className="text-gray-700">{products.length}</strong> dari {meta.total}
                </span>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Produk</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Harga Dasar</th>
                                <th className="px-6 py-4">Stok</th>
                                <th className="px-6 py-4">Status Tampil</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                        Belum ada produk ditemukan
                                    </td>
                                </tr>
                            ) : (
                                products.map((prod) => {
                                    const imgPath = prod.primary_image?.path || (prod.images && prod.images[0]?.path);

                                    return (
                                        <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                                                        {imgPath ? (
                                                            <img
                                                                src={imgPath.startsWith('http') ? imgPath : imgPath.startsWith('uploads/') ? `/${imgPath}` : `/uploads/${imgPath}`}
                                                                onError={(e) => {
                                                                    const target = e.currentTarget;
                                                                    if (!target.src.includes('/storage/')) {
                                                                        target.src = `/storage/${imgPath}`;
                                                                    }
                                                                }}
                                                                alt={prod.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-semibold text-gray-900">{prod.name}</span>
                                                            {prod.is_featured && (
                                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" title="Featured" />
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-mono">/{prod.slug}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                                {getCategoryName(prod.category_id)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 text-xs">
                                                {formatRupiah(prod.base_price)}
                                            </td>
                                            <td className="px-6 py-4">{getStockBadge(prod.stock_status)}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(prod.id)}
                                                    className="cursor-pointer"
                                                    title="Klik untuk toggle status"
                                                >
                                                    {prod.is_active ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium hover:underline">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium hover:underline">
                                                            <XCircle className="w-3.5 h-3.5" /> Nonaktif
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewProduct(prod)}
                                                        className="p-2 text-gray-500 hover:text-[#EB2629] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Lihat Preview Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/products/${prod.id}/edit`}
                                                        className="p-2 text-gray-500 hover:text-[#EB2629] hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Ubah Produk"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(prod.id, prod.name)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Hapus Produk"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {meta && meta.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
                        <p className="text-xs text-gray-500">
                            Halaman <span className="font-semibold text-gray-800">{meta.current_page}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{meta.last_page}</span> (Total {meta.total} produk)
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={meta.current_page <= 1}
                                onClick={() => router.get('/admin/products', { search, category_id: selectedCategoryId || undefined, page: meta.current_page - 1 }, { preserveState: true })}
                                className="p-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-[#EB2629] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors cursor-pointer"
                                title="Halaman Sebelumnya"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    type="button"
                                    onClick={() => router.get('/admin/products', { search, category_id: selectedCategoryId || undefined, page: pageNum }, { preserveState: true })}
                                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                        pageNum === meta.current_page
                                            ? 'bg-[#EB2629] text-white shadow-xs'
                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-[#EB2629]'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                type="button"
                                disabled={meta.current_page >= meta.last_page}
                                onClick={() => router.get('/admin/products', { search, category_id: selectedCategoryId || undefined, page: meta.current_page + 1 }, { preserveState: true })}
                                className="p-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-[#EB2629] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors cursor-pointer"
                                title="Halaman Berikutnya"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Detail / Preview Produk */}
            <ProductDetailModal
                product={previewProduct}
                categoryName={previewProduct ? getCategoryName(previewProduct.category_id) : undefined}
                isOpen={!!previewProduct}
                onClose={() => setPreviewProduct(null)}
            />
        </AdminLayout>
    );
}
