<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Category\Entities\Category;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\CategoryModel;
use App\Infrastructure\Persistence\Mappers\CategoryMapper;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public function findById(int $id): ?Category
    {
        $model = CategoryModel::find($id);
        return $model ? CategoryMapper::toDomain($model) : null;
    }

    public function findBySlug(string $slug): ?Category
    {
        $model = CategoryModel::where('slug', $slug)->first();
        return $model ? CategoryMapper::toDomain($model) : null;
    }

    public function findAllActive(): array
    {
        return CategoryModel::where('is_active', true)->orderBy('order')->get()
            ->map(fn ($m) => CategoryMapper::toDomain($m))->toArray();
    }

    public function findAll(): array
    {
        return CategoryModel::orderBy('order')->get()
            ->map(fn ($m) => CategoryMapper::toDomain($m))->toArray();
    }

    public function save(Category $category): Category
    {
        $model = $category->id() ? CategoryModel::findOrFail($category->id()) : new CategoryModel();
        $model = CategoryMapper::toModel($category, $model);
        $model->save();
        return CategoryMapper::toDomain($model);
    }

    public function delete(int $id): void
    {
        CategoryModel::findOrFail($id)->delete();
    }
}
