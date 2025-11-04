import axios, { AxiosInstance, AxiosResponse } from "axios";

const service: AxiosInstance = axios.create({
  baseURL: "/api", // ✅ Spring Boot 后端地址
  timeout: 30000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 如果有 token，可以添加：
    // config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    console.error("❌ 请求出错：", error);

    return Promise.reject(error);
  },
);

export default service;
