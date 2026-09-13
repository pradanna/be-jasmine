<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Product\Entities\Product;
use App\Domain\Product\ValueObjects\ProductPrice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Product $product */
        $product = $this->resource;
        $primaryImage = $product->primaryImage();

        return [
            'id'                    => $product->id(),
            'name'                  => $product->name(),
            'slug'                  => $product->slug(),
            'base_price'            => $product->basePrice()->amount(),
            'base_price_formatted'  => $product->basePrice()->formatted(),
            'stock_status'          => $product->stockStatus()->value(),
            'stock_status_label'    => $product->stockStatus()->label(),
            'is_featured'           => $product->isFeatured(),
            'primary_image'         => $primaryImage ? $primaryImage['url'] : null,
        ];
    }
}
