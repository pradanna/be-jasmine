<?php

namespace App\Presentation\Http\Controllers\Admin;

use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Application\Product\DTOs\ProductFilters;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly CategoryRepositoryInterface $categories,
    ) {}

    public function index(): Response
    {
        $allProducts    = $this->products->findAll(new ProductFilters());
        $activeProducts = array_filter($allProducts, fn ($p) => $p->isActive());
        $allCategories  = $this->categories->findAll();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_products'    => count($allProducts),
                'active_products'   => count($activeProducts),
                'total_categories'  => count($allCategories),
            ],
        ]);
    }
}
