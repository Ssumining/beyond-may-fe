import { http, HttpResponse, delay } from "msw";
import type { LeaveExplorationResponse } from "@/types/exploration";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const leaveHandlers = [
  http.post(
    `${BASE_URL}/api/v1/explorations/:explorationId/leave`,
    async ({ params }) => {
      await delay(400);
      const data: LeaveExplorationResponse = {
        explorationId: Number(params.explorationId),
        participantId: 72,
        status: "LEFT",
        leftAt: new Date().toISOString(),
        ownerParticipantId: null,
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
