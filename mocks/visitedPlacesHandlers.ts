import { http, HttpResponse, delay } from "msw";
import type { VisitedPlacesResponse } from "@/types/exploration";

/**
 * 밝힌 장소(팀 방문 장소) 조회 mock (GET /visits/visited-places?explorationId=).
 * 방문 인증 핀 색 판단용. 코스 장소 중 일부를 방문 처리한 상태로 둠.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_VISITED_PLACES: VisitedPlacesResponse = {
  explorationId: 44,
  visitedPlaces: [
    {
      placeId: 101,
      name: "국립아시아문화전당",
      category: "문화",
      travelMbtiType: "ARTIST",
      latitude: 35.1469,
      longitude: 126.9199,
      thumbnailUrl: null,
      isCoursePlace: true,
      visitCount: 2,
      visitedByCount: 2,
      firstVisitedAt: "2026-08-15T10:40:00+09:00",
      lastVisitedAt: "2026-08-15T11:00:00+09:00",
      participantDisplayNames: ["여행자", "별밤지기"],
    },
    {
      placeId: 102,
      name: "양림동 근대골목",
      category: "역사",
      travelMbtiType: "REMEMBERER",
      latitude: 35.1376,
      longitude: 126.9142,
      thumbnailUrl: null,
      isCoursePlace: true,
      visitCount: 1,
      visitedByCount: 1,
      firstVisitedAt: "2026-08-15T12:10:00+09:00",
      lastVisitedAt: "2026-08-15T12:10:00+09:00",
      participantDisplayNames: ["여행자"],
    },
  ],
  totalVisitedPlaceCount: 2,
};

export const visitedPlacesHandlers = [
  http.get(`${BASE_URL}/api/v1/visits/visited-places`, async () => {
    await delay(300);
    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data: MOCK_VISITED_PLACES,
      success: true,
    });
  }),
];
