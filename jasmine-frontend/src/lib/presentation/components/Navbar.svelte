<script lang="ts">
  import { ShoppingBag, Menu, X, Sparkles } from '@lucide/svelte';
  import { cart, isCartOpen, cartAnimationTrigger } from '$lib/presentation/stores/cartStore';
  import type { Category } from '$lib/domain/category/entity';

  let { categories = [] }: { categories?: Category[] } = $props();

  let isMobileMenuOpen = $state(false);
  let isBouncing = $state(false);

  let totalItems = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));

  $effect(() => {
    const trigger = $cartAnimationTrigger;
    if (trigger > 0) {
      isBouncing = true;
      const timeout = setTimeout(() => {
        isBouncing = false;
      }, 700);
      return () => clearTimeout(timeout);
    }
  });
</script>

<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-3 group">
        <picture class="flex items-center">
          <source srcset="/assets/images/logo.webp" type="image/webp" />
          <img
            src="/assets/images/logo.png"
            alt="Jasmine Sprei Logo"
            class="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </picture>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="/" class="text-gray-700 hover:text-[#EB2629] transition-colors">Beranda</a>
        <a href="/katalog" class="text-gray-700 hover:text-[#EB2629] transition-colors">Semua Katalog</a>
        
        {#if categories.length > 0}
          <div class="relative group">
            <button class="flex items-center gap-1 text-gray-700 group-hover:text-[#EB2629] transition-colors py-2 cursor-pointer">
              Kategori
              <span class="text-xs">▾</span>
            </button>
            <div class="absolute top-full left-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {#each categories as cat}
                <a
                  href={`/katalog?kategori=${cat.slug}`}
                  class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#EB2629] transition-colors"
                >
                  {cat.name}
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </nav>

      <!-- Right Actions (Cart & WA) -->
      <div class="flex items-center gap-3">
        <button
          id="navbar-cart-btn"
          onclick={() => isCartOpen.set(true)}
          class={`relative p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-[#EB2629] transition-all cursor-pointer ${
            isBouncing ? 'bg-red-50 text-[#EB2629] scale-110' : ''
          }`}
          aria-label="Keranjang Belanja"
        >
          <div class={isBouncing ? 'animate-cart-bounce' : ''}>
            <ShoppingBag class="w-6 h-6" />
          </div>
          {#if totalItems > 0}
            <span
              class={`absolute -top-1 -right-1 w-5 h-5 bg-[#EB2629] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs ${
                isBouncing ? 'animate-badge-pop ring-2 ring-red-300' : 'animate-scale-in'
              }`}
            >
              {totalItems}
            </span>
          {/if}
        </button>

        <a
          href="/katalog"
          class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#EB2629] hover:bg-[#D01E21] text-white font-medium text-xs rounded-xl shadow-xs transition-all hover:shadow-md"
        >
          Lihat Koleksi
        </a>

        <!-- Mobile Menu Toggle -->
        <button
          onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
          class="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          {#if isMobileMenuOpen}
            <X class="w-6 h-6" />
          {:else}
            <Menu class="w-6 h-6" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Dropdown -->
  {#if isMobileMenuOpen}
    <div class="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3">
      <a
        href="/"
        onclick={() => isMobileMenuOpen = false}
        class="block py-2 text-sm font-medium text-gray-800 hover:text-[#EB2629]"
      >
        Beranda
      </a>
      <a
        href="/katalog"
        onclick={() => isMobileMenuOpen = false}
        class="block py-2 text-sm font-medium text-gray-800 hover:text-[#EB2629]"
      >
        Semua Katalog
      </a>
      {#if categories.length > 0}
        <div class="pt-2 border-t border-gray-100">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Kategori</p>
          <div class="grid grid-cols-2 gap-2">
            {#each categories as cat}
              <a
                href={`/katalog?kategori=${cat.slug}`}
                onclick={() => isMobileMenuOpen = false}
                class="block py-1.5 text-xs text-gray-600 hover:text-[#EB2629]"
              >
                {cat.name}
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</header>
