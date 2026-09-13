<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'whatsapp_number',   'value' => '628975050520'],
            ['key' => 'hero_title',        'value' => 'Sprei Berkualitas untuk Tidur Lebih Nyaman'],
            ['key' => 'hero_subtitle',     'value' => 'Temukan koleksi sprei premium Jasmine dengan berbagai ukuran dan motif'],
            ['key' => 'hero_image',        'value' => ''],
            ['key' => 'store_name',        'value' => 'Jasmine Sprei'],
            ['key' => 'store_description', 'value' => 'Toko sprei berkualitas dengan harga terjangkau'],
        ];
        foreach ($settings as $s) {
            DB::table('settings')->updateOrInsert(['key' => $s['key']], $s);
        }
    }
}
