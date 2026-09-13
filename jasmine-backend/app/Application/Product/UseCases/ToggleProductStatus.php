<?php

namespace App\Application\Product\UseCases;

use App\Domain\Product\Repositories\ProductRepositoryInterface;

class ToggleProductStatus
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function execute(int $id): bool
    {
        $product = $this->products->findById($id);
        if (! $product) {
            throw new \DomainException("Product not found: {$id}");
        }
        $product->toggleActive();
        $this->products->save($product);
        return $product->isActive();
    }
}
