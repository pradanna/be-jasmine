<?php

namespace App\Providers;

use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Domain\Setting\Repositories\SettingRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentCategoryRepository;
use App\Infrastructure\Persistence\Repositories\EloquentProductRepository;
use App\Infrastructure\Persistence\Repositories\EloquentSettingRepository;
use App\Infrastructure\Services\WhatsAppUrlGenerator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, EloquentCategoryRepository::class);
        $this->app->bind(SettingRepositoryInterface::class, EloquentSettingRepository::class);

        // Services
        $this->app->singleton(WhatsAppUrlGenerator::class, function () {
            $number = \App\Infrastructure\Persistence\Eloquent\Models\SettingModel::find('whatsapp_number')?->value ?? '628975050520';
            return new WhatsAppUrlGenerator($number);
        });
    }

    public function boot(): void {}
}
