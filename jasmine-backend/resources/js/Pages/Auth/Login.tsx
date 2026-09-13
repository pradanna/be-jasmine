import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Store, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Masuk Admin" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200/80 p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <picture>
                            <source srcSet="/assets/images/logo.webp" type="image/webp" />
                            <img
                                src="/assets/images/logo.png"
                                alt="Jasmine Sprei Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </picture>
                    </div>
                    <h1 className="font-serif text-xl font-bold text-gray-800 tracking-tight">Admin Backoffice</h1>
                    <p className="text-xs text-gray-500 mt-1">Masuk untuk mengelola produk, kategori, dan pengaturan</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Alamat Email
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                placeholder="admin@jasminesprei.com"
                                required
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] focus:bg-white transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded text-[#EB2629] focus:ring-[#EB2629]/20 border-gray-300"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                            Ingat saya di perangkat ini
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-4 bg-[#EB2629] hover:bg-[#D01E21] text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                        Masuk ke Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
