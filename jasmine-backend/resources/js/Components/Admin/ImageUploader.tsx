import React, { useRef } from 'react';
import { Upload, X, Star } from 'lucide-react';

export interface ProductImageItem {
    id: number;
    path: string;
    is_primary: boolean;
}

// 1. Existing Image Manager (for Edit)
interface ExistingProps {
    images: ProductImageItem[];
    primaryId: number | null;
    deletedIds: number[];
    onToggleDelete: (id: number) => void;
    onSetPrimary: (id: number) => void;
}

export function ExistingImageManager({
    images,
    primaryId,
    deletedIds,
    onToggleDelete,
    onSetPrimary,
}: ExistingProps) {
    if (images.length === 0) {
        return (
            <p className="text-xs text-gray-400 italic">Belum ada gambar yang diunggah sebelumnya.</p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img) => {
                const isDeleted = deletedIds.includes(img.id);
                const isPrimary = primaryId === img.id || (primaryId === null && img.is_primary);

                return (
                    <div
                        key={img.id}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all group aspect-square bg-gray-50 ${
                            isDeleted
                                ? 'opacity-40 border-dashed border-red-300'
                                : isPrimary
                                ? 'border-[#EB2629] shadow-xs'
                                : 'border-gray-200'
                        }`}
                    >
                        <img
                            src={img.path.startsWith('http') ? img.path : img.path.startsWith('uploads/') ? `/${img.path}` : `/uploads/${img.path}`}
                            onError={(e) => {
                                // Fallback to storage if not found in uploads
                                const target = e.currentTarget;
                                if (!target.src.includes('/storage/')) {
                                    target.src = `/storage/${img.path}`;
                                }
                            }}
                            alt="Foto produk"
                            className="w-full h-full object-cover"
                        />

                        {/* Badges & Actions */}
                        <div className="absolute top-2 left-2 flex gap-1">
                            {isPrimary && !isDeleted && (
                                <span className="bg-[#EB2629] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                    <Star className="w-2.5 h-2.5 fill-current" /> Utama
                                </span>
                            )}
                            {isDeleted && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                    Dihapus
                                </span>
                            )}
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1">
                            {!isDeleted && !isPrimary && (
                                <button
                                    type="button"
                                    onClick={() => onSetPrimary(img.id)}
                                    title="Jadikan Foto Utama"
                                    className="p-1.5 bg-white/90 hover:bg-[#EB2629] hover:text-white text-gray-700 rounded-lg shadow-xs transition-colors"
                                >
                                    <Star className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => onToggleDelete(img.id)}
                                title={isDeleted ? 'Batalkan Hapus' : 'Hapus Foto'}
                                className={`p-1.5 rounded-lg shadow-xs transition-colors ${
                                    isDeleted
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-white/90 text-red-600 hover:bg-red-600 hover:text-white'
                                }`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// 2. New Image Uploader (Multi-upload for Create and Add in Edit)
interface NewUploaderProps {
    files: File[];
    primaryIndex: number;
    onFilesChange: (files: File[]) => void;
    onSetPrimaryIndex?: (index: number) => void;
}

export function NewImageUploader({
    files,
    primaryIndex,
    onFilesChange,
    onSetPrimaryIndex,
}: NewUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const added = Array.from(e.target.files);
            onFilesChange([...files, ...added]);
        }
    };

    const handleRemoveFile = (index: number) => {
        const next = files.filter((_, i) => i !== index);
        onFilesChange(next);
        if (primaryIndex === index && onSetPrimaryIndex) {
            onSetPrimaryIndex(0);
        } else if (primaryIndex > index && onSetPrimaryIndex) {
            onSetPrimaryIndex(primaryIndex - 1);
        }
    };

    return (
        <div>
            <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#EB2629] bg-gray-50/60 hover:bg-gray-50 rounded-2xl p-6 text-center cursor-pointer transition-all mb-4"
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleSelectFiles}
                />
                <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-[#EB2629] flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Klik untuk unggah foto produk</p>
                <p className="text-xs text-gray-400 mt-1">Dapat memilih lebih dari 1 file (PNG, JPG, WebP max 2MB)</p>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {files.map((file, idx) => {
                        const previewUrl = URL.createObjectURL(file);
                        const isPrimary = primaryIndex === idx;

                        return (
                            <div
                                key={idx}
                                className={`relative rounded-xl overflow-hidden border-2 aspect-square bg-gray-50 transition-all ${
                                    isPrimary ? 'border-[#EB2629] shadow-xs' : 'border-gray-200'
                                }`}
                            >
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute top-2 left-2">
                                    {isPrimary && (
                                        <span className="bg-[#EB2629] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                            <Star className="w-2.5 h-2.5 fill-current" /> Utama
                                        </span>
                                    )}
                                </div>

                                <div className="absolute top-2 right-2 flex gap-1">
                                    {onSetPrimaryIndex && !isPrimary && (
                                        <button
                                            type="button"
                                            onClick={() => onSetPrimaryIndex(idx)}
                                            title="Jadikan Foto Utama"
                                            className="p-1.5 bg-white/90 hover:bg-[#EB2629] hover:text-white text-gray-700 rounded-lg shadow-xs transition-colors"
                                        >
                                            <Star className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(idx)}
                                        title="Hapus"
                                        className="p-1.5 bg-white/90 text-red-600 hover:bg-red-600 hover:text-white rounded-lg shadow-xs transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
