<script lang="ts">
  import { Sparkles, ArrowRight, Bed, Star, ShieldCheck, Heart } from '@lucide/svelte';
  import ProductCard from '$lib/presentation/components/ProductCard.svelte';
  import HeroProductCarousel from '$lib/presentation/components/HeroProductCarousel.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.settings.store_name} — Sprei Berkualitas untuk Tidur Lebih Nyaman</title>
  <meta name="description" content={data.settings.store_description} />
</svelte:head>

<!-- HERO SECTION -->
<section class="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-b from-gray-50/80 via-white to-white border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      <!-- Headline Content -->
      <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
        <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight">
          {data.settings.hero_title || 'Sprei Berkualitas untuk Tidur Lebih Nyaman'}
        </h1>

        <p class="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          {data.settings.hero_subtitle || 'Temukan koleksi sprei premium Jasmine dengan bahan katun halus, sejuk, dan motif elegan yang membuat suasana kamar Anda semakin tenang.'}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
          <a
            href="/katalog"
            class="w-full sm:w-auto px-8 py-4 bg-[#EB2629] hover:bg-[#D01E21] text-white font-semibold text-sm rounded-2xl shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            Jelajahi Semua Produk
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={`https://wa.me/${data.settings.whatsapp_number}?text=${encodeURIComponent('Halo Kak Jasmine, mau konsultasi pilihan sprei...')}`}
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-2xl border border-gray-200 shadow-xs transition-colors text-center"
          >
            Konsultasi Ukuran Kasur
          </a>
        </div>

        <!-- Trust Badges -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500">
          <div class="flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-emerald-600" /> Bahan Tidak Luntur
          </div>
          <div class="flex items-center gap-1.5">
            <Bed class="w-4 h-4 text-[#EB2629]" /> Karet Sudut Presisi
          </div>
          <div class="flex items-center gap-1.5">
            <Star class="w-4 h-4 text-amber-500 fill-amber-500" /> Motif Kekinian
          </div>
        </div>
      </div>

      <!-- Hero Visual Card with Dynamic Real Photos -->
      <div class="lg:col-span-5 relative">
        <HeroProductCarousel products={data.heroProducts || data.featuredProducts || []} />
      </div>

    </div>
  </div>
</section>

<!-- CATEGORIES HIGHLIGHT -->
<section class="py-16 bg-white border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-[#EB2629] mb-1">Pilihan Kategori</p>
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Temukan Sesuai Kebutuhan</h2>
      </div>
      <a href="/katalog" class="text-xs font-semibold text-[#EB2629] hover:underline mt-2 sm:mt-0 inline-flex items-center gap-1">
        Lihat semua kategori <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {#each data.categories as cat}
        <a
          href={`/katalog?kategori=${cat.slug}`}
          class="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/60 hover:bg-red-50/40 hover:border-red-200 transition-all text-center group flex flex-col items-center justify-center gap-3 shadow-2xs hover:shadow-xs"
        >
          <div class="w-12 h-12 rounded-xl bg-white shadow-2xs border border-gray-100 text-gray-700 group-hover:text-[#EB2629] flex items-center justify-center group-hover:scale-110 transition-all">
            <Bed class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-gray-800 group-hover:text-[#EB2629] transition-colors line-clamp-1">
            {cat.name}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- FEATURED PRODUCTS -->
<section class="py-20 bg-gray-50/50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-xl mx-auto mb-14">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EB2629]/10 text-[#EB2629] rounded-full text-xs font-semibold uppercase mb-2">
        <Star class="w-3.5 h-3.5 fill-current" />
        Favorit Pelanggan
      </div>
      <h2 class="font-serif text-3xl font-bold text-gray-900 mb-2">Koleksi Sprei Unggulan</h2>
      <p class="text-xs sm:text-sm text-gray-500">Motif pilihan paling dicari dengan bahan adem yang selalu siap menemani istirahat Anda.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each data.featuredProducts as prod}
        <ProductCard product={prod} whatsappNumber={data.settings.whatsapp_number} />
      {/each}
    </div>

    <div class="text-center mt-12">
      <a
        href="/katalog"
        class="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-gray-800 hover:text-[#EB2629] hover:border-gray-300 font-semibold text-xs rounded-2xl shadow-xs hover:shadow-md transition-all"
      >
        Lihat Semua Koleksi di Katalog
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>
  </div>
</section>
