import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { DeviceEventEmitter } from 'react-native';
import { supabase } from '../../external/supabase';

const GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

export const AUTH_LOGOUT_EVENT = 'auth:logout';

interface ApiErrorResponse {
  detail?: string | Record<string, unknown>; 
  message?: string;
}

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

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { data, error } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (error || !token) {
      return Promise.reject(new HttpError(401, 'No session active'));
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      DeviceEventEmitter.emit(AUTH_LOGOUT_EVENT);
    }
    return Promise.reject(error);
  }
);

export class HttpClient {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  private async request<T>(
    method: AxiosRequestConfig['method'],
    url: string,
    options: {
      params?: Record<string, string | string[]>;
      data?: unknown; 
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
      const error = err as AxiosError<ApiErrorResponse>; 

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        let rawMessage: string | Record<string, unknown> | undefined = 
          errorData?.detail || 
          errorData?.message || 
          error.message;

        if (typeof rawMessage === 'object') {
          try {
            rawMessage = JSON.stringify(rawMessage);
          } catch {
            rawMessage = "Error de validación desconocido";
          }
        }

        const message = String(rawMessage || `Error HTTP ${status}`);

        if (status >= 500) {
          triggerServerDisconnect();
          throw new HttpError(status, 'Servidor no disponible');
        }

        throw new HttpError(status, message);
      }

      console.error('[HttpClient] Network error:', error.message);
      triggerServerDisconnect();
      throw new HttpError(0, 'Error de conexión');
    }
  }

  get<T>(url: string, params?: Record<string, string | string[]>) {
    return this.request<T>('GET', url, { params });
  }

  post<T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }) {
    return this.request<T>('POST', url, { 
      data, 
      headers: config?.headers 
    });
  }

  put<T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }) {
    return this.request<T>('PUT', url, { 
      data, 
      headers: config?.headers 
    });
  }

  patch<T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }) {
    return this.request<T>('PATCH', url, { 
      data, 
      headers: config?.headers 
    });
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
      throw new HttpError(error.response?.status || 0, 'Error descargando archivo');
    }
  }
}

export const httpClient = new HttpClient(axiosInstance);