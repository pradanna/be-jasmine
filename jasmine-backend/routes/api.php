<?php

use App\Presentation\Http\Controllers\Api\CategoryController;
use App\Presentation\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('settings/public', [CategoryController::class, 'publicSettings']);
});
