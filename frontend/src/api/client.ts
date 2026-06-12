import axios from "axios";
import type { ApiResult } from "@/types/index";

const client = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 请求拦截：附加 JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：401/403 → 清除旧 token 跳登录
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/** 是否有已登录 token */
export function hasToken(): boolean {
  return !!localStorage.getItem("token");
}

/** 提取 data 字段 */
export async function getData<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await client.get<ApiResult<T>>(url, { params });
  return res.data.data;
}

/** POST 提取 data */
export async function postData<T>(url: string, body?: unknown): Promise<T> {
  const res = await client.post<ApiResult<T>>(url, body);
  return res.data.data;
}

/** PUT 提取 data */
export async function putData<T>(url: string, body?: unknown): Promise<T> {
  const res = await client.put<ApiResult<T>>(url, body);
  return res.data.data;
}

/** DELETE 提取 data */
export async function deleteData(url: string): Promise<void> {
  await client.delete(url);
}

export default client;
