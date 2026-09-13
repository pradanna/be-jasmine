<?php

namespace App\Domain\Setting\Repositories;

use App\Domain\Setting\Entities\Setting;

interface SettingRepositoryInterface
{
    public function findByKey(string $key): ?Setting;
    public function findAll(): array;
    public function findPublic(): array;
    public function save(Setting $setting): void;
    public function saveMany(array $settings): void;
    public function getValue(string $key, string $default = ''): string;
}
