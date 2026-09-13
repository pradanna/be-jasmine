<?php

namespace App\Application\Product\UseCases;

use App\Application\Product\DTOs\ProductData;
use App\Domain\Product\Entities\Product;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Domain\Product\ValueObjects\ProductPrice;
use App\Domain\Product\ValueObjects\StockStatus;
use Illuminate\Support\Str;

class UpdateProduct
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function execute(int $id, ProductData $data): Product
    {
        $product = $this->products->findById($id);
        if (! $product) {
            throw new \DomainException("Product not found: {$id}");
        }

        $slug = $this->uniqueSlug($data->name, $id, $product->slug());

        return $this->products->save(new Product(
            id: $id,
            name: $data->name,
            slug: $slug,
            description: $data->description,
            basePrice: new ProductPrice($data->basePrice),
            stockStatus: new StockStatus($data->stockStatus),
            categoryId: $data->categoryId,
            isActive: $data->isActive,
            isFeatured: $data->isFeatured,
        ));
    }

    private function uniqueSlug(string $name, int $excludeId, string $currentSlug): string
    {
        $slug = Str::slug($name);
        if ($slug === $currentSlug) return $slug;

        $original = $slug;
        $counter = 1;
        while ($this->products->slugExists($slug, $excludeId)) {
            $slug = "{$original}-{$counter}";
            $counter++;
        }
        return $slug;
    }
}
