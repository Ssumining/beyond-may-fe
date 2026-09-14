import axios from "axios";
import type { AxiosInstance } from "axios";
import type { ApiResponse } from "@/types/common";
import { API_ENDPOINTS } from "@/services/constant/endpoint";

/**
 * 로그인 실패("닉네임/식별코드가 올바르지 않음")도 401로 내려오는데, 이건 세션 만료가
 * 아니라 그냥 잘못된 입력값이다. 각 폼이 인라인 에러로 보여주므로 전역 처리에서 제외한다.
 */
const AUTH_ATTEMPT_PATHS: string[] = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.signup,
];

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

api.interceptors.response.use(
  (response) => {
    const body = response.data;
    // 공통 실패 처리: success가 false면 throw (판단은 success 필드로 — 팀 합의)
    if (body && body.success === false) {
      throw new Error(body.message ?? "요청에 실패했습니다.");
    }
    return body;
  },
  (error) => {
    const isAuthAttempt = AUTH_ATTEMPT_PATHS.some((path) =>
      error.config?.url?.includes(path),
    );
    if (error.response?.status === 401 && !isAuthAttempt) {
      // 인증 만료/무효 — 세션 정리 후 로그인 유도 (refresh API 없음)
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("session-storage");
        window.location.assign("/?session=expired");
      }
    }
    return Promise.reject(error);
  },
);
