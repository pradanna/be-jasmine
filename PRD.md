# PRD — Jasmine Sprei Website Penjualan

## Overview
Website katalog penjualan sprei untuk brand **Jasmine Sprei** (`@jasmine_spreiid`).
Customer browse produk lalu checkout via **WhatsApp**. Admin kelola produk via **Admin Panel**.

---

## Keputusan Teknis Final

| Item | Keputusan |
|------|-----------|
| Backend + Admin | `jasmine-backend/` — Laravel 12 + Inertia.js + React |
| Customer Frontend | `jasmine-frontend/` — SvelteKit 2 + adapter-static |
| Database | MySQL |
| File storage | Spatie Media Library (disk: public) |
| Admin auth | Laravel session-based (Inertia) |
| API ke FE | Laravel REST API `/api/v1/...` |
| Deploy | Shared hosting cPanel |
| Nomor WhatsApp | `628975050520` |
| Arsitektur | DDD Layered (Simple) |
| Composer path | `C:\laragon\bin\composer\composer.bat` |

---

## Tech Stack

### jasmine-backend (Laravel 12)
- `inertiajs/inertia-laravel` — bridge Inertia admin
- `tightenco/ziggy` — route helper di React
- `spatie/laravel-medialibrary` — upload & manage gambar
- `spatie/laravel-sluggable` — auto slug
- `spatie/laravel-query-builder` — filter & sort API
- React: `@inertiajs/react`, `tailwindcss`, `shadcn/ui`, `react-hook-form`, `zod`, `@tanstack/react-table`, `lucide-react`

### jasmine-frontend (SvelteKit 2)
- `@sveltejs/adapter-static` — build ke static (shared hosting)
- `tailwindcss`, `lucide-svelte`

---

## Arsitektur: DDD Layered Simple

```
Presentation → Application → Domain
Infrastructure → Domain (implements interfaces)
```

Domain = pure PHP, ZERO dependency ke Laravel/Eloquent.

---

## Folder Structure jasmine-backend/app/

```
Domain/
  Product/Entities/Product.php
  Product/ValueObjects/ProductPrice.php
  Product/ValueObjects/StockStatus.php
  Product/Repositories/ProductRepositoryInterface.php
  Category/Entities/Category.php
  Category/Repositories/CategoryRepositoryInterface.php
  Setting/Entities/Setting.php
  Setting/Repositories/SettingRepositoryInterface.php

Application/
  Product/UseCases/CreateProduct.php
  Product/UseCases/UpdateProduct.php
  Product/UseCases/DeleteProduct.php
  Product/UseCases/ToggleProductStatus.php
  Product/UseCases/GetProductCatalog.php
  Product/DTOs/ProductData.php
  Product/DTOs/ProductFilters.php
  Category/UseCases/CreateCategory.php
  Category/UseCases/UpdateCategory.php
  Category/UseCases/DeleteCategory.php
  Category/DTOs/CategoryData.php
  Setting/UseCases/UpdateSettings.php
  Setting/DTOs/SettingData.php

Infrastructure/
  Persistence/Eloquent/Models/ProductModel.php
  Persistence/Eloquent/Models/ProductImageModel.php
  Persistence/Eloquent/Models/ProductVariantModel.php
  Persistence/Eloquent/Models/CategoryModel.php
  Persistence/Eloquent/Models/SettingModel.php
  Persistence/Mappers/ProductMapper.php
  Persistence/Mappers/CategoryMapper.php
  Persistence/Repositories/EloquentProductRepository.php
  Persistence/Repositories/EloquentCategoryRepository.php
  Persistence/Repositories/EloquentSettingRepository.php
  Services/WhatsAppUrlGenerator.php

Presentation/Http/
  Controllers/Admin/AuthController.php
  Controllers/Admin/DashboardController.php
  Controllers/Admin/ProductController.php
  Controllers/Admin/CategoryController.php
  Controllers/Admin/SettingController.php
  Controllers/Api/ProductController.php
  Controllers/Api/CategoryController.php
  Requests/Admin/StoreProductRequest.php
  Requests/Admin/UpdateProductRequest.php
  Requests/Admin/StoreCategoryRequest.php
  Requests/Admin/UpdateSettingsRequest.php
  Resources/ProductResource.php
  Resources/ProductDetailResource.php
  Resources/CategoryResource.php
```

---

## Database Schema

