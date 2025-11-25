import axios from "axios";
import { getToken, removeToken } from "./auth";

export interface ResponseData<T = undefined> {
  ok: Boolean;
  msg: string;
  data?: T;
  error?: string;
}

const request = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  timeout: 5000,
});

// 请求前自动附带 token
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 响应错误统一处理
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default request;
