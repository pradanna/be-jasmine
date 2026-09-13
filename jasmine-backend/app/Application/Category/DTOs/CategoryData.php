<?php

namespace App\Application\Category\DTOs;

class CategoryData
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
        public readonly bool $isActive,
        public readonly int $order,
    ) {}
}
