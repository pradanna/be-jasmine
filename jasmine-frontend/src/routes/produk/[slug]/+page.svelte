<script lang="ts">
  import { Star, MessageCircle, ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, Sparkles, Clock, Plus, Minus } from '@lucide/svelte';
  import { cart, isCartOpen } from '$lib/presentation/stores/cartStore';
  import { formatRupiah } from '$lib/domain/product/currency';
  import { generateSingleProductWhatsAppUrl } from '$lib/application/whatsapp/generator';
  import type { ProductVariant } from '$lib/domain/product/entity';

  let { data } = $props();
  let product = $derived(data.product);

  // Selected variant
  let selectedVariant = $state<ProductVariant | null>(null);

  $effect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      selectedVariant = product.variants[0];
    }
  });

  // Active gallery image
  let activeImage = $state<string | null>(null);

  $effect(() => {
    if (!activeImage) {
      activeImage = product.primary_image || (product.images && product.images[0] ? (product.images[0].url || `http://localhost:8080/uploads/${product.images[0].path}`) : null);
    }
  });

  // Calculation of final price: directly use variant's specific price
  let finalPrice = $derived(
    selectedVariant && (selectedVariant.price || selectedVariant.final_price)
      ? Number(selectedVariant.price || selectedVariant.final_price)
      : product.base_price + (selectedVariant ? Number(selectedVariant.price_modifier || 0) : 0)
  );

  // Quantity
  let quantity = $state(1);

  function incrementQty() {
    quantity += 1;
  }

  function decrementQty() {
    if (quantity > 1) {
      quantity -= 1;
    }
  }

  let waOrderUrl = $derived(
    generateSingleProductWhatsAppUrl(
      data.settings.whatsapp_number,
      product.name,
      selectedVariant ? selectedVariant.label : 'Standar',
      finalPrice,
      quantity
    )
  );

  let isAddedToCart = $state(false);

  function handleAddToCart() {
    cart.addItem({
      id: `${product.id}-${selectedVariant ? selectedVariant.id : 'default'}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant ? selectedVariant.label : 'Standar',
      price: finalPrice,
      quantity: quantity,
      image: activeImage,
    });

    isAddedToCart = true;
    setTimeout(() => {
      isAddedToCart = false;
    }, 2000);
  }
</script>

<svelte:head>
  <title>{product.name} — {data.settings.store_name}</title>
  <meta name="description" content={product.description || data.settings.store_description} />
</svelte:head>

<div class="py-10 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Breadcrumb -->
    <div class="mb-6">
      <a
        href="/katalog"
        class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#EB2629] transition-colors font-medium"
      >
        <ArrowLeft class="w-4 h-4" /> Kembali ke Katalog
      </a>
    </div>

    <!-- Main Product Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      
      <!-- Gallery Column -->
      <div class="lg:col-span-6 space-y-4">
        <!-- Main Large Image -->
        <div class="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 relative shadow-inner">
          {#if activeImage}
            <img
              src={activeImage}
              alt={product.name}
              class="w-full h-full object-cover"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              Foto Produk
            </div>
          {/if}

          <!-- Badge -->
          <div class="absolute top-4 left-4">
            <span class={`px-3 py-1.5 text-xs font-bold rounded-full shadow-xs backdrop-blur-md text-white ${
              product.stock_status === 'available' ? 'bg-emerald-500/90' : 'bg-amber-500/90'
            }`}>
              {product.stock_status_label}
            </span>
          </div>
        </div>

        <!-- Thumbnails -->
        {#if product.images && product.images.length > 1}
          <div class="flex gap-3 overflow-x-auto pb-2">
            {#each product.images as img}
              <button
                type="button"
                onclick={() => activeImage = img.url || `http://localhost:8080/uploads/${img.path}`}
                class={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeImage === img.url || (img.path && activeImage?.includes(img.path)) ? 'border-[#EB2629] shadow-xs' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url || `http://localhost:8080/uploads/${img.path}`} alt="Thumbnail" class="w-full h-full object-cover" />
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Info & Checkout Column -->
      <div class="lg:col-span-6 flex flex-col justify-between space-y-8">
        <div class="space-y-6">
          
          <!-- Category & Title -->
          <div>
            {#if product.category}
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#EB2629] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {product.category.name}
              </span>
            {/if}
            <h1 class="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2.5 leading-snug">
              {product.name}
            </h1>
          </div>

          <!-- Price Display -->
          <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 flex items-baseline gap-3">
            <span class="font-serif text-3xl sm:text-4xl font-bold text-[#EB2629]">
              {formatRupiah(finalPrice)}
            </span>
            {#if quantity > 1}
              <span class="text-xs text-gray-400 font-mono">
                (Total {quantity} pcs: {formatRupiah(finalPrice * quantity)})
              </span>
            {/if}
          </div>

          <!-- Shipping / Pre-Order Info (Like Reference Photo) -->
          <div class="space-y-3 py-3 border-y border-gray-100 text-xs sm:text-sm">
            <div class="flex items-start gap-3">
              <span class="text-gray-400 w-24 shrink-0">Pengiriman</span>
              <div class="space-y-1">
                {#if product.stock_status === 'pre_order'}
                  <div class="flex items-center gap-1.5 font-medium text-orange-700">
                    <Clock class="w-4 h-4 text-orange-500" />
                    <span>Pre-Order (dikirim dalam {product.preorder_days || 14} hari)</span>
                  </div>
                  <p class="text-xs text-gray-400">Dikerjakan dengan jahitan rapi kualitas butik sesuai ukuran pilihan Anda.</p>
                {:else if product.stock_status === 'available'}
                  <div class="flex items-center gap-1.5 font-medium text-emerald-700">
                    <Truck class="w-4 h-4 text-emerald-600" />
                    <span>Ready Stock (Siap kirim)</span>
                  </div>
                  <p class="text-xs text-gray-400">Pesanan diproses dan dikirim di hari kerja berikutnya.</p>
                {:else}
                  <span class="text-red-500 font-medium">Stok Saat Ini Sedang Habis</span>
                {/if}
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-gray-400 w-24 shrink-0">Jaminan</span>
              <div class="flex items-center gap-1.5 text-gray-700 font-medium">
                <ShieldCheck class="w-4 h-4 text-[#EB2629]" />
                <span>100% Produk Original Jasmine Bedding</span>
              </div>
            </div>
          </div>

          <!-- Variant Selector (Grid of Buttons like Photo) -->
          {#if product.variants && product.variants.length > 0}
            <div class="space-y-2.5">
              <div class="flex justify-between items-center">
                <label class="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Ukuran
                </label>
                <span class="text-xs text-[#EB2629] font-semibold">
                  {selectedVariant?.label}
                </span>
              </div>
              <div class="flex flex-wrap gap-2.5">
                {#each product.variants as v}
                  {@const variantPrice = Number(v.price || v.final_price || (product.base_price + (v.price_modifier || 0)))}
                  <button
                    type="button"
                    onclick={() => selectedVariant = v}
                    class={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedVariant?.id === v.id
                        ? 'border-[#EB2629] bg-white text-[#EB2629] ring-1 ring-[#EB2629] shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>{v.label}</span>
                    {#if selectedVariant?.id === v.id}
                      <span class="w-1.5 h-1.5 rounded-full bg-[#EB2629]"></span>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Quantity Picker (Like Photo) -->
          <div class="flex items-center gap-4 py-2">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-700 w-24">Kuantitas</span>
            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onclick={decrementQty}
                disabled={quantity <= 1}
                class="p-2.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Kurangi"
              >
                <Minus class="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                readonly
                value={quantity}
                class="w-12 text-center text-sm font-semibold text-gray-800 outline-none border-x border-gray-200 py-1.5"
              />
              <button
                type="button"
                onclick={incrementQty}
                class="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
                title="Tambah"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Description (WYSIWYG HTML Formatted) -->
          <div class="space-y-2 pt-4 border-t border-gray-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Deskripsi Produk & Spesifikasi</h4>
            <div class="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-[#EB2629] [&_blockquote]:pl-3 [&_blockquote]:italic [&_strong]:font-bold">
              {#if product.description?.includes('<')}
                {@html product.description}
              {:else}
                <div class="whitespace-pre-line">
                  {product.description || 'Sprei katun premium yang lembut, nyaman, dan adem dipakai.'}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Action CTA Buttons (Like Reference Photo: Masukkan Keranjang & Beli Sekarang) -->
        <div class="space-y-3 pt-6 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row gap-3">
            
            <!-- Add To Cart Button (Secondary Red Outline) -->
            <button
              type="button"
              onclick={handleAddToCart}
              class={`flex-1 py-3.5 px-5 font-semibold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isAddedToCart
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-300 scale-[1.02] shadow-sm'
                  : 'bg-red-50 hover:bg-red-100/70 text-[#EB2629] border border-[#EB2629]/40 hover:border-[#EB2629] hover:scale-[1.01] active:scale-95'
              }`}
            >
              {#if isAddedToCart}
                <div class="animate-badge-pop flex items-center gap-2">
                  <Check class="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <span>Dimasukkan ke Keranjang!</span>
                </div>
              {:else}
                <ShoppingBag class="w-4 h-4 text-[#EB2629]" />
                <span>Masukkan Keranjang</span>
              {/if}
            </button>

            <!-- Buy Now via WhatsApp (Primary Brand Red Solid) -->
            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 py-3.5 px-5 bg-[#EB2629] hover:bg-[#D01E21] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <MessageCircle class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Beli Sekarang</span>
            </a>
          </div>

          <p class="text-[11px] text-center text-gray-400">
            🛡️ Belanja aman & langsung terhubung dengan Admin Jasmine Bedding
          </p>
        </div>

      </div>

    </div>

  </div>
</div>
