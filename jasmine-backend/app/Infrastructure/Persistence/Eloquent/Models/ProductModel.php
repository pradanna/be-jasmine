<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'base_price', 'stock_status', 'preorder_days', 'is_active', 'is_featured',
    ];
    protected $casts = [
        'base_price'    => 'float',
        'preorder_days' => 'integer',
        'is_active'     => 'boolean',
        'is_featured'   => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CategoryModel::class, 'category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImageModel::class, 'product_id')->orderBy('order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariantModel::class, 'product_id')->where('is_active', true);
    }
}
