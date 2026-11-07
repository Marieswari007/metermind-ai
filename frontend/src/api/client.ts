export const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = null;
  private baseUrl: string = DEFAULT_API_BASE;
  private isMockMode: boolean = false;

  constructor() {
    this.token = localStorage.getItem('metermind_token');
    const storedBase = localStorage.getItem('metermind_api_url');
    if (storedBase) {
      this.baseUrl = storedBase;
    }
    const mock = localStorage.getItem('metermind_mock_mode');
    this.isMockMode = mock === 'true';
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('metermind_token', token);
    } else {
      localStorage.removeItem('metermind_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
    localStorage.setItem('metermind_api_url', this.baseUrl);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setMockMode(enabled: boolean) {
    this.isMockMode = enabled;
    localStorage.setItem('metermind_mock_mode', String(enabled));
  }

  public getMockMode(): boolean {
    return this.isMockMode;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Default to JSON body if object provided and Content-Type not explicitly set
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData && errData.detail) {
            errorMessage = typeof errData.detail === 'string' 
              ? errData.detail 
              : JSON.stringify(errData.detail);
          } else if (errData && errData.message) {
            errorMessage = errData.message;
          }
        } catch {
          // not json response
        }

        if (response.status === 401) {
          // Notify or clear token
          this.setToken(null);
        }

        throw new Error(errorMessage);
      }

      // If empty response
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : ({} as T);
    } catch (error: any) {
      // Re-throw with clear message
      throw error;
    }
  }

  public async checkBackendHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/docs`, { method: 'HEAD', signal: controller.signal });
      clearTimeout(id);
      return res.status >= 200 && res.status < 400;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();
