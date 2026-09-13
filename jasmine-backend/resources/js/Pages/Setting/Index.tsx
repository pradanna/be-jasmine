import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, MessageCircle, Store, Sparkles, Image, Check } from 'lucide-react';

interface Props {
    settings: Record<string, string>;
}

export default function SettingIndex({ settings }: Props) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        whatsapp_number: settings.whatsapp_number || '628975050520',
        store_name: settings.store_name || 'Jasmine Sprei',
        store_description: settings.store_description || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_image: settings.hero_image || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AdminLayout title="Pengaturan Toko">
            <Head title="Pengaturan Toko & WA" />

            <div className="max-w-4xl">
                <div className="mb-6">
                    <h3 className="text-lg font-serif font-bold text-gray-800">Konfigurasi Toko & WhatsApp</h3>
                    <p className="text-xs text-gray-500">Kelola nomor admin WhatsApp dan banner beranda front-end</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Section 1: WhatsApp Checkout */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-800 text-sm">Integrasi Pemesanan WhatsApp</h4>
                                <p className="text-xs text-gray-500">Nomor ini yang akan menerima chat otomatis saat pembeli menekan tombol Checkout</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Nomor WhatsApp CS (Format Internasional tanpa tanda +)
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                placeholder="628975050520"
                                className="w-full sm:w-80 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all font-mono"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1.5">Contoh: 628975050520 (gunakan awalan 62)</p>
                        </div>
                    </div>

                    {/* Section 2: Store Identity */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                            <div className="p-2.5 rounded-xl bg-red-50 text-[#EB2629]">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-800 text-sm">Identitas Brand</h4>
                                <p className="text-xs text-gray-500">Informasi nama brand toko online Anda</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Nama Toko
                                </label>
                                <input
                                    type="text"
                                    value={data.store_name}
                                    onChange={(e) => setData('store_name', e.target.value)}
                                    placeholder="Jasmine Sprei"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Deskripsi Toko
                                </label>
                                <textarea
                                    value={data.store_description}
                                    onChange={(e) => setData('store_description', e.target.value)}
                                    placeholder="Toko sprei berkualitas dengan harga terjangkau..."
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Hero Banner */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-800 text-sm">Banner Utama (Hero Section)</h4>
                                <p className="text-xs text-gray-500">Tampilan teks headline dan penawaran di halaman awal</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Judul Hero (Hero Title)
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_title}
                                    onChange={(e) => setData('hero_title', e.target.value)}
                                    placeholder="Sprei Berkualitas untuk Tidur Lebih Nyaman"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Sub-Judul Hero (Hero Subtitle)
                                </label>
                                <textarea
                                    value={data.hero_subtitle}
                                    onChange={(e) => setData('hero_subtitle', e.target.value)}
                                    placeholder="Temukan koleksi sprei premium Jasmine dengan berbagai ukuran dan motif"
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        {recentlySuccessful && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                <Check className="w-4 h-4" /> Pengaturan berhasil disimpan!
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#EB2629] hover:bg-[#D01E21] text-white font-medium text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            Simpan Pengaturan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
