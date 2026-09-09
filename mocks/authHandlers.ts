import { http, HttpResponse, delay } from "msw";

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/user";

/**
 * 회원가입·로그인(닉네임+식별코드) mock.
 * 회원가입으로 실제 발급된 닉네임/코드를 기억해뒀다가 로그인 시 그걸로 검증한다.
 * 회원가입 없이 바로 로그인을 테스트하고 싶을 때를 위해 "김감자" / 7 조합도 항상 허용.
 * 그 외 조합은 401 에러로 실패 케이스를 재현한다.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const VALID_NICKNAME = "김감자";
const VALID_CODE = 7;

/**
 * 가장 최근 회원가입으로 등록된 사용자 — localStorage에 저장해 새로고침해도 유지한다.
 * (accessToken·session-storage와 별개 키라 로그아웃해도 이 기록은 남는다 — 실제 계정처럼
 * 로그아웃 후 재로그인 테스트가 가능해야 하므로)
 */
const REGISTERED_USER_KEY = "mock-registered-user";

interface RegisteredUser {
  nickname: string;
  identificationCode: number;
}

const getRegisteredUser = (): RegisteredUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REGISTERED_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RegisteredUser;
  } catch {
    return null;
  }
};

const setRegisteredUser = (user: RegisteredUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(user));
};

export const authHandlers = [
  http.post(`${BASE_URL}/api/v1/users/sign-up`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as SignupRequest;

    const data: SignupResponse = {
      userId: Math.floor(Math.random() * 1000),
      nickname: body.nickname,
      identificationCode: Math.floor(Math.random() * 99) + 1,
      preferenceType: null,
      token: "mock-access-token",
    };
    setRegisteredUser({
      nickname: data.nickname,
      identificationCode: data.identificationCode,
    });

    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data,
      success: true,
    });
  }),

  http.post(`${BASE_URL}/api/v1/users/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as LoginRequest;

    const registeredUser = getRegisteredUser();
    const isFixedTestAccount =
      body.nickname === VALID_NICKNAME &&
      body.identificationCode === VALID_CODE;
    const isRegisteredUser =
      registeredUser !== null &&
      body.nickname === registeredUser.nickname &&
      body.identificationCode === registeredUser.identificationCode;

    if (!isFixedTestAccount && !isRegisteredUser) {
      return HttpResponse.json(
        {
          message: "닉네임 또는 식별코드가 올바르지 않아요.",
          code: "USER401",
          data: null,
          success: false,
        },
        { status: 401 },
      );
    }

    const data: LoginResponse = {
      userId: 1,
      nickname: body.nickname,
      token: "mock-access-token",
    };

    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data,
      success: true,
    });
  }),

  http.post(`${BASE_URL}/api/v1/users/logout`, async () => {
    await delay(200);
    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data: null,
      success: true,
    });
  }),
];
