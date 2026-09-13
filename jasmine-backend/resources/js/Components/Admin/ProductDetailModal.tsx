import React from 'react';
import { X, ExternalLink, Calendar, Layers, Tag, Eye, CheckCircle2, Clock } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface Variant {
    id: number;
    label: string;
    price: number;
    final_price?: number;
}

interface ImageItem {
    id: number;
    path: string;
    is_primary?: boolean;
}

export interface ProductDetailModalData {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    stock_status: 'available' | 'out_of_stock' | 'pre_order';
    preorder_days?: number;
    category_id: number;
    category_name?: string;
    is_active: boolean;
    is_featured: boolean;
    primary_image?: { path: string };
    images?: ImageItem[];
    variants?: Variant[];
}

interface Props {
    product: ProductDetailModalData | null;
    categoryName?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({ product, categoryName, isOpen, onClose }: Props) {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    // Reset selected image when product changes
    React.useEffect(() => {
        setSelectedImage(null);
    }, [product?.id]);

    if (!isOpen || !product) return null;

    const allImages: string[] = [];
    if (product.primary_image?.path) {
        allImages.push(product.primary_image.path);
    }
    if (product.images) {
        product.images.forEach((img) => {
            if (img.path && !allImages.includes(img.path)) {
                allImages.push(img.path);
            }
        });
    }

    const currentImgPath = selectedImage || (allImages.length > 0 ? allImages[0] : null);

    const resolveImageUrl = (path: string) => {
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        if (path.startsWith('uploads/')) return `/${path}`;
        return `/uploads/${path}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EB2629] flex items-center justify-center">
                            <Eye className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-gray-900 text-base leading-none">
                                Preview Detail Produk
                            </h3>
                            <span className="text-[11px] text-gray-400 font-mono">/{product.slug}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={`http://localhost:5174/produk/${product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#EB2629] hover:bg-red-50 rounded-xl transition-colors"
                            title="Buka di Website Toko"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> Buka di Web
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Gallery / Images */}
                        <div className="md:col-span-5 space-y-3">
                            <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                                {currentImgPath ? (
                                    <img
                                        src={resolveImageUrl(currentImgPath)}
                                        alt={product.name}
                                        onError={(e) => {
                                            const t = e.currentTarget;
                                            if (!t.src.includes('/storage/')) {
                                                t.src = `/storage/${currentImgPath}`;
                                            }
                                        }}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                                        <Layers className="w-8 h-8 text-gray-300" />
                                        Belum ada foto
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail row */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {allImages.map((imgPath, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedImage(imgPath)}
                                            className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                                currentImgPath === imgPath ? 'border-[#EB2629] shadow-xs' : 'border-gray-200 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={resolveImageUrl(imgPath)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const t = e.currentTarget;
                                                    if (!t.src.includes('/storage/')) {
                                                        t.src = `/storage/${imgPath}`;
                                                    }
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                    <Tag className="w-3 h-3 text-gray-500" />
                                    {categoryName || 'Kategori'}
                                </span>
                                {product.stock_status === 'pre_order' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                        <Clock className="w-3 h-3" /> PO ({product.preorder_days || 14} Hari)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3" /> Tersedia
                                    </span>
                                )}
                                {product.is_featured && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                                        ★ Featured
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details Info */}
                        <div className="md:col-span-7 space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                    {product.name}
                                </h2>
                                <p className="text-xl font-extrabold text-[#EB2629] mt-2">
                                    {formatRupiah(product.base_price)}
                                    <span className="text-xs font-normal text-gray-500 ml-1.5">(Harga Dasar)</span>
                                </p>
                            </div>

                            {/* Variants Table */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/60">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-[#EB2629]" /> Pilihan Ukuran & Harga ({product.variants.length} Varian)
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                        {product.variants.map((v, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white px-3 py-2 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                                            >
                                                <span className="font-medium text-gray-700 truncate pr-2">{v.label}</span>
                                                <span className="font-bold text-[#EB2629] shrink-0">
                                                    {formatRupiah(v.price || v.final_price || product.base_price)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description preview */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Deskripsi Produk
                                </h4>
                                <div className="p-4 bg-white border border-gray-200 rounded-2xl max-h-60 overflow-y-auto text-xs text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                    {product.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    ) : (
                                        <p className="italic text-gray-400">Belum ada deskripsi produk.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                    <a
                        href={`/admin/products/${product.id}/edit`}
                        className="px-4 py-2 bg-[#EB2629] hover:bg-[#D01E21] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                        Ubah Produk Ini
                    </a>
                </div>

            </div>
        </div>
    );
}