```sql
-- categories
id, name, slug, description, is_active BOOL, `order` INT, timestamps

-- products
id, category_id FK, name, slug, description,
base_price DECIMAL(10,2),
stock_status ENUM(available|out_of_stock|pre_order),
is_active BOOL, is_featured BOOL, timestamps

-- product_images
id, product_id FK, path VARCHAR(500), is_primary BOOL, `order` INT, timestamps

-- product_variants
id, product_id FK, label VARCHAR(100), price_modifier DECIMAL(10,2), is_active BOOL, timestamps

-- settings
`key` VARCHAR(100) UNIQUE, value TEXT, timestamps
```

### Default Settings Seeds
```
whatsapp_number   = 628975050520
hero_title        = Sprei Berkualitas untuk Tidur Lebih Nyaman
hero_subtitle     = Temukan koleksi sprei premium Jasmine dengan berbagai ukuran dan motif
hero_image        = (kosong)
store_name        = Jasmine Sprei
store_description = Toko sprei berkualitas dengan harga terjangkau
```

---

## API Endpoints

| Method | Endpoint | Query Params |
|--------|----------|-------------|
| GET | `/api/v1/products` | `category`, `featured`, `search`, `page` |
| GET | `/api/v1/products/{slug}` | — |
| GET | `/api/v1/categories` | — |
| GET | `/api/v1/settings/public` | — |

## Admin Routes (Inertia)

```
GET/POST  /admin/login          Auth/Login.tsx
POST      /admin/logout
GET       /admin/dashboard      Dashboard/Index.tsx
GET       /admin/products       Product/Index.tsx
GET       /admin/products/create  Product/Create.tsx
POST      /admin/products
GET       /admin/products/{id}/edit  Product/Edit.tsx
PUT       /admin/products/{id}
DELETE    /admin/products/{id}
PATCH     /admin/products/{id}/toggle
POST      /admin/products/{id}/images
DELETE    /admin/products/images/{imageId}
GET       /admin/categories     Category/Index.tsx
POST      /admin/categories
PUT       /admin/categories/{id}
DELETE    /admin/categories/{id}
GET       /admin/settings       Setting/Index.tsx
PUT       /admin/settings
```

---

## WhatsApp Template

```
Halo Kak Jasmine! 👋
Saya ingin memesan:

🛏️ *{nama_produk}*
📐 Ukuran: {label_varian}
💰 Harga: Rp {harga_final}

Mohon konfirmasi ketersediaan dan detail pengirimannya ya, terima kasih! 🙏
```

Format URL: `https://wa.me/628975050520?text=[URL-encoded]`

---

## Desain & Branding

| Item | Nilai |
|------|-------|
| Warna utama | Soft pink `#F9A8C9` + krem `#FDF6F0` |
| Warna CTA | Dusty rose `#D4748A` |
| Heading | Playfair Display |
| Body | Inter |

---

## Catatan Penting untuk Agent

1. Controller hanya panggil Use Case — TIDAK boleh ada logika bisnis di controller.
2. Eloquent Model HANYA di Infrastructure layer.
3. Domain Entity adalah pure PHP class — TIDAK extends apapun dari Laravel.
4. Semua binding Interface → Implementation di `AppServiceProvider`.
5. API response selalu lewat API Resource, bukan Eloquent langsung.
6. SvelteKit fetch via `+page.server.ts` load() function.
7. WA number di DB: key=`whatsapp_number`, value=`628975050520`.
8. Admin user default: email=`admin@jasminesprei.com`, password=`password` (ganti setelah deploy).

---

## Phase Checklist

### Phase 1: BE + Backoffice (CURRENT)
- [ ] Laravel project setup + packages
- [ ] DDD folder structure
- [ ] Database migrations + seeders
- [ ] Domain layer (Entities, Value Objects, Interfaces)
- [ ] Application layer (Use Cases, DTOs)
- [ ] Infrastructure layer (Eloquent Models, Repositories, Mappers)
- [ ] Admin auth (login/logout)
- [ ] Admin: Product CRUD + image upload + variants
- [ ] Admin: Category CRUD
- [ ] Admin: Settings (WA number, hero)
- [ ] API endpoints for SvelteKit
- [ ] Inertia React pages (Login, Dashboard, Products, Categories, Settings)

### Phase 2: FE Customer (NEXT)
- [ ] SvelteKit project setup
- [ ] Halaman beranda
- [ ] Katalog + filter kategori
- [ ] Detail produk + varian selector
- [ ] WhatsApp button integration
- [ ] Keranjang sementara
- [ ] SEO meta tags
- [ ] Deploy ke shared hosting
