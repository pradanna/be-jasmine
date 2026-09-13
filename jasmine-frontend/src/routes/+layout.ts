import type { LayoutLoad } from './$types';
import { categoryRepository } from '$lib/infrastructure/repositories/categoryRepository';
import { settingRepository } from '$lib/infrastructure/repositories/settingRepository';

export const prerender = false;

export const load: LayoutLoad = async () => {
  const [categories, settings] = await Promise.all([
    categoryRepository.getActiveCategories(),
    settingRepository.getPublicSettings()
  ]);

  return {
    categories,
    settings
  };
};
