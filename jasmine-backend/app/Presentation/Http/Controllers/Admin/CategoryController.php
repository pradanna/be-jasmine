<?php

namespace App\Presentation\Http\Controllers\Admin;

use App\Application\Category\DTOs\CategoryData;
use App\Application\Category\UseCases\CreateCategory;
use App\Application\Category\UseCases\DeleteCategory;
use App\Application\Category\UseCases\UpdateCategory;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Presentation\Http\Requests\Admin\StoreCategoryRequest;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categories,
        private readonly CreateCategory $createCategory,
        private readonly UpdateCategory $updateCategory,
        private readonly DeleteCategory $deleteCategory,
    ) {}

    public function index(): Response
    {
        $cats = array_map(fn ($c) => [
            'id' => $c->id(), 'name' => $c->name(), 'slug' => $c->slug(),
            'description' => $c->description(), 'is_active' => $c->isActive(), 'order' => $c->order(),
        ], $this->categories->findAll());

        return Inertia::render('Category/Index', ['categories' => $cats]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = new CategoryData(
            name: $request->name,
            description: $request->description,
            isActive: $request->boolean('is_active', true),
            order: $request->integer('order', 0),
        );
        $category = $this->createCategory->execute($data);

        if ($request->wantsJson()) {
            return response()->json([
                'category' => [
                    'id'   => $category->id(),
                    'name' => $category->name(),
                    'slug' => $category->slug(),
                ],
                'message'  => 'Kategori berhasil ditambahkan.',
            ], 201);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(StoreCategoryRequest $request, int $id)
    {
        $data = new CategoryData(
            name: $request->name,
            description: $request->description,
            isActive: $request->boolean('is_active', true),
            order: $request->integer('order', 0),
        );
        $this->updateCategory->execute($id, $data);
        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->deleteCategory->execute($id);
        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
