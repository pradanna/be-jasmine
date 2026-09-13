<script lang="ts">
  import { Sparkles, MessageCircle, Heart, ShieldCheck, Truck, RefreshCw } from '@lucide/svelte';
  import type { StoreSettings } from '$lib/domain/setting/entity';

  let { settings }: { settings: StoreSettings } = $props();
</script>

<!-- Benefits / Value Proposition -->
<section class="border-t border-gray-100 bg-gray-50/50 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-xs text-[#EB2629] flex items-center justify-center mb-3">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h4 class="font-serif font-bold text-gray-900 text-base mb-1">100% Katun Pilihan</h4>
        <p class="text-xs text-gray-500 max-w-xs">Bahan adem, lembut, tidak berbulu, dan nyaman di kulit setiap malam.</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-xs text-[#EB2629] flex items-center justify-center mb-3">
          <RefreshCw class="w-6 h-6" />
        </div>
        <h4 class="font-serif font-bold text-gray-900 text-base mb-1">Jahitan Rapi & Karet Sudut</h4>
        <p class="text-xs text-gray-500 max-w-xs">Sprei fitted tidak mudah bergeser dan pas di kasur dengan tinggi 25-30cm.</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-xs text-[#EB2629] flex items-center justify-center mb-3">
          <MessageCircle class="w-6 h-6" />
        </div>
        <h4 class="font-serif font-bold text-gray-900 text-base mb-1">Pemesanan Langsung WA</h4>
        <p class="text-xs text-gray-500 max-w-xs">Konsultasi motif & ukuran langsung ke admin dengan respon ramah dan cepat.</p>
      </div>
    </div>
  </div>
</section>

<!-- Main Footer -->
<footer class="bg-white border-t border-gray-100 pt-16 pb-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
      
      <!-- Brand column -->
      <div class="md:col-span-2 space-y-4">
        <a href="/" class="inline-block">
          <picture>
            <source srcset="/assets/images/logo.webp" type="image/webp" />
            <img
              src="/assets/images/logo.png"
              alt="Jasmine Sprei Logo"
              class="h-10 w-auto object-contain"
            />
          </picture>
        </a>
        <p class="text-xs text-gray-600 leading-relaxed max-w-md">
          {settings.store_description || 'Produsen dan toko sprei berkualitas dengan bahan katun premium. Menghadirkan kenyamanan tidur terbaik untuk keluarga dengan motif cantik dan harga terjangkau.'}
        </p>
        <div class="pt-2">
          <a
            href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Halo Kak Jasmine! Mau tanya seputar koleksi sprei...')}`}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageCircle class="w-4 h-4" />
            Chat WhatsApp CS ({settings.whatsapp_number})
          </a>
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h4 class="font-serif font-bold text-gray-900 text-sm mb-4">Navigasi Cepat</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="/" class="text-gray-600 hover:text-[#EB2629] transition-colors">Beranda</a></li>
          <li><a href="/katalog" class="text-gray-600 hover:text-[#EB2629] transition-colors">Semua Produk</a></li>
          <li><a href="/katalog?kategori=set-bed-cover" class="text-gray-600 hover:text-[#EB2629] transition-colors">Set Bedcover</a></li>
          <li><a href="/katalog?kategori=sprei-king" class="text-gray-600 hover:text-[#EB2629] transition-colors">Sprei King (180x200)</a></li>
        </ul>
      </div>

      <!-- Information -->
      <div>
        <h4 class="font-serif font-bold text-gray-900 text-sm mb-4">Panduan Belanja</h4>
        <ul class="space-y-2 text-xs text-gray-600">
          <li>1. Pilih sprei & ukuran favorit</li>
          <li>2. Klik tombol Pesan via WA</li>
          <li>3. Admin mengonfirmasi ongkir & no resi</li>
          <li>4. Pembayaran via Transfer Bank</li>
        </ul>
      </div>
    </div>

    <div class="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
      <p>© {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
      <p class="flex items-center gap-1">
        Dibuat dengan <Heart class="w-3.5 h-3.5 text-[#EB2629] fill-current" /> untuk tidur lebih nyaman
      </p>
    </div>
  </div>
</footer>
