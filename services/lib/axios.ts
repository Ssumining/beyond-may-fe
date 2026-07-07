import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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
