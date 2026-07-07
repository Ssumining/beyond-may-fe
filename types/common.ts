// 백엔드 공통 응답 래퍼 — 모든 API 응답이 이 형태로 도착

/* 성공/에러 공통 응답 래퍼 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}
