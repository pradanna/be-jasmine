<?php

namespace App\Domain\Product\Repositories;

use App\Domain\Product\Entities\Product;
use App\Application\Product\DTOs\ProductFilters;

interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;
    public function findBySlug(string $slug): ?Product;
    public function findAll(ProductFilters $filters): array;
    public function findPaginated(ProductFilters $filters, int $perPage = 12): array;
    public function findFeatured(int $limit = 8): array;
    public function save(Product $product): Product;
    public function delete(int $id): void;
    public function slugExists(string $slug, ?int $excludeId = null): bool;
}
