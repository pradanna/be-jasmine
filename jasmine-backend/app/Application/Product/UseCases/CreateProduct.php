<?php

namespace App\Application\Product\UseCases;

use App\Application\Product\DTOs\ProductData;
use App\Domain\Product\Entities\Product;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Domain\Product\ValueObjects\ProductPrice;
use App\Domain\Product\ValueObjects\StockStatus;
use Illuminate\Support\Str;

class CreateProduct
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function execute(ProductData $data): Product
    {
        $slug = $this->uniqueSlug($data->name);

        $product = new Product(
            id: null,
            name: $data->name,
            slug: $slug,
            description: $data->description,
            basePrice: new ProductPrice($data->basePrice),
            stockStatus: new StockStatus($data->stockStatus),
            categoryId: $data->categoryId,
            isActive: $data->isActive,
            isFeatured: $data->isFeatured,
        );

        return $this->products->save($product);
    }

    private function uniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $counter = 1;

        while ($this->products->slugExists($slug)) {
            $slug = "{$original}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
