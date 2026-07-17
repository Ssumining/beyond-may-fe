import axios from "axios";
import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@/types/common";

// 인터셉터가 response.data(공통 래퍼)를 반환하므로,
// get/post 등이 ApiResponse<T>를 직접 반환하도록 타입을 재정의
interface ApiInstance extends Omit<
  AxiosInstance,
  "get" | "post" | "put" | "patch" | "delete"
> {
  get<T>(
    url: string,
    config?: Parameters<AxiosInstance["get"]>[1],
  ): Promise<ApiResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: Parameters<AxiosInstance["post"]>[2],
  ): Promise<ApiResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: Parameters<AxiosInstance["put"]>[2],
  ): Promise<ApiResponse<T>>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: Parameters<AxiosInstance["patch"]>[2],
  ): Promise<ApiResponse<T>>;
  delete<T>(
    url: string,
    config?: Parameters<AxiosInstance["delete"]>[1],
  ): Promise<ApiResponse<T>>;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
}) as ApiInstance;

// 요청 인터셉터: 세션 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 공통 래퍼 { code, data, message }까지만 반환
api.interceptors.response.use(
  (response) => response.data, // ← 여기까지만. 알맹이(data.data)는 각 API 함수에서 꺼냄
  (error) => {
    if (error.response?.status === 401) {
      // TODO: 백엔드 인증 방식 확정 후 처리
    }
    return Promise.reject(error);
  },
);
