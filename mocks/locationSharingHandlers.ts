import { http, HttpResponse, delay } from "msw";
import type { LocationSharingResponse } from "@/types/exploration";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const locationSharingHandlers = [
  http.patch(
    `${BASE_URL}/api/v1/explorations/:explorationId/participants/me/location-sharing`,
    async ({ request }) => {
      await delay(300);
      const body = (await request.json()) as { enabled: boolean };

      const data: LocationSharingResponse = {
        explorationId: 44,
        participantId: 72,
        locationSharingEnabled: body.enabled,
        updatedAt: "2026-08-15T21:20:00+09:00",
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
