/** 닉네임 + 식별코드로 이전 세션에 로그인 */
export interface LoginRequest {
  nickname: string;
  // TODO(백엔드 확인): 필드명·형식 미확정, 우선 문자열로 가정
  identificationCode: string;
}

export interface LoginResponse {
  accessToken: string;
  nickname: string;
  // TODO(백엔드 확인): 성향 타입 등 프로필 관련 필드 추가될 수 있음
}
