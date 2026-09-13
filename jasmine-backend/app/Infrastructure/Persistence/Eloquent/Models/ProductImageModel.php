<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImageModel extends Model
{
    protected $table = 'product_images';
    protected $fillable = ['product_id', 'path', 'is_primary', 'order'];
    protected $casts = ['is_primary' => 'boolean', 'order' => 'integer'];
    protected $appends = ['url'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function getUrlAttribute(): string
    {
        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
            return $this->path;
        }

        if (str_starts_with($this->path, 'uploads/')) {
            return asset($this->path);
        }

        // If stored as products/xxx.jpg, check public/uploads/products/xxx.jpg first
        if (file_exists(public_path('uploads/' . $this->path))) {
            return asset('uploads/' . $this->path);
        }

        if (file_exists(public_path('storage/' . $this->path))) {
            return asset('storage/' . $this->path);
        }

        return asset('uploads/' . $this->path);
    }
}
