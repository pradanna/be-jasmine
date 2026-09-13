<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get category IDs
        $catKingkoil = DB::table('categories')->where('name', 'Kingkoil Tencel')->value('id') ?? 1;
        $catSet      = DB::table('categories')->where('name', 'Sprei, Sarung Bantal, & Sarung Guling')->value('id') ?? 4;

        // Varian Sprei Kingkoil Tencel standar 9 ukuran
        $spreiVariants = [
            ['label' => '90 x 200 x 25', 'price' => 545000],
            ['label' => '100 x 200 x 25', 'price' => 585000],
            ['label' => '120 x 200 x 25', 'price' => 625000],
            ['label' => '160 x 200 x 30', 'price' => 767000],
            ['label' => '180 x 200 x 30', 'price' => 815000],
            ['label' => '200 x 200 x 30', 'price' => 865000],
            ['label' => '160 x 200 x 35', 'price' => 795000],
            ['label' => '180 x 200 x 35', 'price' => 845000],
            ['label' => '200 x 200 x 35', 'price' => 895000],
        ];

        // Varian Bedcover Set Kingkoil Tencel
        $bedcoverVariants = [
            ['label' => 'Bedcover Set 160 x 200 x 30', 'price' => 1859000],
            ['label' => 'Bedcover Set 180 x 200 x 30', 'price' => 1959000],
            ['label' => 'Bedcover Set 200 x 200 x 30', 'price' => 2059000],
            ['label' => 'Bedcover Set 160 x 200 x 35', 'price' => 1899000],
            ['label' => 'Bedcover Set 180 x 200 x 35', 'price' => 1999000],
            ['label' => 'Bedcover Set 200 x 200 x 35', 'price' => 2099000],
        ];

        $scrapedJsonPath = base_path('shopee_scraped_items.json');
        if (!file_exists($scrapedJsonPath)) {
            return;
        }

        $items = json_decode(file_get_contents($scrapedJsonPath), true);

        // Hapus produk lama yang dibuat dari placeholder
        DB::table('products')->where('slug', 'sprei-kingkoil-tencel-luxury-soft-silk')->delete();

        foreach ($items as $item) {
            $isBedcover = str_contains(strtoupper($item['name']), 'BEDCOVER');
            $categoryId = $isBedcover ? $catSet : $catKingkoil;
            $variants   = $isBedcover ? $bedcoverVariants : $spreiVariants;
            $basePrice  = (float) $item['price'];

            $motifName = trim(str_ireplace([
                'BEDCOVER SPREI SET JASMINE BEDDING COLLECTION KINGKOIL TENSEL J120',
                'BEDCOVER SPREI SET JASMINE BEDDING COLLECTION KINGKOIL TENCEL J120',
                'SPREI SET JASMINE BEDDING COLLECTION KINGKOIL TENSEL J120',
                'SPREI SET JASMINE BEDDING COLLECTION KINGKOIL TENCEL J120',
                'SRPEI SET JASMINE BEDDING COLLECTION KINGKOIL TENSEL J120',
                '// 3CM'
            ], '', $item['name']));

            $descTitle = htmlspecialchars($item['name']);
            $productType = $isBedcover ? 'Set Bedcover & Sprei Mewah' : 'Set Sprei Mewah';

            $description = "<h2>{$descTitle}</h2>"
                . "<p>Koleksi <strong>{$productType}</strong> dari bahan <strong>Kingkoil Tencel kualitas terbaik</strong> (Motif {$motifName}). Terbuat dari serat alami organik yang sangat halus, sejuk di kulit, berkilau elegan, dan memberikan kenyamanan tidur hotel bintang 5.</p>"
                . "<h3>Keunggulan Produk:</h3>"
                . "<ul>"
                . "<li><strong>100% Serat Kingkoil Tencel Organik Asli</strong></li>"
                . "<li>Tekstur super lembut, dingin alami, dan <em>breathable</em> di segala cuaca</li>"
                . "<li>Jahitan butik rapi, kuat, dan presisi oleh tim profesional Jasmine Bedding</li>"
                . "<li>Karet fitted berkualitas di setiap sudut agar sprei selalu rapi & kencang</li>"
                . "<li>Warna tahan lama dan tidak mudah pudar dicuci berulang kali</li>"
                . "</ul>"
                . "<h3>Kelengkapan Isi Paket:</h3>"
                . ($isBedcover
                    ? "<p>• 1 Bedcover Tebal Empuk Dakron Silikon Premium<br>• 1 Sprei Fitted Karet Sudut<br>• 2 Sarung Bantal Frame Elegan<br>• 2 Sarung Guling dengan tali terpasang siap pakai</p>"
                    : "<p>• 1 Sprei Fitted Karet Sudut<br>• Sarung Bantal Frame Elegan (1 untuk Single / 2 untuk Double & King)<br>• Sarung Guling dengan tali terpasang siap pakai</p>")
                . "<blockquote><p><strong>Catatan Pengerjaan & Pemesanan:</strong><br>Produk ini merupakan sistem <strong>Pre-Order (PO)</strong> dengan estimasi pengerjaan <strong>7-14 hari kerja</strong>.<br>Bisa request custom penambahan tinggi sprei atau sarung bantal tambahan melalui chat WhatsApp admin kami.</p></blockquote>";

            $slug = Str::slug($item['name']);
            $imagePath = 'products/' . $item['filename'];

            $productId = DB::table('products')->where('slug', $slug)->value('id');

            if ($productId) {
                DB::table('products')->where('id', $productId)->update([
                    'category_id'   => $categoryId,
                    'name'          => $item['name'],
                    'description'   => $description,
                    'base_price'    => $basePrice,
                    'stock_status'  => 'pre_order',
                    'preorder_days' => 14,
                    'is_active'     => true,
                    'is_featured'   => ($item['index'] <= 4), // 4 produk pertama jadi featured
                    'updated_at'    => now(),
                ]);
            } else {
                $productId = DB::table('products')->insertGetId([
                    'category_id'   => $categoryId,
                    'name'          => $item['name'],
                    'slug'          => $slug,
                    'description'   => $description,
                    'base_price'    => $basePrice,
                    'stock_status'  => 'pre_order',
                    'preorder_days' => 14,
                    'is_active'     => true,
                    'is_featured'   => ($item['index'] <= 4),
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);
            }

            // Simpan gambar utama produk
            DB::table('product_images')->where('product_id', $productId)->delete();
            DB::table('product_images')->insert([
                'product_id' => $productId,
                'path'       => $imagePath,
                'is_primary' => true,
                'order'      => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Simpan varian ukuran & harga
            DB::table('product_variants')->where('product_id', $productId)->delete();
            foreach ($variants as $v) {
                DB::table('product_variants')->insert([
                    'product_id' => $productId,
                    'label'      => $v['label'],
                    'price'      => $v['price'],
                    'is_active'  => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
