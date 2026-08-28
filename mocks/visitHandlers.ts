import { http, HttpResponse, delay } from "msw";
import type { VisitResponse } from "@/types/exploration";

/**
 * 방문 인증 mock (POST /api/v1/visits).
 * 실제 서버는 좌표·정확도를 재검증하지만, mock은 항상 성공으로 응답.
 * body의 placeId를 그대로 응답에 반영해 핀 컬러 전환을 검증할 수 있게 함.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const visitHandlers = [
  http.post(`${BASE_URL}/api/v1/visits`, async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as {
      explorationId: number;
      placeId: number;
    };

    const response: VisitResponse = {
      visitId: 9001,
      explorationId: body.explorationId,
      participantId: 72,
      placeId: body.placeId,
      coursePlaceId: null,
      isCoursePlace: true,
      visitedAt: "2026-08-15T14:32:10+09:00",
      distanceMeters: 37,
      teamFirstVisit: true,
      courseProgress: {
        completedCoursePlaceCount: 3,
        totalCoursePlaceCount: 5,
        completionRate: 60,
      },
      explorationStatus: "ONGOING",
    };

    return HttpResponse.json({
      code: 201,
      data: response,
      message: "생성에 성공했습니다.",
    });
  }),
];
