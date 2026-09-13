<script lang="ts">
  import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from '@lucide/svelte';
  import { fly, fade } from 'svelte/transition';
  import { cart, isCartOpen } from '$lib/presentation/stores/cartStore';
  import { calculateCartGrandTotal, calculateItemTotal } from '$lib/domain/cart/entity';
  import { formatRupiah } from '$lib/domain/product/currency';
  import { generateCartWhatsAppUrl } from '$lib/application/whatsapp/generator';

  let { whatsappNumber = '628975050520' }: { whatsappNumber?: string } = $props();

  let grandTotal = $derived(calculateCartGrandTotal($cart));
  let waCheckoutUrl = $derived(generateCartWhatsAppUrl(whatsappNumber, $cart));
</script>

{#if $isCartOpen}
  <!-- Overlay backdrop -->
  <div
    transition:fade={{ duration: 250 }}
    class="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
    onclick={() => isCartOpen.set(false)}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Escape' && isCartOpen.set(false)}
    aria-label="Tutup Keranjang"
  ></div>

  <!-- Sliding Drawer -->
  <div
    transition:fly={{ x: 380, duration: 350, opacity: 1 }}
    class="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
  >
    
    <!-- Drawer Header -->
    <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-[#EB2629]/10 text-[#EB2629]">
          <ShoppingBag class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-serif font-bold text-gray-900 text-lg">Keranjang Belanja</h3>
          <p class="text-xs text-gray-500">{$cart.length} item siap dipesan</p>
        </div>
      </div>
      <button
        onclick={() => isCartOpen.set(false)}
        class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Items List -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
      {#if $cart.length === 0}
        <div class="h-full flex flex-col items-center justify-center text-center py-16 text-gray-400">
          <ShoppingBag class="w-12 h-12 text-gray-300 mb-3" />
          <p class="font-serif text-lg text-gray-700 mb-1">Keranjang Masih Kosong</p>
          <p class="text-xs text-gray-400 max-w-xs mb-6">Pilih motif sprei favorit Anda di katalog lalu tambahkan ke sini.</p>
          <button
            onclick={() => isCartOpen.set(false)}
            class="px-5 py-2.5 bg-[#EB2629] hover:bg-[#D01E21] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      {:else}
        {#each $cart as item}
          <div class="pt-4 first:pt-0 flex gap-4 items-start">
            <!-- Product Image -->
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              {#if item.image}
                <img src={item.image} alt={item.productName} class="w-full h-full object-cover" />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Sprei</div>
              {/if}
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <h4 class="font-serif font-bold text-gray-900 text-xs truncate">{item.productName}</h4>
              <p class="text-[11px] text-[#EB2629] font-medium mt-0.5">{item.variantLabel}</p>
              <p class="text-xs font-bold text-gray-800 mt-1">{formatRupiah(item.price)}</p>

              <!-- Qty & Remove -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                    class="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Kurang"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>
                  <span class="px-3 text-xs font-semibold text-gray-800">{item.quantity}</span>
                  <button
                    onclick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                    class="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Tambah"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onclick={() => cart.removeItem(item.id)}
                  class="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  title="Hapus item"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Drawer Footer -->
    {#if $cart.length > 0}
      <div class="p-6 border-t border-gray-100 bg-gray-50/60 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">Estimasi Total</span>
          <span class="font-serif text-xl font-bold text-[#EB2629]">{formatRupiah(grandTotal)}</span>
        </div>

        <a
          href={waCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle class="w-5 h-5" />
          Checkout Semua via WhatsApp
        </a>
        <p class="text-[11px] text-center text-gray-400">
          Pesanan dikirim langsung ke WhatsApp Admin untuk perhitungan ongkir resmi
        </p>
      </div>
    {/if}
  </div>
{/if}
