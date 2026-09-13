<?php

namespace App\Domain\Product\ValueObjects;

use InvalidArgumentException;

final class ProductPrice
{
    public function __construct(
        private readonly float $amount,
    ) {
        if ($amount < 0) {
            throw new InvalidArgumentException('Price cannot be negative.');
        }
    }

    public function amount(): float
    {
        return $this->amount;
    }

    public function formatted(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    public function add(self $other): self
    {
        return new self($this->amount + $other->amount);
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount;
    }
}
