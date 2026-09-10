import { http, HttpResponse, delay } from "msw";

import type {
  ExplorationListResponse,
  StartResponse,
} from "@/types/exploration";

/**
 * 상태별 탐험 코스 목록 mock (GET /explorations?status=).
 * 홈 화면 라우팅 가드 개발용.
 * (합류 join은 joinHandlers가 담당 — expired/duplicate 케이스 포함)
 *
 * TODO: 백엔드 응답 확정 후 실제 값으로 교체. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_HAS_ONGOING_COURSE = false;

export const explorationHandlers = [
  http.post(
    `${BASE_URL}/api/v1/explorations/:explorationId/start`,
    async () => {
      await delay(600);
      const data: StartResponse = {
        explorationId: 44,
        courseId: 31,
        status: "ONGOING",
        participantId: 72,
        startedAt: new Date().toISOString(),
      };
      return HttpResponse.json({
        code: "COMMON200",
        data,
        message: "탐험을 시작했습니다.",
        success: true,
      });
    },
  ),

  http.get(`${BASE_URL}/api/v1/explorations`, async () => {
    await delay(300);

    const data: ExplorationListResponse = {
      explorations: MOCK_HAS_ONGOING_COURSE
        ? [{ explorationId: 1, courseId: 1, status: "ONGOING" }]
        : [],
    };

    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data,
      success: true,
    });
  }),
];
