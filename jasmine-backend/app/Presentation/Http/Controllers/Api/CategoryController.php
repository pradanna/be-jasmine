<?php

namespace App\Presentation\Http\Controllers\Api;

use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Setting\Repositories\SettingRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categories,
        private readonly SettingRepositoryInterface $settings,
    ) {}

    public function index(): JsonResponse
    {
        $cats = collect($this->categories->findAllActive())->map(fn ($c) => [
            'id'   => $c->id(), 'name' => $c->name(), 'slug' => $c->slug(),
        ]);
        return response()->json(['data' => $cats]);
    }

    public function publicSettings(): JsonResponse
    {
        return response()->json(['data' => $this->settings->findPublic()]);
    }
}
