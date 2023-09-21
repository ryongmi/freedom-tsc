import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const createAxiosInstance = (contentType: string): AxiosInstance => {
  const config: AxiosRequestConfig = {
    // baseURL: 'http://localhost:8000/api',
    baseURL: 'http://192.168.0.5:8000/api',
    withCredentials: true,
    headers: {
      'Content-Type': contentType,
    },
  };

  const instance: AxiosInstance = axios.create(config);

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance: AxiosInstance = createAxiosInstance('application/json');
export const formInstance: AxiosInstance = createAxiosInstance('multipart/form-data');
