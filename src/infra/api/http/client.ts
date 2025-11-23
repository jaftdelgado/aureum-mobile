import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@app/config/env';

export const client: AxiosInstance = axios.create({
  baseURL: ENV.ASSETS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  }
);
