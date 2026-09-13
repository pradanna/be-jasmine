import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { NewImageUploader } from '@/Components/Admin/ImageUploader';
import VariantEditor, { VariantItem } from '@/Components/Admin/VariantEditor';
import WysiwygEditor from '@/Components/Admin/WysiwygEditor';
import AddCategoryModal from '@/Components/Admin/AddCategoryModal';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function ProductCreate({ categories: initialCategories }: Props) {
    const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [primaryIndex, setPrimaryIndex] = useState<number>(0);
    const [variants, setVariants] = useState<VariantItem[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: initialCategories.length > 0 ? initialCategories[0].id : '',
        base_price: '',
        stock_status: 'pre_order',
        preorder_days: '14',
        description: '',
        is_active: true,
        is_featured: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category_id', String(data.category_id));
        formData.append('base_price', String(data.base_price));
        formData.append('stock_status', data.stock_status);
        formData.append('preorder_days', String(data.preorder_days || 14));
        formData.append('description', data.description || '');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('primary_image_index', String(primaryIndex));

        // Append images
        selectedFiles.forEach((file) => {
            formData.append('images[]', file);
        });

        // Append variants
        variants.forEach((v, idx) => {
            formData.append(`variants[${idx}][label]`, v.label);
            formData.append(`variants[${idx}][price]`, String(v.price ?? (v.price_modifier ?? 0)));
            formData.append(`variants[${idx}][price_modifier]`, '0');
        });

        post('/admin/products', {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Tambah Produk Baru">
            <Head title="Tambah Produk Baru" />

            <div className="max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#EB2629] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                        <h4 className="font-serif font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">
                            Informasi Dasar Produk
                        </h4>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Nama Sprei / Bedcover
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Sprei Katun Jepang Motif Sakura Pink"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Kategori
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className="inline-flex items-center gap-1 text-xs text-[#EB2629] hover:text-[#D01E21] font-semibold hover:underline cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Tambah
                                    </button>
                                </div>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                                    required
                                >
                                    {categoryList.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Harga Dasar (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    placeholder="150000"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none font-mono"
                                    required
                                />
                                {errors.base_price && <p className="text-xs text-red-500 mt-1">{errors.base_price}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Status Ketersediaan
                                </label>
                                <select
                                    value={data.stock_status}
                                    onChange={(e) => setData('stock_status', e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                                >
                                    <option value="pre_order">Pre-Order (PO)</option>
                                    <option value="available">Tersedia (Ready Stock)</option>
                                    <option value="out_of_stock">Habis (Stok Kosong)</option>
                                </select>
                            </div>

                            {data.stock_status === 'pre_order' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Waktu Pengerjaan PO (Hari)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="90"
                                        value={data.preorder_days}
                                        onChange={(e) => setData('preorder_days', e.target.value)}
                                        placeholder="14"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none font-mono"
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1">Ditampilkan ke pembeli: "Pre-Order (dikirim dalam {data.preorder_days || 14} hari)"</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Deskripsi Produk (WYSIWYG Editor)
                                </label>
                                <span className="text-[11px] text-gray-400">Gunakan format tebal, miring, list poin, atau judul</span>
                            </div>
                            <WysiwygEditor
                                content={data.description}
                                onChange={(html) => setData('description', html)}
                            />
                        </div>

                        <div className="flex gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-[#EB2629] focus:ring-[#EB2629]/20 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Tampilkan di Website (Aktif)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="w-4 h-4 rounded text-[#EB2629] focus:ring-[#EB2629]/20 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Produk Unggulan (Featured)</span>
                            </label>
                        </div>
                    </div>

                    {/* Image Uploader Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <h4 className="font-serif font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 mb-4">
                            Foto & Galeri Produk
                        </h4>
                        <NewImageUploader
                            files={selectedFiles}
                            primaryIndex={primaryIndex}
                            onFilesChange={setSelectedFiles}
                            onSetPrimaryIndex={setPrimaryIndex}
                        />
                    </div>

                    {/* Variants Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <h4 className="font-serif font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 mb-4">
                            Pilihan Ukuran & Varian
                        </h4>
                        <VariantEditor
                            variants={variants}
                            defaultPrice={parseFloat(data.base_price) || 0}
                            onChange={setVariants}
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href="/admin/products"
                            className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EB2629] hover:bg-[#D01E21] text-white font-medium text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            <Save className="w-4 h-4" /> Simpan Produk
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal Tambah Kategori */}
            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onCategoryAdded={(newCat) => {
                    setCategoryList((prev) => [...prev, newCat]);
                    setData('category_id', String(newCat.id));
                }}
            />
        </AdminLayout>
    );
}
