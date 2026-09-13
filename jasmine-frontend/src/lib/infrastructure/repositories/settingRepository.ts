import type { StoreSettings, SettingRepository } from '$lib/domain/setting/entity';
import { httpClient, type HttpClient } from '$lib/infrastructure/api/client';

export class ApiSettingRepository implements SettingRepository {
  constructor(private client: HttpClient = httpClient) {}

  async getPublicSettings(): Promise<StoreSettings> {
    try {
      const res = await this.client.get<{ data: StoreSettings }>('/settings/public');
      return res.data;
    } catch (e) {
      console.error('Failed to fetch public settings, fallback to defaults:', e);
      return {
        whatsapp_number: '628975050520',
        store_name: 'Jasmine Sprei',
        store_description: 'Toko sprei berkualitas dengan harga terjangkau',
        hero_title: 'Sprei Berkualitas untuk Tidur Lebih Nyaman',
        hero_subtitle: 'Temukan koleksi sprei premium Jasmine dengan berbagai ukuran dan motif',
      };
    }
  }
}

export const settingRepository = new ApiSettingRepository();
