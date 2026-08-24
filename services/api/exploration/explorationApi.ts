import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type {
  VisitRequest,
  VisitResponse,
  ParticipantsResponse,
  JoinResponse,
  StartResponse,
} from "@/types/exploration";

/** 탐험에 합류 (4.1.1). */
export const postJoin = async (
  explorationId: string,
): Promise<JoinResponse> => {
  const res = await api.post<JoinResponse>(
    API_ENDPOINTS.exploration.join(explorationId),
  );
  return res.data;
};

/** 탐험을 시작 (4.2.4). BEFORE → ONGOING 전환. */
export const postStart = async (
  explorationId: string,
): Promise<StartResponse> => {
  const res = await api.post<StartResponse>(
    API_ENDPOINTS.exploration.start(explorationId),
  );
  return res.data;
};

/** 탐험 참여자 목록을 조회 (4.3.2). */
export const getParticipants = async (
  explorationId: string,
): Promise<ParticipantsResponse> => {
  const res = await api.get<ParticipantsResponse>(
    API_ENDPOINTS.exploration.participants(explorationId),
  );
  return res.data;
};

/** 방문 인증을 요청 (4.3.3).
 *  서버가 좌표·정확도를 재검증.
 */
export const postVisit = async (body: VisitRequest): Promise<VisitResponse> => {
  const res = await api.post<VisitResponse>(
    API_ENDPOINTS.exploration.visit(),
    body,
  );
  return res.data;
};
