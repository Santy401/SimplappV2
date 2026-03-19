// ─────────────────────────────────────────────
//  ApiClient
// ─────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 15_000;

// ── Tipos ────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
    public readonly endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class SessionExpiredError extends Error {
  constructor(public readonly endpoint: string) {
    super('Session expired');
    this.name = 'SessionExpiredError';
  }
}

interface RequestOptions extends RequestInit {
  /** Si es true, no se envían cookies (útil para requests a terceros). */
  withoutCredentials?: boolean;
  /** Override del timeout en ms para esta petición específica. */
  timeoutMs?: number;
}

// ── Helpers ───────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number, endpoint: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new ApiError(`Request timed out after ${ms}ms`, 408, null, endpoint)),
        ms
      )
    ),
  ]);
}

// ── Clase principal ───────────────────────────

class ApiClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: HeadersInit;

  // Estado del refresh — se comparte entre peticiones concurrentes
  private isRefreshing = false;
  // Cola de callbacks que esperan el resultado del refresh en curso
  private refreshQueue: Array<(success: boolean) => void> = [];

  /**
   * Endpoints de auth: nunca disparan refresh automático ni
   * el evento session:expired. Se agregan aquí también las
   * rutas públicas donde un 401 no debe hacer nada especial.
   */
  private readonly SKIP_REFRESH_ENDPOINTS = new Set([
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email',
    '/api/auth/session',
  ]);

  constructor() {
    this.baseURL =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || '';

    this.defaultHeaders = { 'Content-Type': 'application/json' };
  }

  // ── Internals ───────────────────────────────

  private shouldSkipRefresh(endpoint: string): boolean {
    return [...this.SKIP_REFRESH_ENDPOINTS].some((p) => endpoint.includes(p));
  }

  /**
   * Refresca el token exactamente UNA vez aunque lleguen N peticiones
   * simultáneas con 401. Las demás esperan en la cola y reciben el
   * mismo resultado sin hacer un fetch extra.
   */
  private refreshToken(): Promise<boolean> {
    // Si ya hay un refresh en curso, ponemos esta petición en la cola
    if (this.isRefreshing) {
      return new Promise<boolean>((resolve) => {
        this.refreshQueue.push(resolve);
      });
    }

    this.isRefreshing = true;

    return fetch(`${this.baseURL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.ok)
      .catch(() => false)
      .then((success) => {
        // Notificamos a todos los que estaban esperando
        this.refreshQueue.forEach((resolve) => resolve(success));
        this.refreshQueue = [];
        this.isRefreshing = false;
        return success;
      });
  }

  private dispatchSessionExpired(): void {
    if (typeof window === 'undefined') return;

    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isPublicPage = publicPaths.some((p) =>
      window.location.pathname.startsWith(p)
    );

    if (!isPublicPage) {
      window.dispatchEvent(new CustomEvent('session:expired'));
    }
  }

  // ── Core request ────────────────────────────

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    isRetry = false
  ): Promise<T> {
    const { withoutCredentials, timeoutMs, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    const skipRefresh = this.shouldSkipRefresh(endpoint);
    const timeout = timeoutMs ?? REQUEST_TIMEOUT_MS;

    const config: RequestInit = {
      ...fetchOptions,
      credentials: withoutCredentials ? 'omit' : 'include',
      headers: {
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      },
    };

    let response: Response;

    try {
      response = await withTimeout(fetch(url, config), timeout, endpoint);
    } catch (err: any) {
      // Re-lanzamos ApiError de timeout tal cual; el resto lo envolvemos
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err?.message ?? 'Network error',
        0,
        null,
        endpoint
      );
    }

    // ── 401 ──────────────────────────────────
    if (response.status === 401) {
      if (skipRefresh) {
        // Login incorrecto, contraseña mal, etc. — falla directo
        const data = await response.json().catch(() => ({}));
        throw new ApiError(
          (data as any)?.error ?? 'Authentication failed',
          401,
          data,
          endpoint
        );
      }

      if (!isRetry) {
        const success = await this.refreshToken();
        if (success) {
          // Reintentamos con isRetry=true para no entrar en loop infinito
          return this.request<T>(endpoint, options, true);
        }
      }

      // Refresh falló o ya era el segundo intento → sesión muerta
      this.dispatchSessionExpired();
      throw new SessionExpiredError(endpoint);
    }

    // ── Otros errores HTTP ────────────────────
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiError(
        (data as any)?.error ?? `HTTP Error ${response.status}`,
        response.status,
        data,
        endpoint
      );
    }

    // ── Éxito ─────────────────────────────────
    if (response.status === 204) return undefined as unknown as T;
    return response.json() as Promise<T>;
  }

  // ── Métodos públicos ─────────────────────────

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }
}

// ── Singleton (solo cliente) ──────────────────
//
// En Next.js App Router, los Server Components y Route Handlers
// deben crear su propia instancia para evitar compartir estado
// entre requests de distintos usuarios en el servidor.
//
// Uso en server-side:  const client = new ApiClient();
// Uso en client-side:  import { apiClient } from '...'

export { ApiClient };
export const apiClient = new ApiClient();