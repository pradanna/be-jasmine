import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ExistingImageManager, NewImageUploader, ProductImageItem } from '@/Components/Admin/ImageUploader';
import VariantEditor, { VariantItem } from '@/Components/Admin/VariantEditor';
import WysiwygEditor from '@/Components/Admin/WysiwygEditor';
import AddCategoryModal from '@/Components/Admin/AddCategoryModal';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    stock_status: 'available' | 'out_of_stock' | 'pre_order';
    category_id: number;
    is_active: boolean;
    is_featured: boolean;
    images: ProductImageItem[];
    variants: VariantItem[];
}

interface Props {
    product: ProductDetail;
    categories: Category[];
}

export default function ProductEdit({ product, categories: initialCategories }: Props) {
    const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [name, setName] = useState(product.name);
    const [categoryId, setCategoryId] = useState(product.category_id);
    const [basePrice, setBasePrice] = useState(String(product.base_price));
    const [stockStatus, setStockStatus] = useState(product.stock_status);
    const [preorderDays, setPreorderDays] = useState(String((product as any).preorder_days || 14));
    const [description, setDescription] = useState(product.description || '');
    const [isActive, setIsActive] = useState(product.is_active);
    const [isFeatured, setIsFeatured] = useState(product.is_featured);

    // Image management state
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [primaryImageId, setPrimaryImageId] = useState<number | null>(null);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    // Variants state
    const [variants, setVariants] = useState<VariantItem[]>(product.variants || []);
    const [processing, setProcessing] = useState(false);

    const toggleDeleteImage = (id: number) => {
        if (deletedImageIds.includes(id)) {
            setDeletedImageIds(deletedImageIds.filter((i) => i !== id));
        } else {
            setDeletedImageIds([...deletedImageIds, id]);
            if (primaryImageId === id) {
                setPrimaryImageId(null);
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category_id', String(categoryId));
        formData.append('base_price', String(basePrice));
        formData.append('stock_status', stockStatus);
        formData.append('preorder_days', String(preorderDays || 14));
        formData.append('description', description);
        formData.append('is_active', isActive ? '1' : '0');
        formData.append('is_featured', isFeatured ? '1' : '0');

        if (primaryImageId !== null) {
            formData.append('primary_image_id', String(primaryImageId));
        }

        // Deleted images
        deletedImageIds.forEach((id) => {
            formData.append('delete_image_ids[]', String(id));
        });

        // New uploaded files
        newFiles.forEach((file) => {
            formData.append('new_images[]', file);
        });

        // Variants
        variants.forEach((v, idx) => {
            formData.append(`variants[${idx}][label]`, v.label);
            formData.append(`variants[${idx}][price]`, String(v.price ?? (v.price_modifier ?? 0)));
            formData.append(`variants[${idx}][price_modifier]`, '0');
        });

        router.post(`/admin/products/${product.id}`, formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title={`Ubah Produk: ${product.name}`}>
            <Head title={`Ubah: ${product.name}`} />

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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                                required
                            />
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
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
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
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Status Ketersediaan
                                </label>
                                <select
                                    value={stockStatus}
                                    onChange={(e) => setStockStatus(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                                >
                                    <option value="pre_order">Pre-Order (PO)</option>
                                    <option value="available">Tersedia (Ready Stock)</option>
                                    <option value="out_of_stock">Habis (Stok Kosong)</option>
                                </select>
                            </div>

                            {stockStatus === 'pre_order' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Waktu Pengerjaan PO (Hari)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="90"
                                        value={preorderDays}
                                        onChange={(e) => setPreorderDays(e.target.value)}
                                        placeholder="14"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none font-mono"
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1">Ditampilkan ke pembeli: "Pre-Order (dikirim dalam {preorderDays || 14} hari)"</p>
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
                                content={description}
                                onChange={setDescription}
                            />
                        </div>

                        <div className="flex gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#EB2629] focus:ring-[#EB2629]/20 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Tampilkan di Website (Aktif)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#EB2629] focus:ring-[#EB2629]/20 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Produk Unggulan (Featured)</span>
                            </label>
                        </div>
                    </div>

                    {/* Existing Images */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                        <h4 className="font-serif font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">
                            Foto Produk yang Sudah Ada
                        </h4>
                        <ExistingImageManager
                            images={product.images || []}
                            primaryId={primaryImageId}
                            deletedIds={deletedImageIds}
                            onToggleDelete={toggleDeleteImage}
                            onSetPrimary={setPrimaryImageId}
                        />
                    </div>

                    {/* Add New Images */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <h4 className="font-serif font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 mb-4">
                            Tambah Foto Baru
                        </h4>
                        <NewImageUploader
                            files={newFiles}
                            primaryIndex={0}
                            onFilesChange={setNewFiles}
                        />
                    </div>

                    {/* Variants */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <h4 className="font-serif font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 mb-4">
                            Pilihan Ukuran & Varian
                        </h4>
                        <VariantEditor
                            variants={variants}
                            defaultPrice={parseFloat(basePrice) || 0}
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
                            <Save className="w-4 h-4" /> Simpan Perubahan
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
                    setCategoryId(newCat.id);
                }}
            />
        </AdminLayout>
    );
}
