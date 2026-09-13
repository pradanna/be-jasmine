import { formatRupiah } from '$lib/domain/product/currency';
import type { CartItem } from '$lib/domain/cart/entity';
import { calculateCartGrandTotal } from '$lib/domain/cart/entity';

export function generateSingleProductWhatsAppUrl(
  phone: string,
  productName: string,
  variantLabel: string,
  finalPrice: number,
  quantity: number = 1
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const subtotal = finalPrice * quantity;

  const message = `Halo Kak Jasmine! 👋
Saya ingin memesan:

🛏️ *${productName}*
📐 Ukuran: ${variantLabel}
🔢 Jumlah: ${quantity} pcs
💰 Harga: ${formatRupiah(finalPrice)}${quantity > 1 ? `\n💵 Total (${quantity} pcs): ${formatRupiah(subtotal)}` : ''}

Mohon konfirmasi ketersediaan dan detail pengirimannya ya, terima kasih! 🙏`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

export function generateCartWhatsAppUrl(
  phone: string,
  items: CartItem[]
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  let itemListText = '';
  items.forEach((item, index) => {
    itemListText += `\n${index + 1}. *${item.productName}*\n   📐 Varian: ${item.variantLabel}\n   🔢 Jumlah: ${item.quantity} pcs\n   💵 Subtotal: ${formatRupiah(item.price * item.quantity)}\n`;
  });

  const grandTotal = calculateCartGrandTotal(items);

  const message = `Halo Kak Jasmine! 👋
Saya ingin memesan beberapa sprei/bedcover dari website:
${itemListText}
-----------------------------
💰 *Total Pembayaran: ${formatRupiah(grandTotal)}*

Mohon bantu cek ketersediaan stok & ongkos kirim ke alamat saya ya kak, terima kasih! 🙏`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
