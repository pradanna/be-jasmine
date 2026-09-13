export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryRepository {
  getActiveCategories(): Promise<Category[]>;
}
