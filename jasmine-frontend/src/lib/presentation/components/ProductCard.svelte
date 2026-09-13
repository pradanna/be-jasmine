<script lang="ts">
  import { Star, MessageCircle, ArrowRight } from '@lucide/svelte';
  import type { ProductSummary } from '$lib/domain/product/entity';
  import { generateSingleProductWhatsAppUrl } from '$lib/application/whatsapp/generator';

  let { product, whatsappNumber = '628975050520' }: { product: ProductSummary; whatsappNumber?: string } = $props();

  let waUrl = $derived(
    generateSingleProductWhatsAppUrl(
      whatsappNumber,
      product.name,
      'Standar (Pilihan Varian di Web)',
      product.base_price
    )
  );
</script>

<div class="group bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
  <!-- Image Container -->
  <a href={`/produk/${product.slug}`} class="relative aspect-square overflow-hidden bg-gray-50 block">
    {#if product.primary_image}
      <img
        src={product.primary_image}
        alt={product.name}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-gray-400">
        Foto Sprei
      </div>
    {/if}

    <!-- Badges -->
    <div class="absolute top-3 left-3 flex flex-col gap-1.5">
      {#if product.is_featured}
        <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold rounded-full shadow-xs">
          <Star class="w-3 h-3 fill-current" /> Favorit
        </span>
      {/if}
      <span class={`px-2.5 py-1 text-[10px] font-bold rounded-full shadow-xs backdrop-blur-md ${
        product.stock_status === 'available' 
          ? 'bg-emerald-500/90 text-white' 
          : product.stock_status === 'pre_order'
          ? 'bg-amber-500/90 text-white'
          : 'bg-rose-500/90 text-white'
      }`}>
        {product.stock_status_label}
      </span>
    </div>
  </a>

  <!-- Details -->
  <div class="p-5 flex-1 flex flex-col justify-between">
    <div>
      <a href={`/produk/${product.slug}`} class="block">
        <h3 class="font-serif font-bold text-gray-900 text-sm group-hover:text-[#EB2629] transition-colors line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>
      </a>
      <p class="text-xs text-gray-400 mb-1">Mulai dari</p>
      <p class="font-serif font-bold text-lg text-[#EB2629]">
        {product.base_price_formatted}
      </p>
    </div>

    <!-- Actions -->
    <div class="pt-4 border-t border-gray-100 flex items-center gap-2 mt-4">
      <a
        href={`/produk/${product.slug}`}
        class="flex-1 py-2.5 px-3 bg-gray-50 hover:bg-[#EB2629] text-gray-800 hover:text-white rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1"
      >
        Pilih Ukuran
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors"
        title="Beli Cepat via WhatsApp"
        aria-label="Beli Cepat via WhatsApp"
      >
        <MessageCircle class="w-4 h-4" />
      </a>
    </div>
  </div>
</div>
