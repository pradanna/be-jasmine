<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Application\Product\DTOs\ProductFilters;
use App\Domain\Product\Entities\Product;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\ProductImageModel;
use App\Infrastructure\Persistence\Eloquent\Models\ProductModel;
use App\Infrastructure\Persistence\Eloquent\Models\ProductVariantModel;
use App\Infrastructure\Persistence\Mappers\ProductMapper;
use Illuminate\Support\Facades\Storage;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function findById(int $id): ?Product
    {
        $model = ProductModel::with(['images', 'variants', 'category'])->find($id);
        return $model ? ProductMapper::toDomain($model) : null;
    }

    public function findBySlug(string $slug): ?Product
    {
        $model = ProductModel::with(['images', 'variants', 'category'])
            ->where('slug', $slug)->where('is_active', true)->first();
        return $model ? ProductMapper::toDomain($model) : null;
    }

    public function findAll(ProductFilters $filters): array
    {
        return $this->buildQuery($filters)->with(['images', 'category'])->get()
            ->map(fn ($m) => ProductMapper::toDomain($m))->toArray();
    }

    public function findPaginated(ProductFilters $filters, int $perPage = 12): array
    {
        $paginator = $this->buildQuery($filters)
            ->with(['images', 'category'])
            ->paginate($perPage);

        return [
            'data' => collect($paginator->items())->map(fn ($m) => ProductMapper::toDomain($m))->toArray(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ];
    }

    public function findFeatured(int $limit = 8): array
    {
        return ProductModel::with(['images', 'category'])
            ->where('is_active', true)->where('is_featured', true)
            ->orderBy('created_at', 'desc')->limit($limit)->get()
            ->map(fn ($m) => ProductMapper::toDomain($m))->toArray();
    }

    public function save(Product $product): Product
    {
        $model = $product->id() ? ProductModel::findOrFail($product->id()) : new ProductModel();
        $model = ProductMapper::toModel($product, $model);
        $model->save();
        return ProductMapper::toDomain($model->load(['images', 'variants', 'category']));
    }

    public function saveWithImages(Product $product, array $uploadedPaths, ?int $primaryIndex, array $variants): Product
    {
        $model = $product->id() ? ProductModel::findOrFail($product->id()) : new ProductModel();
        $model = ProductMapper::toModel($product, $model);
        $model->save();

        // Save images
        if (! empty($uploadedPaths)) {
            foreach ($uploadedPaths as $i => $path) {
                ProductImageModel::create([
                    'product_id' => $model->id,
                    'path'       => $path,
                    'is_primary' => $i === ($primaryIndex ?? 0),
                    'order'      => $i,
                ]);
            }
        }

        // Save variants
        if (! empty($variants)) {
            ProductVariantModel::where('product_id', $model->id)->delete();
            foreach ($variants as $v) {
                ProductVariantModel::create([
                    'product_id' => $model->id,
                    'label'      => $v['label'],
                    'price'      => $v['price'] ?? ($v['price_modifier'] ?? 0),
                    'is_active'  => true,
                ]);
            }
        }

        return ProductMapper::toDomain($model->load(['images', 'variants', 'category']));
    }

    public function delete(int $id): void
    {
        $model = ProductModel::findOrFail($id);
        // Delete images from storage
        foreach ($model->images as $image) {
            Storage::disk('public')->delete($image->path);
        }
        $model->delete();
    }

    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = ProductModel::where('slug', $slug);
        if ($excludeId) $query->where('id', '!=', $excludeId);
        return $query->exists();
    }

    private function buildQuery(ProductFilters $filters)
    {
        $query = ProductModel::query();

        if ($filters->isActive !== null) $query->where('is_active', $filters->isActive);
        if ($filters->isFeatured !== null) $query->where('is_featured', $filters->isFeatured);
        if ($filters->categoryId) {
            $query->where('category_id', $filters->categoryId);
        } elseif ($filters->categorySlug) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters->categorySlug));
        }
        if ($filters->search) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$filters->search}%")
                ->orWhere('description', 'like', "%{$filters->search}%")
            );
        }

        return $query->orderBy($filters->sortBy, $filters->sortDir);
    }
}
