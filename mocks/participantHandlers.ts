import { http, HttpResponse, delay } from "msw";
import type { ParticipantsResponse } from "@/types/exploration";

/**
 * 탐험 참여자 조회 mock (GET /explorations/{id}/participants).
 * 실제 명세 기준. OWNER 우선·joinedAt 정렬은 서버가 하므로 정렬된 순서로 둠.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_PARTICIPANTS: ParticipantsResponse = {
  explorationId: 44,
  participantCount: 3,
  participants: [
    {
      participantId: 70,
      displayName: "여행자",
      role: "OWNER",
      status: "ACTIVE",
      visitedPlaceCount: 3,
      locationSharingEnabled: true,
      isMe: false,
      joinedAt: "2026-08-14T18:00:00+09:00",
    },
    {
      participantId: 71,
      displayName: "별밤지기",
      role: "MEMBER",
      status: "ACTIVE",
      visitedPlaceCount: 2,
      locationSharingEnabled: false,
      isMe: true,
      joinedAt: "2026-08-15T09:40:00+09:00",
    },
    {
      participantId: 72,
      displayName: "숲길산책",
      role: "MEMBER",
      status: "ACTIVE",
      visitedPlaceCount: 1,
      locationSharingEnabled: false,
      isMe: false,
      joinedAt: "2026-08-15T10:15:00+09:00",
    },
  ],
};

export const participantHandlers = [
  http.get(
    `${BASE_URL}/api/v1/explorations/:explorationId/participants`,
    async () => {
      await delay(400);
      return HttpResponse.json({
        code: 200,
        data: MOCK_PARTICIPANTS,
        message: "OK",
      });
    },
  ),
];
