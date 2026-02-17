class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async refreshToken(): Promise<boolean> {
    // Si ya hay un refresh en progreso, esperar a que termine
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Token refresh failed:', response.status);
          return false;
        }

        console.log('Token refreshed successfully');
        return true;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private dispatchSessionExpired() {
    if (typeof window !== 'undefined') {
      console.warn('Session expired - dispatching event');
      window.dispatchEvent(new CustomEvent('session:expired'));
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      credentials: 'include', // Importante para enviar cookies
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Si es 401 y no es el endpoint de refresh, intentar refrescar el token
      if (response.status === 401 && !endpoint.includes('/auth/refresh') && retryCount === 0) {
        console.log('Received 401, attempting token refresh...');

        const refreshSuccess = await this.refreshToken();

        if (refreshSuccess) {
          // Reintentar la petición original
          console.log('Retrying original request after token refresh');
          return this.request<T>(endpoint, options, retryCount + 1);
        } else {
          // Si el refresh falló, la sesión expiró definitivamente
          this.dispatchSessionExpired();
          throw new Error('Session expired');
        }
      }

      // Si es 401 después del retry, la sesión expiró
      if (response.status === 401 && retryCount > 0) {
        this.dispatchSessionExpired();
        throw new Error('Session expired');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

export const apiClient = new ApiClient();