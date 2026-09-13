import type { PageLoad } from './$types';
import { productRepository } from '$lib/infrastructure/repositories/productRepository';

export const prerender = false;

export const load: PageLoad = async ({ url }) => {
  const categorySlug = url.searchParams.get('kategori') || undefined;
  const search = url.searchParams.get('cari') || undefined;
  const page = Number(url.searchParams.get('page')) || 1;

  const result = await productRepository.getProducts({
    categorySlug,
    search,
    page,
  });

  return {
    products: result.data,
    meta: result.meta,
    selectedCategory: categorySlug,
    searchQuery: search,
  };
};
