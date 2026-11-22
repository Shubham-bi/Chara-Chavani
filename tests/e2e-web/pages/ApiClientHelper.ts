/**
 * ApiClientHelper: Direct HTTP client wrapping the ASP.NET Core WebAPI
 * endpoints for fast API-level verification and test fixtures.
 */
export class ApiClientHelper {
  readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getHealth(): Promise<{ status: string; service: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/health`);
    if (!res.ok) throw new Error(`Health check failed with HTTP ${res.status}`);
    const json = await res.json();
    return json.data || json;
  }

  async getDistricts(): Promise<Array<{ id: number; name: string }>> {
    const res = await fetch(`${this.baseUrl}/api/v1/master/districts`);
    const json = await res.json();
    return json.data || [];
  }

  async getCamps(): Promise<Array<{ id: number; campCode: string; name: string; capacity: number }>> {
    const res = await fetch(`${this.baseUrl}/api/v1/camps`);
    const json = await res.json();
    return json.data || [];
  }

  async checkGeofence(campId: number, lat: number, lon: number): Promise<{ isInside: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/camps/${campId}/validate-point?latitude=${lat}&longitude=${lon}`);
    const json = await res.json();
    return {
      isInside: json.data?.isInside ?? false,
      message: json.data?.message ?? json.message ?? '',
    };
  }

  async requestFarmerOtp(mobileNumber: string): Promise<{ success: boolean; devOtp?: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/mobile/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, role: 'Farmer' }),
    });
    const json = await res.json();
    return {
      success: json.success ?? false,
      devOtp: '123456',
    };
  }

  async verifyFarmerOtp(mobileNumber: string, otp: string = '123456'): Promise<{ success: boolean; token?: string; role?: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/mobile/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, otp, role: 'Farmer' }),
    });
    const json = await res.json();
    return {
      success: json.success ?? false,
      token: json.data?.token,
      role: json.data?.role,
    };
  }

  async getGeographicDistribution(level: string = 'District', metric: string = 'camps'): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/admin/geographic-distribution?level=${level}&metric=${metric}`);
    const json = await res.json();
    return json.data;
  }

  async getCampsMapFeatures(): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/admin/camps-map`);
    const json = await res.json();
    return json.data || [];
  }

  async getSectionAnalytics(section: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/admin/analytics/${section}`);
    const json = await res.json();
    return json.data;
  }
}
