<?php

namespace App\Application\Setting\DTOs;

class SettingData
{
    /** @param array<string, string> $settings */
    public function __construct(
        public readonly array $settings,
    ) {}
}
