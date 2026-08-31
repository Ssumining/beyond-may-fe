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

/**
 * 회원가입 (POST /api/v1/users/sign-up) — 실질적인 "세션 생성" API.
 * 성향 검사 점수 4개는 전부 선택값 — 생략하면 preferenceType은 null.
 * 이번 이슈(닉네임/세션 등록)에서는 닉네임만 보낸다.
 */
export interface SignupRequest {
  nickname: string;
}

export interface SignupResponse {
  userId: number;
  nickname: string;
  /** 서버가 발급한 식별코드 (1~99) */
  identificationCode: number;
  // TODO(백엔드 확인): 실제 값은 THINKER/FOODIE/ARTIST/REMEMBERER(대문자)로 내려옴.
  //   팀 전체 4유형 값 통일 논의 후 값 형식 맞출 예정, 우선 string으로 둠.
  preferenceType: string | null;
  token: string;
}
