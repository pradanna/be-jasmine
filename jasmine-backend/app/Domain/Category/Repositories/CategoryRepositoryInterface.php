<?php

namespace App\Domain\Category\Repositories;

use App\Domain\Category\Entities\Category;

interface CategoryRepositoryInterface
{
    public function findById(int $id): ?Category;
    public function findBySlug(string $slug): ?Category;
    public function findAllActive(): array;
    public function findAll(): array;
    public function save(Category $category): Category;
    public function delete(int $id): void;
}
