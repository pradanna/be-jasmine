<?php

namespace App\Application\Product\DTOs;

class ProductFilters
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $categorySlug = null,
        public readonly ?int $categoryId = null,
        public readonly ?bool $isActive = null,
        public readonly ?bool $isFeatured = null,
        public readonly string $sortBy = 'created_at',
        public readonly string $sortDir = 'desc',
    ) {}
}
