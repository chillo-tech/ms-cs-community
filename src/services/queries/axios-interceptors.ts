import { initEnv } from '@utils/initEnvIronementVariables';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
initEnv();

const onRequest = async (
  config: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  const { headers = {} } = config;
  let authorization: any = { Authorization: headers['Authorization'] };

  const { url = '' } = config;
  const baseURL = url.includes('/api/backoffice')
    ? process.env.BACKOFFICE_API
    : url.includes('/api/contacts')
    ? process.env.DIRECTUS_API_URI
    : '';
  const urlToCall = url
    .replaceAll('/api/backoffice', '/items')
    .replaceAll('/api/contacts', '/items');
  authorization = {
    Authorization: `Bearer ${
      url.includes('/api/backoffice')
        ? process.env.BACKOFFICE_API_TOKEN
        : process.env.DIRECTUS_API_KEY
    }`,
  };

  return {
    ...config,
    baseURL,
    url: urlToCall,
    headers: {
      ...config.headers,
      ...authorization,
    },
  };
};
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};
const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest as any, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
