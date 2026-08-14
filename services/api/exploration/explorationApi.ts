import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type {
  VisitRequest,
  VisitResponse,
  MembersResponse,
  JoinResponse,
  StartResponse,
} from "@/types/exploration";

/**
 * 공유 링크로 팀에 합류 (4.1.1).
 * 인터셉터가 공통 래퍼를 반환하므로 res.data로 실제 데이터를 꺼냄.
 */
export const postJoin = async (courseId: string): Promise<JoinResponse> => {
  const res = await api.post<JoinResponse>(
    API_ENDPOINTS.exploration.join(courseId),
  );
  return res.data;
};

/** 탐험 시작 (4.2.4). */
export const postStart = async (
  explorationId: string,
): Promise<StartResponse> => {
  const res = await api.post<StartResponse>(
    API_ENDPOINTS.exploration.start(explorationId),
  );
  return res.data;
};

/** 팀원 목록(방문 수 포함) 조회 (4.3.2). */
export const getMembers = async (
  explorationId: string,
): Promise<MembersResponse> => {
  const res = await api.get<MembersResponse>(
    API_ENDPOINTS.exploration.members(explorationId),
  );
  return res.data;
};

/**
 * 방문 인증 요청 (4.3.3).
 * 서버가 좌표를 재검증하여 인증 여부 판정.
 */
export const postVisit = async (
  explorationId: string,
  placeId: string,
  body: VisitRequest,
): Promise<VisitResponse> => {
  const res = await api.post<VisitResponse>(
    API_ENDPOINTS.exploration.visit(explorationId, placeId),
    body,
  );
  return res.data;
};
