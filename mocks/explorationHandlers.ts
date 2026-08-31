import { http, HttpResponse, delay } from "msw";

import type { ExplorationListResponse } from "@/types/exploration";

/**
 * 상태별 탐험 코스 목록 mock (GET /explorations?status=).
 * 홈 화면 라우팅 가드 개발용.
 *
 * TODO: 백엔드 응답 확정 후 실제 값으로 교체. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** true로 바꾸면 진행 중인 탐험이 있는 사용자를 흉내 내 /explore 분기를 테스트할 수 있다 */
const MOCK_HAS_ONGOING_COURSE = false;

export const explorationHandlers = [
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
