import type { PageLoad } from './$types';
import { productRepository } from '$lib/infrastructure/repositories/productRepository';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
  const product = await productRepository.getProductBySlug(params.slug);

  if (!product) {
    throw error(404, 'Produk tidak ditemukan');
  }

  return {
    product,
  };
};
