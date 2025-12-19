import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { DeviceEventEmitter } from 'react-native';

/**
 * URL local del contenedor
 * Docker: -p 8076:3000
 */
const DEV_BASE_URL = 'http://localhost:8076';

export const AUTH_LOGOUT_EVENT = 'auth:logout';

export class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

const triggerServerDisconnect = () => {
  DeviceEventEmitter.emit('server-disconnect');
};

export const devClient: AxiosInstance = axios.create({
  baseURL: DEV_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

devClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      DeviceEventEmitter.emit(AUTH_LOGOUT_EVENT);
    }
    return Promise.reject(error);
  }
);

/**
 * HTTP CLIENT
 */
export class HttpClient {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  private buildConfig(
    params?: Record<string, string | string[]>,
    config?: AxiosRequestConfig
  ): AxiosRequestConfig {
    return {
      ...config,
      params,
    };
  }

  private async request<T>(
    method: AxiosRequestConfig['method'],
    url: string,
    options: {
      params?: Record<string, string | string[]>;
      data?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    try {
      const response = await this.instance.request<T>({
        method,
        url,
        data: options.data,
        params: options.params,
        headers: options.headers,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        const status = error.response.status;
        const message =
          (error.response.data as any)?.detail ||
          (error.response.data as any)?.message ||
          error.message ||
          `Error HTTP ${status}`;

        if (status >= 500) {
          triggerServerDisconnect();
          throw new HttpError(status, 'Server Unavailable');
        }

        throw new HttpError(status, message);
      }

      console.error('[HttpClientDev] Network error:', error.message);
      triggerServerDisconnect();
      throw new HttpError(0, 'Network Error');
    }
  }

  get<T>(url: string, params?: Record<string, string | string[]>) {
    return this.request<T>('GET', url, { params });
  }

  post<T>(url: string, data?: any) {
    return this.request<T>('POST', url, { data });
  }

  put<T>(url: string, data?: any) {
    return this.request<T>('PUT', url, { data });
  }

  patch<T>(url: string, data?: any) {
    return this.request<T>('PATCH', url, { data });
  }

  delete<T>(url: string) {
    return this.request<T>('DELETE', url);
  }

  async getBlob(url: string): Promise<Blob> {
    try {
      const response = await this.instance.get(url, {
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (err) {
      const error = err as AxiosError;
      throw new HttpError(error.response?.status || 0, 'Error downloading blob');
    }
  }
}

export const httpClient = new HttpClient(devClient);
