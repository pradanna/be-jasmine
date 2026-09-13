<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Heart, ChevronLeft, ChevronRight } from '@lucide/svelte';
  import type { ProductSummary } from '$lib/domain/product/entity';

  let { products = [] }: { products: ProductSummary[] } = $props();

  let currentIndex = $state(0);
  let isPaused = $state(false);
  let timer: any = null;

  // Durasi rotasi: ganti setiap 4.5 detik
  const INTERVAL_MS = 4500;

  function nextRandomProduct() {
    if (products.length <= 1) return;
    let nextIdx = currentIndex;
    // Pilih index acak yang berbeda dari index saat ini
    while (nextIdx === currentIndex) {
      nextIdx = Math.floor(Math.random() * products.length);
    }
    currentIndex = nextIdx;
  }

  function prevProduct() {
    if (products.length <= 1) return;
    currentIndex = (currentIndex - 1 + products.length) % products.length;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      if (!isPaused) {
        nextRandomProduct();
      }
    }, INTERVAL_MS);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  onMount(() => {
    if (products.length > 0) {
      // Pilih index acak awal saat halaman pertama dimuat
      currentIndex = Math.floor(Math.random() * products.length);
      startTimer();
    }
  });

  onDestroy(() => {
    stopTimer();
  });

  let currentProduct = $derived(products[currentIndex] || null);
</script>

<div
  class="relative mx-auto max-w-md lg:max-w-none group select-none"
  role="region"
  aria-label="Koleksi Unggulan Berputar"
  onmouseenter={() => (isPaused = true)}
  onmouseleave={() => (isPaused = false)}
>
  <!-- Main Image Card -->
  <div class="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 ring-1 ring-black/5">
    {#if currentProduct}
      {#key currentProduct.id}
        <div
          in:fade={{ duration: 600 }}
          out:fade={{ duration: 400 }}
          class="absolute inset-0 w-full h-full"
        >
          <img
            src={currentProduct.primary_image || 'http://localhost:8080/uploads/products/bedcover-tencel-yuvika-tua.jpg'}
            alt={currentProduct.name}
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          <!-- Gradient overlay at the bottom for readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

          <!-- Product Details Overlay -->
          <a
            href={`/produk/${currentProduct.slug}`}
            class="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white text-left block hover:opacity-95 transition-opacity"
          >
            <h3 class="font-serif text-base sm:text-lg font-bold line-clamp-1 drop-shadow-sm">
              {currentProduct.name}
            </h3>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
              <span class="text-sm sm:text-base font-semibold text-amber-200">
                {currentProduct.base_price_formatted}
              </span>
              <span class="text-[11px] bg-[#EB2629] text-white px-2.5 py-1 rounded-full font-semibold shadow-xs">
                Lihat Detail &rarr;
              </span>
            </div>
          </a>
        </div>
      {/key}
    {/if}

    <!-- Quick Manual Controls (Visible on hover) -->
    {#if products.length > 1}
      <button
        onclick={prevProduct}
        aria-label="Produk Sebelumnya"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button
        onclick={nextRandomProduct}
        aria-label="Produk Berikutnya"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight class="w-5 h-5" />
      </button>

      <!-- Carousel Progress Indicator Dots -->
      <div class="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full z-20">
        {#each products.slice(0, Math.min(products.length, 6)) as _, idx}
          <div
            class={`h-1.5 rounded-full transition-all duration-300 ${
              (currentIndex % Math.min(products.length, 6)) === idx
                ? 'w-4 bg-[#EB2629]'
                : 'w-1.5 bg-white/60'
            }`}
          ></div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Floating Customer Review Badge -->
  <div class="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-30 pointer-events-none">
    <div class="w-10 h-10 rounded-xl bg-red-50 text-[#EB2629] flex items-center justify-center shrink-0">
      <Heart class="w-5 h-5 fill-current" />
    </div>
    <div>
      <p class="font-bold text-xs text-gray-900">1000+ Pelanggan Puas</p>
      <p class="text-[10px] text-gray-500">Tidur nyenyak setiap malam</p>
    </div>
  </div>
</div>
