import { http, HttpResponse, delay } from "msw";
import type { JoinResponse } from "@/types/exploration";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const joinHandlers = [
  http.post(`${BASE_URL}/api/v1/courses/:courseId/join`, async () => {
    await delay(500);
    const data: JoinResponse = {
      explorationId: 44,
      participantId: 72,
      role: "MEMBER",
      status: "ACTIVE",
      displayName: "여행자",
      locationSharingEnabled: false,
      joinedAt: "2026-08-15T10:15:00+09:00",
      alreadyJoined: false,
    };
    return HttpResponse.json({
      message: "성공입니다.",
      code: "COMMON200",
      data,
      success: true,
    });
  }),
];
