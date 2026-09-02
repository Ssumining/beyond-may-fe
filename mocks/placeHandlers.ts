import { http, HttpResponse, delay } from "msw";

import type {
  PlaceDetailResponse,
  PlaceRecommendationResponse,
} from "@/types/place";

/**
 * 장소 상세·추천 목록 mock.
 *
 * TODO: travelMbtiType 값(THINKER 등 대문자)은 팀 전체 통일 논의 후 조정. (backend)
 * TODO: GET /places/recommendations 응답 스펙(배열 여부·필드) 확정 전까지 가정치. (backend)
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

const MOCK_PLACE_RECOMMENDATIONS: PlaceRecommendationResponse[] = [
  {
    placeId: 5,
    name: "5·18 기념공원",
    category: "공원",
    travelMbtiType: "remember",
    tags: ["역사", "추모공간"],
    thumbnailUrl: null,
  },
  {
    placeId: 6,
    name: "ACC 라이브러리파크",
    category: "전시",
    travelMbtiType: "thinker",
    tags: ["실내", "조용한"],
    thumbnailUrl: null,
  },
  {
    placeId: 7,
    name: "광주천 억새길",
    category: "산책",
    travelMbtiType: "artist",
    tags: ["야외", "산책로"],
    thumbnailUrl: null,
  },
  {
    placeId: 8,
    name: "동명동 카페거리",
    category: "카페",
    travelMbtiType: "foodie",
    tags: ["디저트", "골목"],
    thumbnailUrl: null,
  },
];

export const placeHandlers = [
  http.get(`${BASE_URL}/api/v1/places/recommendations`, async () => {
    await delay(300);

    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data: MOCK_PLACE_RECOMMENDATIONS,
      success: true,
    });
  }),

  http.get(`${BASE_URL}/api/v1/places/:placeId`, async () => {
    await delay(300);

    return HttpResponse.json({
      code: 200,
      data: MOCK_PLACE_DETAIL,
      message: "OK",
    });
  }),
];
