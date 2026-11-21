import { CharaChhavaniApiClient } from '@chara-chhavani/api-client';

export const CONFIG = {
  API_BASE_URL: 'http://10.0.2.2:5000', // Default Android emulator localhost mapping
  APP_NAME: 'Chara Chhavani - Farmer App',
  VERSION: '1.0.0',
};

export const apiClient = new CharaChhavaniApiClient(CONFIG.API_BASE_URL);
