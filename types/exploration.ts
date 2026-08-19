/** 방문 인증 요청 (4.3.3) — body: { latitude, longitude } */
export interface VisitRequest {
  latitude: number;
  longitude: number;
}

/**
 * 방문 인증 응답 (4.3.3).
 * TODO: 실제 응답 JSON 확인 후 필드 확정 (backend)
 */
export interface VisitResponse {
  placeId: number;
  visitedAt: number; // epoch milliseconds
}

/** 팀원 목록 항목 (4.3.2) */
export interface ExplorationMember {
  userId: number;
  displayName: string;
  visitedCount: number;
}

/** 팀원 목록 응답 (4.3.2) */
export interface MembersResponse {
  members: ExplorationMember[];
}

/**
 * 팀 합류 응답 (4.1.1).
 * TODO: 응답 JSON 확인 후 확정 (backend)
 */
export interface JoinResponse {
  explorationId: number;
  courseId: number;
}

/**
 * 탐험 시작 응답 (4.2.4).
 * TODO: 응답 JSON 확인 후 확정 (backend)
 */
export interface StartResponse {
  explorationId: number;
}
