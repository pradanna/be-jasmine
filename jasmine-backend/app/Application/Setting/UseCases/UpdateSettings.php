<?php

namespace App\Application\Setting\UseCases;

use App\Application\Setting\DTOs\SettingData;
use App\Domain\Setting\Entities\Setting;
use App\Domain\Setting\Repositories\SettingRepositoryInterface;

class UpdateSettings
{
    public function __construct(private readonly SettingRepositoryInterface $settings) {}

    public function execute(SettingData $data): void
    {
        $settings = array_map(
            fn (string $key, string $value) => new Setting($key, $value),
            array_keys($data->settings),
            array_values($data->settings),
        );
        $this->settings->saveMany($settings);
    }
}
