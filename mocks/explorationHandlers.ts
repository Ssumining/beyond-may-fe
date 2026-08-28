import { http, HttpResponse, delay } from "msw";

import type { ExplorationListResponse } from "@/types/exploration";

/**
 * 상태별 탐험 코스 목록 mock (GET /explorations?status=).
 * 홈 화면 라우팅 가드 개발용 — 기본적으로 진행 중인 코스가 없는 사용자를 흉내 낸다.
 *
 * TODO: 백엔드 응답 확정 후 실제 값으로 교체. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const explorationHandlers = [
  http.get(`${BASE_URL}/api/v1/explorations`, async () => {
    await delay(300);

    const data: ExplorationListResponse = { explorations: [] };

    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data,
      success: true,
    });
  }),
];
