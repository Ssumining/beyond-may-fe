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
        places: [],
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
