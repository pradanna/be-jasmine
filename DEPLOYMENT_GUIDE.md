# Panduan Deployment Shared Hosting - Jasmine Sprei

Dokumen ini memandu langkah demi langkah untuk upload dan deploy project **Jasmine Sprei** ke Shared Hosting (cPanel / DirectAdmin / CyberPanel).

---

## Ringkasan Struktur Hasil Build

1. **Backend (Laravel + Inertia Admin Panel)**
   - Direktori: `jasmine-backend/`
   - Assets Admin Panel hasil build: `jasmine-backend/public/build/`
   - Upload folder foto produk: `jasmine-backend/public/uploads/products/`
   - Semua route admin & REST API siap dijalankan di PHP 8.2 atau PHP 8.3+.

2. **Frontend (SvelteKit Client Website - SPA Mode)**
   - Direktori hasil build: `jasmine-frontend/build/`
   - File output: `index.html`, `_app/`, `assets/`, `favicon.*`
   - Client mengonsumsi endpoint API Laravel melalui konfigurasi `VITE_API_BASE_URL`.

---

## 1. Verifikasi Database & Seeder

Database seeder sudah lengkap dan mencakup:
- **Akun Admin**:
  - Email: `admin@jasminesprei.com`
  - Password: `password`
- **Kategori**: 4 Kategori (Kingkoil Tencel, Katun Jepang, Katun Lokal, Sprei & Bedcover Set).
- **Produk**: 30 item produk riil hasil scraping motif Jasmine Bedding Collection Kingkoil Tencel.
- **Varian**: 231 varian ukuran beserta nominal harga lengkap.
- **Gambar Produk**: 30 file gambar tersimpan di `public/uploads/products/`.
- **Pengaturan Toko**: Nomor WhatsApp toko (`628975050520`), banner hero, dan informasi toko.

> **Tips Export Database Lokal:**
> Anda bisa mengekspor database lokal `jasmine_sprei` via phpMyAdmin (Export SQL) lalu mengimpornya ke database MySQL di cPanel hosting Anda.

---

## 2. Opsi Penempatan di Shared Hosting

Ada 2 opsi arsitektur deployment yang umum digunakan:

### Opsi A: Menggunakan Subdomain (Disarankan & Paling Rapi)
- Frontend Utama: `www.domainanda.com` (document root `public_html/` diarahkan ke hasil build frontend `jasmine-frontend/build/`).
- Backend & Admin: `admin.domainanda.com` atau `api.domainanda.com` (document root diarahkan ke `jasmine-backend/public/`).

### Opsi B: Satu Domain dengan Subfolder
- Frontend: `domainanda.com` di `public_html/`
- Backend: `domainanda.com/api` dan `domainanda.com/admin`

---

## 3. Langkah Upload Backend (Laravel)

1. **Kompres file backend** ke dalam file ZIP (kecualikan folder `node_modules` agar file ringan).
2. Di File Manager cPanel, buat folder di luar `public_html` (misalnya `/home/username/jasmine_core`).
3. Upload dan ekstrak ZIP ke `/home/username/jasmine_core`.
4. Arahkan Document Root subdomain backend (misal `admin.domainanda.com`) ke folder `/home/username/jasmine_core/public`.
   *(Jika provider tidak mengizinkan ganti document root, pindahkan isi `jasmine_core/public/` ke document root lalu sesuaikan path `vendor/autoload.php` dan `bootstrap/app.php` di `index.php`).*
5. Edit file `.env` di hosting:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://admin.domainanda.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nama_db_cpanel
   DB_USERNAME=nama_user_cpanel
   DB_PASSWORD=password_db_cpanel
   ```
6. Pastikan file gambar produk di `public/uploads/products/` ikut ter-upload.

---

## 4. Langkah Upload Frontend (SvelteKit)

1. Sebelum build final untuk domain hosting, tentukan URL Backend API hosting Anda di file `jasmine-frontend/.env`:
   ```env
   VITE_API_BASE_URL=https://admin.domainanda.com/api/v1
   ```
   Lalu jalankan `npm run build` di folder `jasmine-frontend`.
2. Buka folder `jasmine-frontend/build/`.
3. Upload seluruh isi folder `jasmine-frontend/build/` ke `public_html/` hosting.
4. Buat file `.htaccess` di dalam `public_html/` untuk fallback routing SvelteKit SPA:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 5. Cek Checklist Akhir Demo

- [x] Backend assets built (`public/build/manifest.json`)
- [x] Frontend static assets built (`jasmine-frontend/build/`)
- [x] Database seeder terverifikasi (User admin, 4 kategori, 30 produk, 231 varian, settings)
- [x] Media gambar produk lengkap (30 file di `public/uploads/products/`)
- [x] Dynamic API base URL support via `VITE_API_BASE_URL`
