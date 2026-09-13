<?php

namespace App\Application\Category\UseCases;

use App\Application\Category\DTOs\CategoryData;
use App\Domain\Category\Entities\Category;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use Illuminate\Support\Str;

class CreateCategory
{
    public function __construct(private readonly CategoryRepositoryInterface $categories) {}

    public function execute(CategoryData $data): Category
    {
        $slug = Str::slug($data->name);
        return $this->categories->save(new Category(
            id: null, name: $data->name, slug: $slug,
            description: $data->description, isActive: $data->isActive, order: $data->order,
        ));
    }
}
