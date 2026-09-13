import type { Category, CategoryRepository } from '$lib/domain/category/entity';
import { httpClient, type HttpClient } from '$lib/infrastructure/api/client';

export class ApiCategoryRepository implements CategoryRepository {
  constructor(private client: HttpClient = httpClient) {}

  async getActiveCategories(): Promise<Category[]> {
    try {
      const res = await this.client.get<{ data: Category[] }>('/categories');
      return res.data;
    } catch (e) {
      console.error('Failed to fetch categories:', e);
      return [];
    }
  }
}

export const categoryRepository = new ApiCategoryRepository();
