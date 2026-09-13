<?php

namespace App\Application\Product\UseCases;

use App\Application\Product\DTOs\ProductFilters;
use App\Domain\Product\Repositories\ProductRepositoryInterface;

class GetProductCatalog
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function execute(ProductFilters $filters, int $perPage = 12): array
    {
        return $this->products->findPaginated($filters, $perPage);
    }

    public function getFeatured(int $limit = 8): array
    {
        return $this->products->findFeatured($limit);
    }
}
