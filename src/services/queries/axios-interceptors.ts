import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
/* eslint-disable @typescript-eslint/no-explicit-any */


const onRequest = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => { 
  const {headers = {}}= config;
  let authorization: any = {'Authorization': headers['Authorization']}
  
  const {url = ''} = config;
  const urlToCall =  url.replaceAll('/api/backoffice', '/items');
  authorization = { 'Authorization':`Bearer ${process.env.BACKOFFICE_API_TOKEN}`};

  const baseURL = process.env.BACKOFFICE_API;
  console.log('-----------------------')
  console.log({baseURL, urlToCall})
  console.log('-----------------------')
  return {
      ...config,
      baseURL,
      url: urlToCall,
      headers: {
        ...config.headers,
        ...(authorization)
      }
     
    };
}
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
}
const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
}

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest as any, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}