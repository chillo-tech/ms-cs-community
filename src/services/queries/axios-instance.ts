import axios from 'axios';
// import http from 'http';
import { setupInterceptorsTo } from './axios-interceptors';
// const agent = new http.Agent({ family: 4 });

const instance = axios.create();

//instance.defaults.headers.common['Authorization'] = `Bearer ${process.env.BACKOFFICE_API_TOKEN}`;
instance.defaults.headers.common['Accept'] = 'application/json';
const axiosInstance = setupInterceptorsTo(instance);

export { axiosInstance };
