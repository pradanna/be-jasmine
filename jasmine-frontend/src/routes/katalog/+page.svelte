<script lang="ts">
  import { Search, Filter, X, ChevronLeft, ChevronRight, PackageOpen } from '@lucide/svelte';
  import ProductCard from '$lib/presentation/components/ProductCard.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  let { data } = $props();

  let searchInput = $state(data.searchQuery || '');

  function updateFilter(newParams: Record<string, string | null>) {
    const url = new URL(page.url);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '') {
        url.searchParams.delete(k);
      } else {
        url.searchParams.set(k, v);
      }
    });
    // Reset to page 1 on filter change
    if (!('page' in newParams)) {
      url.searchParams.delete('page');
    }
    goto(url.toString(), { keepFocus: true });
  }

  function handleSearch(e: Event) {
    e.preventDefault();
    updateFilter({ cari: searchInput });
  }
</script>

<svelte:head>
  <title>Katalog Lengkap Sprei & Bedcover — {data.settings.store_name}</title>
</svelte:head>

<div class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Header -->
    <div class="mb-10 text-center max-w-xl mx-auto">
      <h1 class="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Katalog Koleksi Sprei</h1>
      <p class="text-xs sm:text-sm text-gray-500">Pilih sprei dan bedcover dengan berbagai motif floral, minimalis, dan polos favorit Anda.</p>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 mb-10 space-y-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <!-- Search Input -->
        <form onsubmit={handleSearch} class="w-full md:max-w-md relative">
          <Search class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            bind:value={searchInput}
            placeholder="Cari motif sprei (misal: Sakura, Monstera)..."
            class="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#EB2629]/20 focus:border-[#EB2629] outline-none transition-all"
          />
          {#if searchInput}
            <button
              type="button"
              onclick={() => { searchInput = ''; updateFilter({ cari: null }); }}
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X class="w-4 h-4" />
            </button>
          {/if}
        </form>

        <!-- Product counter -->
        <div class="text-xs text-gray-500">
          Menampilkan <span class="font-bold text-gray-800">{data.products.length}</span> dari <span class="font-bold text-gray-800">{data.meta.total}</span> produk
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <button
          onclick={() => updateFilter({ kategori: null })}
          class={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            !data.selectedCategory
              ? 'bg-[#EB2629] text-white shadow-xs'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#EB2629]'
          }`}
        >
          Semua Kategori
        </button>

        {#each data.categories as cat}
          <button
            onclick={() => updateFilter({ kategori: cat.slug })}
            class={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              data.selectedCategory === cat.slug
                ? 'bg-[#EB2629] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#EB2629]'
            }`}
          >
            {cat.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- Product Grid -->
    {#if data.products.length === 0}
      <div class="bg-white rounded-3xl p-16 text-center border border-gray-200 max-w-lg mx-auto shadow-xs">
        <PackageOpen class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 class="font-serif font-bold text-lg text-gray-800 mb-1">Produk Tidak Ditemukan</h3>
        <p class="text-xs text-gray-500 mb-6">Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.</p>
        <button
          onclick={() => updateFilter({ cari: null, kategori: null })}
          class="px-5 py-2.5 bg-[#EB2629] hover:bg-[#D01E21] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Reset Filter Pencarian
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each data.products as prod}
          <ProductCard product={prod} whatsappNumber={data.settings.whatsapp_number} />
        {/each}
      </div>

      <!-- Pagination Controls -->
      {#if data.meta.last_page > 1}
        <div class="mt-12 flex items-center justify-center gap-2">
          <button
            disabled={data.meta.current_page <= 1}
            onclick={() => updateFilter({ page: String(data.meta.current_page - 1) })}
            class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Sebelumnya"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          {#each Array.from({ length: data.meta.last_page }, (_, i) => i + 1) as pageNum}
            <button
              onclick={() => updateFilter({ page: String(pageNum) })}
              class={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pageNum === data.meta.current_page
                  ? 'bg-[#EB2629] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#EB2629]'
              }`}
            >
              {pageNum}
            </button>
          {/each}

          <button
            disabled={data.meta.current_page >= data.meta.last_page}
            onclick={() => updateFilter({ page: String(data.meta.current_page + 1) })}
            class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Berikutnya"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      {/if}
    {/if}

  </div>
</div>
