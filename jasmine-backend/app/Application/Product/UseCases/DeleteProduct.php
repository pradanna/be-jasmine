<?php

namespace App\Application\Product\UseCases;

use App\Domain\Product\Repositories\ProductRepositoryInterface;

class DeleteProduct
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function execute(int $id): void
    {
        $product = $this->products->findById($id);
        if (! $product) {
            throw new \DomainException("Product not found: {$id}");
        }
        $this->products->delete($id);
    }
}
