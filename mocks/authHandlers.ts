import { http, HttpResponse, delay } from "msw";

import type { LoginRequest, LoginResponse } from "@/types/user";

/**
 * 로그인(닉네임+식별코드) mock.
 * "김감자" / 7 조합만 성공, 그 외에는 401 에러로 실패 케이스를 재현한다.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const VALID_NICKNAME = "김감자";
const VALID_CODE = 7;

export const authHandlers = [
  http.post(`${BASE_URL}/api/v1/users/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as LoginRequest;

    if (
      body.nickname !== VALID_NICKNAME ||
      body.identificationCode !== VALID_CODE
    ) {
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
