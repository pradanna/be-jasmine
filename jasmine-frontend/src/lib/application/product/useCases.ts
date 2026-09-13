import type { ProductRepository } from '$lib/domain/product/repository';
import type { ProductFilters } from '$lib/domain/product/entity';

export class GetProductCatalogUseCase {
  constructor(private productRepo: ProductRepository) {}

  async execute(filters?: ProductFilters) {
    return this.productRepo.getProducts(filters);
  }
}

export class GetFeaturedProductsUseCase {
  constructor(private productRepo: ProductRepository) {}

  async execute() {
    return this.productRepo.getProducts({ featured: true, page: 1 });
  }
}

export class GetProductDetailUseCase {
  constructor(private productRepo: ProductRepository) {}

  async execute(slug: string) {
    return this.productRepo.getProductBySlug(slug);
  }
}
