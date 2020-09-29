import axios from 'axios';
import NProgress from 'nprogress';
import '@/assets/css/nprogress.css';

const instance = axios.create({
  baseURL: process.env.VUE_APP_PG_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  }
});

instance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      // originalRequest._retry = true;
      // store.dispatch('LOGOUT');
      // window.location = '/signin';
      console.log('error 401!');
      NProgress.done();
    }
    return Promise.reject(error);
  }
);

export default instance;
