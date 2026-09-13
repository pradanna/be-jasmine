import React, { useState } from 'react';
import axios from 'axios';
import { Plus, X, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCategoryAdded: (newCategory: Category) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onCategoryAdded }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(
                '/admin/categories',
                {
                    name: name.trim(),
                    description: description.trim() || null,
                    is_active: true,
                    order: 0,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            if (res.data && res.data.category) {
                onCategoryAdded(res.data.category);
                setName('');
                setDescription('');
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menambahkan kategori baru.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-serif font-bold text-gray-900 text-base">Tambah Kategori Baru</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Kategori baru akan langsung terpilih pada produk ini.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Kingkoil Tencel, Katun Sutra, dll"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Deskripsi Singkat (Opsional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Keterangan jenis kain atau koleksi..."
                            rows={2}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EB2629] hover:bg-[#D01E21] text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Simpan & Pilih Kategori
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
