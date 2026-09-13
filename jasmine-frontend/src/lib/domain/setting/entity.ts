export interface StoreSettings {
  whatsapp_number: string;
  store_name: string;
  store_description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image?: string;
}

export interface SettingRepository {
  getPublicSettings(): Promise<StoreSettings>;
}
