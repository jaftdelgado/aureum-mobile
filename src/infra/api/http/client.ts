import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { DeviceEventEmitter } from 'react-native'; 
import { supabase } from '../../external/supabase'; 

const GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

export const AUTH_LOGOUT_EVENT = 'auth:logout';

export const client: AxiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (error || !token) {
         return Promise.reject(new Error("No hay sesión activa. Petición cancelada."));
      }

      config.headers.Authorization = `Bearer ${token}`;
      
    } catch (err) {
      return Promise.reject(err);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Sesión caducada (401). Emitiendo señal de logout...');
      
      DeviceEventEmitter.emit(AUTH_LOGOUT_EVENT);
    }
    return Promise.reject(error);
  }
);