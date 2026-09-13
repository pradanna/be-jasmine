import { writable } from 'svelte/store';
import type { CartItem } from '$lib/domain/cart/entity';
import { calculateCartGrandTotal } from '$lib/domain/cart/entity';

const STORAGE_KEY = 'jasmine_cart';

function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function createCartStore() {
  const { subscribe, set, update } = writable<CartItem[]>(getInitialCart());

  if (typeof window !== 'undefined') {
    subscribe((items) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to persist cart:', e);
      }
    });
  }

  return {
    subscribe,
    addItem: (item: CartItem) => {
      update((current) => {
        const existingIndex = current.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          const updated = [...current];
          updated[existingIndex].quantity += item.quantity;
          return updated;
        }
        return [...current, item];
      });
      triggerCartBounce(item);
    },
    updateQuantity: (id: string, qty: number) => {
      update((current) => {
        if (qty <= 0) {
          return current.filter((i) => i.id !== id);
        }
        return current.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
      });
    },
    removeItem: (id: string) => {
      update((current) => current.filter((i) => i.id !== id));
    },
    clearCart: () => {
      set([]);
    }
  };
}

export const cart = createCartStore();
export const isCartOpen = writable<boolean>(false);
export const cartAnimationTrigger = writable<number>(0);
export const lastAddedItem = writable<CartItem | null>(null);

let toastTimer: any = null;

export function triggerCartBounce(item?: CartItem) {
  cartAnimationTrigger.update((n) => n + 1);
  if (item) {
    lastAddedItem.set(item);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      lastAddedItem.set(null);
    }, 3200);
  }
}
