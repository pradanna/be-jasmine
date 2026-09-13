<?php

namespace App\Domain\Product\ValueObjects;

use InvalidArgumentException;

final class StockStatus
{
    public const AVAILABLE   = 'available';
    public const OUT_OF_STOCK = 'out_of_stock';
    public const PRE_ORDER   = 'pre_order';

    private static array $allowed = [
        self::AVAILABLE,
        self::OUT_OF_STOCK,
        self::PRE_ORDER,
    ];

    public function __construct(
        private readonly string $value,
    ) {
        if (! in_array($value, self::$allowed, true)) {
            throw new InvalidArgumentException("Invalid stock status: {$value}");
        }
    }

    public static function available(): self   { return new self(self::AVAILABLE); }
    public static function outOfStock(): self  { return new self(self::OUT_OF_STOCK); }
    public static function preOrder(): self    { return new self(self::PRE_ORDER); }

    public function value(): string  { return $this->value; }
    public function isAvailable(): bool { return $this->value === self::AVAILABLE; }
    public function label(): string
    {
        return match ($this->value) {
            self::AVAILABLE    => 'Tersedia',
            self::OUT_OF_STOCK => 'Habis',
            self::PRE_ORDER    => 'Pre-Order',
        };
    }

    public function equals(self $other): bool { return $this->value === $other->value; }
}
