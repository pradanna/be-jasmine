import type { ProductSummary, ProductDetail, ProductFilters, PaginatedResult } from './entity';

export interface ProductRepository {
  getProducts(filters?: ProductFilters): Promise<PaginatedResult<ProductSummary>>;
  getProductBySlug(slug: string): Promise<ProductDetail | null>;
}
