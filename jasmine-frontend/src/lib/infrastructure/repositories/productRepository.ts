import type { ProductRepository } from '$lib/domain/product/repository';
import type { ProductSummary, ProductDetail, ProductFilters, PaginatedResult } from '$lib/domain/product/entity';
import { httpClient, type HttpClient } from '$lib/infrastructure/api/client';

export class ApiProductRepository implements ProductRepository {
  constructor(private client: HttpClient = httpClient) {}

  async getProducts(filters?: ProductFilters): Promise<PaginatedResult<ProductSummary>> {
    const res = await this.client.get<{ data: ProductSummary[]; meta: PaginatedResult<ProductSummary>['meta'] }>(
      '/products',
      {
        category: filters?.categorySlug,
        search: filters?.search,
        featured: filters?.featured ? 1 : undefined,
        page: filters?.page,
        per_page: filters?.perPage,
      }
    );

    return {
      data: res.data,
      meta: res.meta,
    };
  }

  async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    try {
      const res = await this.client.get<{ data: ProductDetail }>(`/products/${slug}`);
      return res.data;
    } catch (e) {
      console.error(`Failed to fetch product ${slug}:`, e);
      return null;
    }
  }
}

export const productRepository = new ApiProductRepository();
