<?php

namespace App\Application\Category\UseCases;

use App\Application\Category\DTOs\CategoryData;
use App\Domain\Category\Entities\Category;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use Illuminate\Support\Str;

class UpdateCategory
{
    public function __construct(private readonly CategoryRepositoryInterface $categories) {}

    public function execute(int $id, CategoryData $data): Category
    {
        $category = $this->categories->findById($id);
        if (! $category) throw new \DomainException("Category not found: {$id}");
        $slug = Str::slug($data->name);
        return $this->categories->save(new Category(
            id: $id, name: $data->name, slug: $slug,
            description: $data->description, isActive: $data->isActive, order: $data->order,
        ));
    }
}
