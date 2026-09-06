import { http, HttpResponse, delay } from "msw";

import type { VisitedPlaceRecord } from "@/types/record";

/**
 * 방문 장소 목록 mock (장소×사용자 단위, 여행 기록 화면 "방문 장소" 탭).
 * TODO(백엔드 확인): 엔드포인트·응답 형태 미확정. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_VISITED_PLACES: VisitedPlaceRecord[] = [
  {
    visitId: 1,
    placeId: 105,
    name: "5·18 기념공원",
    category: "역사",
    tags: ["역사", "추모공간"],
    thumbnailUrl: null,
    visitedAt: "2026-07-22T17:32:00+09:00",
    photoUrl: null,
  },
  {
    visitId: 2,
    placeId: 104,
    name: "사직공원 전망타워",
    category: "자연",
    tags: ["전망", "산책"],
    thumbnailUrl: null,
    visitedAt: "2026-07-22T16:05:00+09:00",
    photoUrl: null,
  },
  {
    visitId: 3,
    placeId: 103,
    name: "궁전제과",
    category: "음식",
    tags: ["빵집", "로컬 미식"],
    thumbnailUrl: null,
    visitedAt: "2026-07-22T13:35:00+09:00",
    photoUrl: null,
  },
  {
    visitId: 4,
    placeId: 102,
    name: "양림동 근대골목",
    category: "역사",
    tags: ["근대", "골목 산책"],
    thumbnailUrl: null,
    visitedAt: "2026-07-22T12:10:00+09:00",
    photoUrl: null,
  },
  {
    visitId: 5,
    placeId: 101,
    name: "국립아시아문화전당",
    category: "문화",
    tags: ["전시", "복합문화공간"],
    thumbnailUrl: null,
    visitedAt: "2026-07-22T10:40:00+09:00",
    photoUrl: null,
  },
];

export const recordHandlers = [
  http.get(`${BASE_URL}/api/v1/records/visits`, async () => {
    await delay(400);
    return HttpResponse.json({
      code: "COMMON200",
      data: { visits: MOCK_VISITED_PLACES },
      message: "방문 장소 목록을 불러왔습니다.",
      success: true,
    });
  }),
];
