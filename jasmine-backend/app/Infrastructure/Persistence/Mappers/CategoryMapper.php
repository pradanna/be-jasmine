<?php

namespace App\Infrastructure\Persistence\Mappers;

use App\Domain\Category\Entities\Category;
use App\Infrastructure\Persistence\Eloquent\Models\CategoryModel;

class CategoryMapper
{
    public static function toDomain(CategoryModel $model): Category
    {
        return new Category(
            id: $model->id,
            name: $model->name,
            slug: $model->slug,
            description: $model->description,
            isActive: $model->is_active,
            order: $model->order,
        );
    }

    public static function toModel(Category $entity, ?CategoryModel $model = null): CategoryModel
    {
        $model = $model ?? new CategoryModel();
        $model->name        = $entity->name();
        $model->slug        = $entity->slug();
        $model->description = $entity->description();
        $model->is_active   = $entity->isActive();
        $model->order       = $entity->order();
        return $model;
    }
}
