import { http, HttpResponse, delay } from "msw";

import type { PlaceDetailResponse } from "@/types/place";

/**
 * 장소 상세 조회 mock.
 * PlaceDetailSheet 개발용 — 5·18 관련 장소(isMemorialSite: true) 케이스를 포함한다.
 *
 * TODO: 백엔드 응답 확정 후 필드(운영시간 포맷, isMemorialSite 등) 조정. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_PLACE_DETAIL: PlaceDetailResponse = {
  placeId: "place_005",
  name: "5·18 기념공원",
  address: "광주광역시 서구 내방로 152",
  images: ["", "", ""],
  operatingHours: "24시간 개방",
  tags: ["역사", "추모공간", "무료입장"],
  description:
    "5·18 민주화운동의 정신을 기리기 위해 조성된 공원으로, 산책로와 기념 조형물이 있다.",
  isMemorialSite: true,
  category: "remember",
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
