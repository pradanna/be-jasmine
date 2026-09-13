<?php

namespace App\Application\Product\DTOs;

class ProductData
{
    public function __construct(
        public readonly string $name,
        public readonly string $description,
        public readonly float $basePrice,
        public readonly string $stockStatus,
        public readonly ?int $preorderDays = 14,
        public readonly int $categoryId,
        public readonly bool $isActive,
        public readonly bool $isFeatured,
        public readonly array $variants = [],   // [{label, price}]
        public readonly array $images = [],     // uploaded file paths
        public readonly ?int $primaryImageIndex = null,
    ) {}
}
