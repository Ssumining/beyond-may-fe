import { http, HttpResponse, delay } from "msw";

import type { PlaceDetailResponse } from "@/types/place";

/**
 * 장소 상세 조회 mock (GET /api/v1/places/{placeId} 실제 명세 기준).
 *
 * TODO: travelMbtiType 값(THINKER 등 대문자)은 팀 전체 통일 논의 후 조정. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_PLACE_DETAIL: PlaceDetailResponse = {
  placeId: 5,
  name: "5·18 기념공원",
  category: "공원",
  travelMbtiType: "remember",
  tags: ["역사", "추모공간", "무료입장"],
  address: "광주광역시 서구 내방로 152",
  latitude: 35.1468,
  longitude: 126.9,
  businessHours: "24시간 개방",
  description:
    "5·18 민주화운동의 정신을 기리기 위해 조성된 공원으로, 산책로와 기념 조형물이 있다.",
  thumbnailUrl: null,
};

export const placeHandlers = [
  http.get(`${BASE_URL}/api/v1/places/:placeId`, async () => {
    await delay(300);

    return HttpResponse.json({
      code: 200,
      data: MOCK_PLACE_DETAIL,
      message: "OK",
    });
  }),
];
