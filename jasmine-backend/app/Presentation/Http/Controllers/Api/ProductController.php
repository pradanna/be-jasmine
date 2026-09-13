<?php

namespace App\Presentation\Http\Controllers\Api;

use App\Application\Product\DTOs\ProductFilters;
use App\Application\Product\UseCases\GetProductCatalog;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Presentation\Http\Resources\ProductDetailResource;
use App\Presentation\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    public function __construct(
        private readonly GetProductCatalog $getCatalog,
        private readonly ProductRepositoryInterface $products,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = new ProductFilters(
            search:       $request->get('search'),
            categorySlug: $request->get('category'),
            isActive:     true,
            isFeatured:   $request->boolean('featured') ?: null,
        );

        $perPage = min(max($request->integer('per_page', 12), 1), 50);
        $result  = $this->getCatalog->execute($filters, perPage: $perPage);
        $data    = collect($result['data'])->map(fn ($p) => (new ProductResource($p))->toArray($request));

        return response()->json(['data' => $data, 'meta' => $result['meta']]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $product = $this->products->findBySlug($slug);
        if (! $product) return response()->json(['message' => 'Product not found'], 404);
        return response()->json(['data' => (new ProductDetailResource($product))->toArray($request)]);
    }
}
