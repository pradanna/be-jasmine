import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

export interface VariantItem {
    id?: number;
    label: string;
    price: number;
    price_modifier?: number;
}

interface Props {
    variants: VariantItem[];
    defaultPrice?: number;
    onChange: (variants: VariantItem[]) => void;
}

export default function VariantEditor({ variants, defaultPrice = 0, onChange }: Props) {
    const handleAdd = () => {
        onChange([...variants, { label: '', price: defaultPrice }]);
    };

    const handleRemove = (index: number) => {
        onChange(variants.filter((_, i) => i !== index));
    };

    const handleChangeLabel = (index: number, label: string) => {
        const next = [...variants];
        next[index] = { ...next[index], label };
        onChange(next);
    };

    const handleChangePrice = (index: number, price: number) => {
        const next = [...variants];
        next[index] = { ...next[index], price, price_modifier: 0 };
        onChange(next);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Tentukan harga masing-masing ukuran atau kelengkapan varian (contoh: 120x200, 160x200, +Bedcover).
                </p>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EB2629]/10 hover:bg-[#EB2629]/20 text-[#EB2629] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah Varian
                </button>
            </div>

            {variants.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                    <Layers className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Belum ada varian ukuran. Produk ini akan dijual dengan satu harga standar di atas.</p>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-2.5">Label Varian</th>
                                <th className="px-4 py-2.5">Harga Varian (Rp)</th>
                                <th className="px-4 py-2.5 text-right w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {variants.map((v, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/60">
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={v.label}
                                            onChange={(e) => handleChangeLabel(idx, e.target.value)}
                                            placeholder="Contoh: Ukuran 160x200 (Queen)"
                                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#EB2629] outline-none"
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={v.price ?? (v.price_modifier ?? 0)}
                                            onChange={(e) => handleChangePrice(idx, parseFloat(e.target.value) || 0)}
                                            placeholder="0"
                                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#EB2629] outline-none"
                                            required
                                        />
                                    </td>
                                    <td className="p-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(idx)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
