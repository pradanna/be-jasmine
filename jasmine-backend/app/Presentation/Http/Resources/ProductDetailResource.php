<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Product\Entities\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Product $product */
        $product = $this->resource;

        return [
            'id'                   => $product->id(),
            'name'                 => $product->name(),
            'slug'                 => $product->slug(),
            'description'          => $product->description(),
            'base_price'           => $product->basePrice()->amount(),
            'base_price_formatted' => $product->basePrice()->formatted(),
            'stock_status'         => $product->stockStatus()->value(),
            'stock_status_label'   => $product->stockStatus()->label(),
            'preorder_days'        => $product->preorderDays() ?? 14,
            'is_featured'          => $product->isFeatured(),
            'images'               => collect($product->images())->map(fn ($img) => [
                'id'         => $img['id'],
                'url'        => $img['url'],
                'is_primary' => $img['is_primary'],
            ])->values(),
            'variants'             => collect($product->variants())->map(fn ($v) => [
                'id'             => $v['id'],
                'label'          => $v['label'],
                'price'          => $v['price'] ?? $v['final_price'],
                'price_formatted'=> 'Rp ' . number_format($v['price'] ?? $v['final_price'], 0, ',', '.'),
                'price_modifier' => 0,
                'final_price'    => $v['final_price'] ?? ($v['price'] ?? 0),
                'final_price_formatted' => 'Rp ' . number_format($v['final_price'] ?? ($v['price'] ?? 0), 0, ',', '.'),
            ])->values(),
        ];
    }
}
