import { http, HttpResponse, delay } from "msw";

import type { LoginRequest, LoginResponse } from "@/types/user";

/**
 * 로그인(닉네임+식별코드) mock.
 * "김감자" / "AB1234" 조합만 성공, 그 외에는 400 에러로 실패 케이스를 재현한다.
 *
 * TODO: 백엔드 응답 확정 후 실제 값으로 교체. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const VALID_NICKNAME = "김감자";
const VALID_CODE = "AB1234";

export const authHandlers = [
  http.post(`${BASE_URL}/api/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as LoginRequest;

    if (
      body.nickname !== VALID_NICKNAME ||
      body.identificationCode !== VALID_CODE
    ) {
      return HttpResponse.json(
        {
          code: 400,
          data: null,
          message: "닉네임 또는 식별코드가 올바르지 않아요.",
        },
        { status: 400 },
      );
    }

    const data: LoginResponse = {
      accessToken: "mock-access-token",
      nickname: body.nickname,
      identificationCode: body.identificationCode,
    };

    return HttpResponse.json({ code: 200, data, message: "OK" });
  }),
];
