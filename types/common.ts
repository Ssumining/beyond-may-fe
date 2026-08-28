// 백엔드 공통 응답 래퍼 — 모든 API 응답이 이 형태로 도착

/* 성공/에러 공통 응답 래퍼. code는 "COMMON200"·"USER401" 같은 문자열 코드,
   성공 여부 판별은 code가 아니라 success로 한다 */
export interface ApiResponse<T> {
  message: string;
  code: string;
  data: T | null;
  success: boolean;
}
