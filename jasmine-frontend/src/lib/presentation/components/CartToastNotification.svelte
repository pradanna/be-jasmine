<script lang="ts">
  import { Check, ShoppingBag, ArrowRight, X } from '@lucide/svelte';
  import { fly, fade } from 'svelte/transition';
  import { lastAddedItem, isCartOpen } from '$lib/presentation/stores/cartStore';
  import { formatRupiah } from '$lib/domain/product/currency';

  function openCart() {
    isCartOpen.set(true);
    lastAddedItem.set(null);
  }

  function closeToast() {
    lastAddedItem.set(null);
  }
</script>

{#if $lastAddedItem}
  <aside
    aria-live="polite"
    transition:fly={{ y: -50, duration: 400 }}
    class="fixed top-24 right-4 sm:right-8 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md border border-emerald-200/80 rounded-2xl shadow-2xl p-4 ring-1 ring-black/5 overflow-hidden"
  >
    <!-- Top indicator line -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-[#EB2629]"></div>

    <div class="flex items-start gap-3">
      <!-- Success Icon -->
      <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 animate-badge-pop">
        <Check class="w-4 h-4 stroke-[3]" />
      </div>

      <!-- Item info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Berhasil Ditambahkan</p>
          <button
            onclick={closeToast}
            class="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 transition-colors cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center gap-3 mt-2">
          {#if $lastAddedItem.image}
            <img
              src={$lastAddedItem.image}
              alt={$lastAddedItem.productName}
              class="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
            />
          {/if}
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-gray-900 line-clamp-1">{$lastAddedItem.productName}</h4>
            <p class="text-[11px] text-gray-500">
              {$lastAddedItem.variantLabel} &bull; <span class="font-semibold text-gray-800">{formatRupiah($lastAddedItem.price)}</span>
            </p>
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-3 flex items-center gap-2">
          <button
            onclick={openCart}
            class="w-full py-2 px-3 bg-[#EB2629] hover:bg-[#D01E21] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span>Buka Keranjang</span>
            <ArrowRight class="w-3.5 h-3.5 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  </aside>
{/if}
