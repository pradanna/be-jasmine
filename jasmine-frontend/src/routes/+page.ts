import type { PageLoad } from './$types';
import { productRepository } from '$lib/infrastructure/repositories/productRepository';

export const prerender = false;

export const load: PageLoad = async () => {
  const [featuredResult, heroResult] = await Promise.all([
    productRepository.getProducts({ featured: true, page: 1 }),
    productRepository.getProducts({ page: 1, perPage: 24 }),
  ]);

  // Filter produk yang memiliki foto asli valid untuk hero carousel
  const heroProducts = heroResult.data.filter((p) => Boolean(p.primary_image));

  return {
    featuredProducts: featuredResult.data,
    heroProducts: heroProducts.length > 0 ? heroProducts : featuredResult.data,
  };
};
