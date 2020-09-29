import axios from 'axios';
import NProgress from 'nprogress';
import '@/assets/css/nprogress.css';
import { StorageService } from '@/services/storage.service';

const ApiService = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    axios.interceptors.request.use((config) => {
      NProgress.start();
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        NProgress.done();
        return response;
      },
      (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          console.log('error 401!');
        }
        NProgress.done();
        return Promise.reject(error);
      }
    );
  },

  setHeaders() {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${StorageService.getToken()}`;
    axios.defaults.headers.common['Prefer'] = 'return=representation';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  },

  removeHeaders() {
    axios.defaults.headers.common = {};
    axios.defaults.headers.post = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  }
};

export default ApiService;
