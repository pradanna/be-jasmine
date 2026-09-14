<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('product_variants', 'price')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->decimal('price', 12, 2)->default(0)->after('label');
            });
        }

        if (Schema::hasColumn('product_variants', 'price_modifier')) {
            // Copy existing calculated price: product.base_price + price_modifier
            \Illuminate\Support\Facades\DB::statement("
                UPDATE product_variants pv
                JOIN products p ON pv.product_id = p.id
                SET pv.price = p.base_price + pv.price_modifier
            ");

            Schema::table('product_variants', function (Blueprint $table) {
                $table->dropColumn('price_modifier');
            });
        }
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->decimal('price_modifier', 10, 2)->default(0)->after('label');
        });

        \Illuminate\Support\Facades\DB::statement("
            UPDATE product_variants pv
            JOIN products p ON pv.product_id = p.id
            SET pv.price_modifier = pv.price - p.base_price
        ");

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
