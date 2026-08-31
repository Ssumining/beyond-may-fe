/** 닉네임 + 식별코드로 이전 세션에 로그인 (POST /api/v1/users/login) */
export interface LoginRequest {
  nickname: string;
  /** 서버가 발급한 식별코드 (1~99) */
  identificationCode: number;
}

export interface LoginResponse {
  userId: number;
  nickname: string;
  token: string;
}
