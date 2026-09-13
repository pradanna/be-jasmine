<?php

namespace App\Application\Category\UseCases;

use App\Domain\Category\Repositories\CategoryRepositoryInterface;

class DeleteCategory
{
    public function __construct(private readonly CategoryRepositoryInterface $categories) {}

    public function execute(int $id): void
    {
        if (! $this->categories->findById($id)) throw new \DomainException("Category not found: {$id}");
        $this->categories->delete($id);
    }
}
