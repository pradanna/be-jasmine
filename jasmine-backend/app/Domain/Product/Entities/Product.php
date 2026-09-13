<?php

namespace App\Domain\Product\Entities;

use App\Domain\Product\ValueObjects\ProductPrice;
use App\Domain\Product\ValueObjects\StockStatus;

use JsonSerializable;

class Product implements JsonSerializable
{
    public function __construct(
        private readonly ?int $id,
        private string $name,
        private string $slug,
        private ?string $description,
        private ProductPrice $basePrice,
        private StockStatus $stockStatus,
        private ?int $preorderDays,
        private int $categoryId,
        private bool $isActive,
        private bool $isFeatured,
        private array $images = [],
        private array $variants = [],
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'base_price'    => $this->basePrice->amount(),
            'stock_status'  => $this->stockStatus->value(),
            'preorder_days' => $this->preorderDays ?? 14,
            'category_id'   => $this->categoryId,
            'is_active'     => $this->isActive,
            'is_featured'   => $this->isFeatured,
            'images'        => $this->images,
            'primary_image' => $this->primaryImage(),
            'variants'      => $this->variants,
        ];
    }

    public function id(): ?int            { return $this->id; }
    public function name(): string        { return $this->name; }
    public function slug(): string        { return $this->slug; }
    public function description(): ?string { return $this->description; }
    public function basePrice(): ProductPrice { return $this->basePrice; }
    public function stockStatus(): StockStatus { return $this->stockStatus; }
    public function preorderDays(): ?int  { return $this->preorderDays; }
    public function categoryId(): int     { return $this->categoryId; }
    public function isActive(): bool      { return $this->isActive; }
    public function isFeatured(): bool    { return $this->isFeatured; }
    public function images(): array       { return $this->images; }
    public function variants(): array     { return $this->variants; }
    public function primaryImage(): ?array
    {
        foreach ($this->images as $image) {
            if ($image['is_primary'] ?? false) return $image;
        }
        return $this->images[0] ?? null;
    }

    public function activate(): void   { $this->isActive = true; }
    public function deactivate(): void { $this->isActive = false; }
    public function toggleActive(): void { $this->isActive = ! $this->isActive; }
    public function markFeatured(): void   { $this->isFeatured = true; }
    public function unmarkFeatured(): void { $this->isFeatured = false; }
}
