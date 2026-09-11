// mocks/nearbyHandlers.ts
import { http, HttpResponse, delay } from "msw";
import type { NearbyPlacesResponse } from "@/types/exploration";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const nearbyHandlers = [
  http.get(
    `${BASE_URL}/api/v1/explorations/:explorationId/nearby-places`,
    async () => {
      await delay(400);

      const data: NearbyPlacesResponse = {
        places: [
          {
            placeId: 121,
            name: "호랑가시나무 언덕",
            category: "근대건축",
            latitude: 35.1465,
            longitude: 126.9138,
            distanceMeters: 240,
            thumbnailUrl: null,
          },
          {
            placeId: 122,
            name: "양림쌀롱",
            category: "카페",
            latitude: 35.147,
            longitude: 126.914,
            distanceMeters: 560,
            thumbnailUrl: null,
          },
          {
            placeId: 123,
            name: "펭귄마을 공예거리",
            category: "공방",
            latitude: 35.148,
            longitude: 126.915,
            distanceMeters: 610,
            thumbnailUrl: null,
          },
        ],
      };

      return HttpResponse.json({
        message: "성공입니다.",
        code: "COMMON200",
        data,
        success: true,
      });
    },
  ),
];
