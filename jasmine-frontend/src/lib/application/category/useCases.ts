import type { CategoryRepository } from '$lib/domain/category/entity';

export class GetActiveCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute() {
    return this.categoryRepo.getActiveCategories();
  }
}
