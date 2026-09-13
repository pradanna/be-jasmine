<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Setting\Entities\Setting;
use App\Domain\Setting\Repositories\SettingRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\SettingModel;

class EloquentSettingRepository implements SettingRepositoryInterface
{
    private static array $PUBLIC_KEYS = [
        'whatsapp_number', 'hero_title', 'hero_subtitle', 'hero_image', 'store_name', 'store_description',
    ];

    public function findByKey(string $key): ?Setting
    {
        $model = SettingModel::find($key);
        return $model ? new Setting($model->key, $model->value ?? '') : null;
    }

    public function findAll(): array
    {
        return SettingModel::all()->map(fn ($m) => new Setting($m->key, $m->value ?? ''))->toArray();
    }

    public function findPublic(): array
    {
        return SettingModel::whereIn('key', self::$PUBLIC_KEYS)->get()
            ->mapWithKeys(fn ($m) => [$m->key => $m->value ?? ''])->toArray();
    }

    public function save(Setting $setting): void
    {
        SettingModel::updateOrCreate(['key' => $setting->key()], ['value' => $setting->value()]);
    }

    public function saveMany(array $settings): void
    {
        foreach ($settings as $setting) {
            $this->save($setting);
        }
    }

    public function getValue(string $key, string $default = ''): string
    {
        return SettingModel::find($key)?->value ?? $default;
    }
}
