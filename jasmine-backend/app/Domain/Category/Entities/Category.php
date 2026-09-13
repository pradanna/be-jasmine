<?php

namespace App\Domain\Category\Entities;

class Category
{
    public function __construct(
        private readonly ?int $id,
        private string $name,
        private string $slug,
        private ?string $description,
        private bool $isActive,
        private int $order,
    ) {}

    public function id(): ?int            { return $this->id; }
    public function name(): string        { return $this->name; }
    public function slug(): string        { return $this->slug; }
    public function description(): ?string { return $this->description; }
    public function isActive(): bool      { return $this->isActive; }
    public function order(): int          { return $this->order; }

    public function activate(): void   { $this->isActive = true; }
    public function deactivate(): void { $this->isActive = false; }
}
