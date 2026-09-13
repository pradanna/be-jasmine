export interface CartItem {
  id: string; // unique key combining productId and variantId
  productId: number;
  productName: string;
  productSlug: string;
  variantId?: number;
  variantLabel: string;
  price: number;
  quantity: number;
  image: string | null;
}

export function calculateItemTotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function calculateCartGrandTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}
