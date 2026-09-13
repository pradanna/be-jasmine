<?php

namespace App\Domain\Setting\Entities;

class Setting
{
    public function __construct(
        private readonly string $key,
        private string $value,
    ) {}

    public function key(): string   { return $this->key; }
    public function value(): string { return $this->value; }
    public function update(string $value): void { $this->value = $value; }
}
