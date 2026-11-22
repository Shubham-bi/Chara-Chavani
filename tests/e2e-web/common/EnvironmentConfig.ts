/**
 * EnvironmentConfig: Centralized configuration for URLs, API endpoints,
 * test credentials, timeouts, and environmental flags.
 */
export const EnvironmentConfig = {
  webAdminUrl: process.env.WEB_ADMIN_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  defaultTimeoutMs: 30000,
  actionTimeoutMs: 10000,
  apiTimeoutMs: 15000,

  credentials: {
    admin: {
      username: process.env.ADMIN_USER || 'admin',
      password: process.env.ADMIN_PASSWORD || 'AdminPassword@123',
    },
    farmer: {
      mobile: '9822012345',
      devOtp: '123456',
    },
    vet: {
      mobile: '9822099999',
      devOtp: '123456',
    },
    operator: {
      mobile: '9822114455',
      devOtp: '123456',
    },
  },

  endpoints: {
    health: '/api/v1/health',
    districts: '/api/v1/master/districts',
    talukas: (districtId: number) => `/api/v1/master/talukas/${districtId}`,
    breeds: '/api/v1/master/breeds',
    fodderTypes: '/api/v1/master/fodder-types',
    camps: '/api/v1/camps',
    campValidatePoint: (campId: number, lat: number, lon: number) =>
      `/api/v1/camps/${campId}/validate-point?latitude=${lat}&longitude=${lon}`,
    dashboardKpis: '/api/v1/admin/dashboard',
    geographicDistribution: '/api/v1/admin/geographic-distribution',
    exportAdmissions: '/api/v1/admin/reports/admissions/export',
    exportFodder: '/api/v1/admin/reports/fodder/export',
    exportExpenses: '/api/v1/admin/reports/expenses/export',
    exportInspections: '/api/v1/admin/reports/inspections/export',
    sendOtp: '/api/v1/auth/mobile/send-otp',
    verifyOtp: '/api/v1/auth/mobile/verify-otp',
  },
};
