import { http, HttpResponse, delay } from "msw";
import type { JoinResponse } from "@/types/exploration";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const joinHandlers = [
  http.post(`${BASE_URL}/api/v1/courses/:courseId/join`, async ({ params }) => {
    console.log("join courseId:", params.courseId);
    await delay(500);

    // 검증용: courseId가 "expired"면 만료 응답 (EXPLORATION410)
    if (params.courseId === "expired") {
      return HttpResponse.json(
        {
          message: "공유 링크가 만료되었습니다.",
          code: "EXPLORATION410",
          data: null,
          success: false,
        },
        { status: 410 },
      );
    }

    // 검증용: courseId가 "duplicate"면 중복 참여 (EXPLORATION409)
    if (params.courseId === "duplicate") {
      return HttpResponse.json(
        {
          message: "이미 다른 탐험에 참여 중입니다.",
          code: "EXPLORATION409",
          data: null,
          success: false,
        },
        { status: 409 },
      );
    }

    // 기존 성공
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
