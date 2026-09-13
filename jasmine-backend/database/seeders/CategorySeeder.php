<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Kingkoil Tencel',                            'order' => 1],
            ['name' => 'Katun Jepang',                              'order' => 2],
            ['name' => 'Katun Lokal',                               'order' => 3],
            ['name' => 'Sprei, Sarung Bantal, & Sarung Guling',     'order' => 4],
        ];

        // Nonaktifkan / bersihkan kategori lama agar rapi sesuai referensi baru
        DB::table('categories')->whereNotIn('name', array_column($categories, 'name'))->delete();

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(['name' => $cat['name']], [
                'name'       => $cat['name'],
                'slug'       => Str::slug($cat['name']),
                'is_active'  => true,
                'order'      => $cat['order'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
