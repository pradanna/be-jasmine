export type StockStatus = 'available' | 'out_of_stock' | 'pre_order';

export interface ProductImage {
  id: number;
  url?: string;
  path?: string;
  is_primary: boolean;
  order?: number;
}

export interface ProductVariant {
  id: number;
  label: string;
  price?: number;
  final_price?: number;
  price_modifier?: number;
  is_active?: boolean;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  base_price_formatted: string;
  stock_status: StockStatus;
  stock_status_label: string;
  is_featured: boolean;
  primary_image: string | null;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  preorder_days?: number;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
