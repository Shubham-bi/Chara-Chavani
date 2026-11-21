import { CharaChhavaniApiClient } from '@chara-chhavani/api-client';

export const CONFIG = {
  API_BASE_URL: 'http://localhost:5000',
  APP_NAME: 'Chara Chhavani - Admin Officer Web Dashboard',
  VERSION: '1.0.0',
};

export const apiClient = new CharaChhavaniApiClient(CONFIG.API_BASE_URL);
