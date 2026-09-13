import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Tag, Check, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    categories: Category[];
}

export default function CategoryIndex({ categories }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: 0,
        is_active: true,
    });

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', order: 0, is_active: true });
        setIsOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setFormData({
            name: cat.name,
            description: cat.description || '',
            order: cat.order,
            is_active: cat.is_active,
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            router.post(`/admin/categories/${editingCategory.id}`, formData, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            router.post('/admin/categories', formData, {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Yakin ingin menghapus kategori "${name}"?`)) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Kategori Produk">
            <Head title="Kelola Kategori" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-serif font-bold text-gray-800">Daftar Kategori</h3>
                    <p className="text-xs text-gray-500">Kelompokkan produk sprei berdasarkan motif atau jenis kain</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EB2629] hover:bg-[#D01E21] text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Kategori
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Urutan</th>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-400">
                                        <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        Belum ada kategori yang dibuat
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{cat.order}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{cat.slug}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                                        <td className="px-6 py-4">
                                            {cat.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium border border-emerald-200">
                                                    <Check className="w-3 h-3" /> Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                    <X className="w-3 h-3" /> Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <button
                                                    onClick={() => openEditModal(cat)}
                                                    className="p-2 text-gray-500 hover:text-[#EB2629] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                                    title="Ubah"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id, cat.name)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Radix Dialog Modal for Add/Edit */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-gray-200 z-50">
                        <Dialog.Title className="font-serif text-xl font-bold text-gray-800 mb-1">
                            {editingCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
                        </Dialog.Title>
                        <Dialog.Description className="text-xs text-gray-500 mb-5">
                            Isi detail informasi kategori untuk katalog produk Jasmine Sprei
                        </Dialog.Description>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Sprei Katun Jepang"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Deskripsi singkat kategori..."
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <label className="flex items-center gap-2 cursor-pointer py-2.5">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded text-[#EB2629] focus:ring-[#EB2629]/20 border-gray-300"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Status Aktif</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                <Dialog.Close asChild>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                </Dialog.Close>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#EB2629] hover:bg-[#D01E21] text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                                >
                                    {editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AdminLayout>
    );
}
