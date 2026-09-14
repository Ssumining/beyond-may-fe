import type { PreferenceType } from "@/types/preference";

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
 * 성향 검사 점수 4개는 전부 선택값 — 함께 보내면 서버가 preferenceType을 계산
 * 응답에 담아주고, 생략하면 preferenceType은 null이 된다.
 * 비로그인 설문 완료 후 닉네임 등록 시 클라에서 계산한 점수를 함께 전송.
 */
export interface SignupRequest {
  nickname: string;
  thinkerScore?: number;
  foodieScore?: number;
  artistScore?: number;
  remembererScore?: number;
}

export interface SignupResponse {
  userId: number;
  nickname: string;
  /** 서버가 발급한 식별코드 (1~99) */
  identificationCode: number;
  preferenceType: PreferenceType | null;
  token: string;
}
