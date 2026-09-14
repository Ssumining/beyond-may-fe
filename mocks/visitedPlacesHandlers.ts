import { http, HttpResponse, delay } from "msw";
import type { VisitedPlace, VisitedPlacesResponse } from "@/types/exploration";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** courseHandlers.ts의 MOCK_PLACES와 값 동기화 필요 (mock 전용 중복 데이터) */
const PLACE_META: Record<
  number,
  Pick<
    VisitedPlace,
    "name" | "category" | "travelMbtiType" | "latitude" | "longitude"
  >
> = {
  101: {
    name: "국립아시아문화전당",
    category: "문화",
    travelMbtiType: "ARTIST",
    latitude: 35.1469,
    longitude: 126.9199,
  },
  102: {
    name: "양림동 근대골목",
    category: "역사",
    travelMbtiType: "REMEMBERER",
    latitude: 35.1376,
    longitude: 126.9142,
  },
  103: {
    name: "궁전제과",
    category: "음식",
    travelMbtiType: "FOODIE",
    latitude: 35.1489,
    longitude: 126.9152,
  },
  104: {
    name: "사직공원 전망타워",
    category: "자연",
    travelMbtiType: "THINKER",
    latitude: 35.1402,
    longitude: 126.9088,
  },
  105: {
    name: "5·18 기념공원",
    category: "역사",
    travelMbtiType: "REMEMBERER",
    latitude: 35.1468,
    longitude: 126.9,
  },
};

/** 개발 세션 동안 유지되는 방문 상태. 최초엔 1, 2번 장소만 방문 처리. */
const visitedPlaceIds = new Set<number>([101, 102]);

/** POST /visits mock에서 호출해 방문 목록에 반영. */
export const markPlaceVisited = (placeId: number): void => {
  visitedPlaceIds.add(placeId);
};

const buildVisitedPlaces = (): VisitedPlace[] =>
  Array.from(visitedPlaceIds).flatMap((placeId) => {
    const meta = PLACE_META[placeId];
    if (!meta) return [];
    return [
      {
        placeId,
        ...meta,
        thumbnailUrl: null,
        isCoursePlace: true,
        visitCount: 1,
        visitedByCount: 1,
        firstVisitedAt: "2026-08-15T10:40:00+09:00",
        lastVisitedAt: "2026-08-15T10:40:00+09:00",
        participantDisplayNames: ["여행자"],
      },
    ];
  });

export const visitedPlacesHandlers = [
  http.get(`${BASE_URL}/api/v1/visits/visited-places`, async () => {
    await delay(300);
    const visitedPlaces = buildVisitedPlaces();
    const response: VisitedPlacesResponse = {
      explorationId: 44,
      visitedPlaces,
      totalVisitedPlaceCount: visitedPlaces.length,
    };
    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data: response,
      success: true,
    });
  }),
];