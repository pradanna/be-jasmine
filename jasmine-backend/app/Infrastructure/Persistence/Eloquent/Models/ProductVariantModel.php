<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariantModel extends Model
{
    protected $table = 'product_variants';
    protected $fillable = ['product_id', 'label', 'price', 'is_active'];
    protected $casts = ['price' => 'float', 'is_active' => 'boolean'];
    protected $appends = ['final_price'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function getFinalPriceAttribute(): float
    {
        return (float) ($this->price > 0 ? $this->price : ($this->product ? $this->product->base_price : 0));
    }
}
