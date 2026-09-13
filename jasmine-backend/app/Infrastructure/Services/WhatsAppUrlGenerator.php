<?php

namespace App\Infrastructure\Services;

class WhatsAppUrlGenerator
{
    private string $number;

    public function __construct(string $number = '628975050520')
    {
        $this->number = $number;
    }

    public function forProduct(string $productName, string $variantLabel, string $price): string
    {
        $message = "Halo Kak Jasmine! 👋\nSaya ingin memesan:\n\n🛏️ *{$productName}*\n📐 Ukuran: {$variantLabel}\n💰 Harga: {$price}\n\nMohon konfirmasi ketersediaan dan detail pengirimannya ya, terima kasih! 🙏";
        return "https://wa.me/{$this->number}?text=" . rawurlencode($message);
    }

    public function forCart(array $items): string
    {
        $lines = collect($items)->map(fn ($item) =>
            "🛏️ *{$item['name']}* — {$item['variant']} — {$item['price']}"
        )->implode("\n");
        $message = "Halo Kak Jasmine! 👋\nSaya ingin memesan beberapa item:\n\n{$lines}\n\nMohon konfirmasi ketersediaan dan detail pengirimannya ya, terima kasih! 🙏";
        return "https://wa.me/{$this->number}?text=" . rawurlencode($message);
    }
}
