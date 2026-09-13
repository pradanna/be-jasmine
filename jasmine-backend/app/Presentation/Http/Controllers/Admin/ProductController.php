<?php

namespace App\Presentation\Http\Controllers\Admin;

use App\Application\Product\DTOs\ProductData;
use App\Application\Product\DTOs\ProductFilters;
use App\Application\Product\UseCases\CreateProduct;
use App\Application\Product\UseCases\DeleteProduct;
use App\Application\Product\UseCases\GetProductCatalog;
use App\Application\Product\UseCases\ToggleProductStatus;
use App\Application\Product\UseCases\UpdateProduct;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\ProductImageModel;
use App\Infrastructure\Persistence\Eloquent\Models\ProductVariantModel;
use App\Presentation\Http\Requests\Admin\StoreProductRequest;
use App\Presentation\Http\Requests\Admin\UpdateProductRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly GetProductCatalog $getCatalog,
        private readonly CreateProduct $createProduct,
        private readonly UpdateProduct $updateProduct,
        private readonly DeleteProduct $deleteProduct,
        private readonly ToggleProductStatus $toggleStatus,
        private readonly ProductRepositoryInterface $products,
        private readonly CategoryRepositoryInterface $categories,
    ) {}

    public function index(Request $request): Response
    {
        $categoryId = $request->filled('category_id') ? (int) $request->get('category_id') : null;

        $filters = new ProductFilters(
            search:     $request->get('search'),
            categoryId: $categoryId,
            isActive:   null,
            sortBy:     'created_at',
            sortDir:    'desc',
        );
        $result     = $this->getCatalog->execute($filters, 15);
        $categories = $this->categories->findAll();

        return Inertia::render('Product/Index', [
            'products'   => array_map(fn ($p) => [
                'id'            => $p->id(),
                'name'          => $p->name(),
                'slug'          => $p->slug(),
                'description'   => $p->description(),
                'base_price'    => $p->basePrice()->amount(),
                'stock_status'  => $p->stockStatus()->value(),
                'preorder_days' => $p->preorderDays() ?? 14,
                'category_id'   => $p->categoryId(),
                'is_active'     => $p->isActive(),
                'is_featured'   => $p->isFeatured(),
                'primary_image' => $p->primaryImage(),
                'images'        => $p->images(),
                'variants'      => $p->variants(),
            ], $result['data']),
            'meta'       => $result['meta'],
            'categories' => array_map(fn ($c) => ['id' => $c->id(), 'name' => $c->name()], $categories),
            'filters'    => [
                'search'      => $request->get('search'),
                'category_id' => $categoryId,
            ],
        ]);
    }

    public function create(): Response
    {
        $categories = $this->categories->findAll();
        return Inertia::render('Product/Create', [
            'categories' => array_map(fn ($c) => ['id' => $c->id(), 'name' => $c->name()], $categories),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $uploadedPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $uploadedPaths[] = $file->store('products', 'public');
            }
        }

        $data = new ProductData(
            name:               $request->name,
            description:        $request->description ?? '',
            basePrice:          (float) $request->base_price,
            stockStatus:        $request->stock_status,
            preorderDays:       $request->filled('preorder_days') ? (int) $request->preorder_days : 14,
            categoryId:         (int) $request->category_id,
            isActive:           $request->boolean('is_active', true),
            isFeatured:         $request->boolean('is_featured'),
            variants:           $request->variants ?? [],
            images:             $uploadedPaths,
            primaryImageIndex:  $request->integer('primary_image_index', 0),
        );

        $product = $this->createProduct->execute($data);

        // Save images & variants via repository
        app(\App\Infrastructure\Persistence\Repositories\EloquentProductRepository::class)
            ->saveWithImages($product, $uploadedPaths, $data->primaryImageIndex, $data->variants);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $product    = $this->products->findById($id);
        if (! $product) abort(404);
        $categories = $this->categories->findAll();
        return Inertia::render('Product/Edit', [
            'product'    => [
                'id'            => $product->id(),
                'name'          => $product->name(),
                'slug'          => $product->slug(),
                'description'   => $product->description(),
                'base_price'    => $product->basePrice()->amount(),
                'stock_status'  => $product->stockStatus()->value(),
                'preorder_days' => $product->preorderDays() ?? 14,
                'category_id'   => $product->categoryId(),
                'is_active'     => $product->isActive(),
                'is_featured'   => $product->isFeatured(),
                'images'        => $product->images(),
                'variants'      => $product->variants(),
            ],
            'categories' => array_map(fn ($c) => ['id' => $c->id(), 'name' => $c->name()], $categories),
        ]);
    }

    public function update(UpdateProductRequest $request, int $id)
    {
        // Handle image deletions
        if ($request->has('delete_image_ids')) {
            foreach ($request->delete_image_ids as $imageId) {
                $img = ProductImageModel::find($imageId);
                if ($img) { Storage::disk('public')->delete($img->path); $img->delete(); }
            }
        }

        // Upload new images
        $newPaths = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $newPaths[] = $file->store('products', 'public');
            }
        }

        $data = new ProductData(
            name:              $request->name,
            description:       $request->description ?? '',
            basePrice:         (float) $request->base_price,
            stockStatus:       $request->stock_status,
            preorderDays:      $request->filled('preorder_days') ? (int) $request->preorder_days : 14,
            categoryId:        (int) $request->category_id,
            isActive:          $request->boolean('is_active', true),
            isFeatured:        $request->boolean('is_featured'),
            variants:          $request->variants ?? [],
            images:            $newPaths,
            primaryImageIndex: null,
        );

        $product = $this->updateProduct->execute($id, $data);

        // Save new images if any
        if (! empty($newPaths)) {
            app(\App\Infrastructure\Persistence\Repositories\EloquentProductRepository::class)
                ->saveWithImages($product, $newPaths, null, []);
        }

        // Update variants
        if ($request->has('variants')) {
            ProductVariantModel::where('product_id', $id)->delete();
            foreach ($request->variants as $v) {
                ProductVariantModel::create([
                    'product_id' => $id,
                    'label'      => $v['label'],
                    'price'      => $v['price'] ?? ($v['price_modifier'] ?? 0),
                    'is_active'  => true,
                ]);
            }
        }

        // Set primary image
        if ($request->has('primary_image_id')) {
            ProductImageModel::where('product_id', $id)->update(['is_primary' => false]);
            ProductImageModel::where('id', $request->primary_image_id)->update(['is_primary' => true]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->deleteProduct->execute($id);
        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }

    public function toggle(int $id)
    {
        $isActive = $this->toggleStatus->execute($id);
        return back()->with('success', $isActive ? 'Produk diaktifkan.' : 'Produk dinonaktifkan.');
    }
}
