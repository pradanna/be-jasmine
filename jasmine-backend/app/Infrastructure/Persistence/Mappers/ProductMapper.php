<?php

namespace App\Infrastructure\Persistence\Mappers;

use App\Domain\Product\Entities\Product;
use App\Domain\Product\ValueObjects\ProductPrice;
use App\Domain\Product\ValueObjects\StockStatus;
use App\Infrastructure\Persistence\Eloquent\Models\ProductModel;

class ProductMapper
{
    public static function toDomain(ProductModel $model): Product
    {
        $images = $model->relationLoaded('images')
            ? $model->images->map(fn ($img) => [
                'id'         => $img->id,
                'url'        => $img->url,
                'path'       => $img->path,
                'is_primary' => $img->is_primary,
                'order'      => $img->order,
              ])->toArray()
            : [];

        $variants = $model->relationLoaded('variants')
            ? $model->variants->map(fn ($v) => [
                'id'             => $v->id,
                'label'          => $v->label,
                'price'          => (float) $v->price,
                'final_price'    => (float) ($v->price > 0 ? $v->price : $model->base_price),
                'is_active'      => $v->is_active,
              ])->toArray()
            : [];

        return new Product(
            id: $model->id,
            name: $model->name,
            slug: $model->slug,
            description: $model->description,
            basePrice: new ProductPrice($model->base_price),
            stockStatus: new StockStatus($model->stock_status),
            preorderDays: $model->preorder_days,
            categoryId: $model->category_id,
            isActive: $model->is_active,
            isFeatured: $model->is_featured,
            images: $images,
            variants: $variants,
        );
    }

    public static function toModel(Product $entity, ?ProductModel $model = null): ProductModel
    {
        $model = $model ?? new ProductModel();
        $model->category_id   = $entity->categoryId();
        $model->name          = $entity->name();
        $model->slug          = $entity->slug();
        $model->description   = $entity->description();
        $model->base_price    = $entity->basePrice()->amount();
        $model->stock_status  = $entity->stockStatus()->value();
        $model->preorder_days = $entity->preorderDays();
        $model->is_active     = $entity->isActive();
        $model->is_featured   = $entity->isFeatured();
        return $model;
    }
}
