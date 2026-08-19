/** 참여자 역할 */
export type ParticipantRole = "OWNER" | "MEMBER";

/** 참여자 상태 */
export type ParticipantStatus = "ACTIVE" | "LEFT";

/** 탐험 상태 */
export type ExplorationStatus = "BEFORE" | "ONGOING" | "COMPLETED";

/* ---------------- 방문 인증 (4.3.3) ---------------- */

/** 방문 인증 요청 — POST /api/v1/visits */
export interface VisitRequest {
  explorationId: number;
  placeId: number;
  latitude: number;
  longitude: number;
  /** GPS 정확도(m). 서버가 50m 초과 시 인증 거부 */
  accuracyMeters: number;
}

/** 코스 진행률 */
export interface CourseProgress {
  completedCoursePlaceCount: number;
  totalCoursePlaceCount: number;
  completionRate: number;
}

/** 방문 인증 응답 (201) */
export interface VisitResponse {
  visitId: number;
  explorationId: number;
  participantId: number;
  placeId: number;
  coursePlaceId: number | null;
  isCoursePlace: boolean;
  /** ISO 8601 문자열 (예: 2026-08-15T14:32:10+09:00) */
  visitedAt: string;
  distanceMeters: number;
  /** 최초 팀 방문 여부 — 핀 밝히기 기준 */
  teamFirstVisit: boolean;
  courseProgress: CourseProgress;
  explorationStatus: ExplorationStatus;
}

/* ---------------- 탐험 참여자 조회 (4.3.2) ---------------- */

/** 참여자 한 명 */
export interface ExplorationParticipant {
  participantId: number;
  displayName: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  visitedPlaceCount: number;
  locationSharingEnabled: boolean;
  isMe: boolean;
  /** ISO 8601 문자열 */
  joinedAt: string;
}

/** 참여자 목록 응답 */
export interface ParticipantsResponse {
  explorationId: number;
  participantCount: number;
  participants: ExplorationParticipant[];
}

/* ---------------- 탐험 시작 (4.2.4) ---------------- */

/** 탐험 시작 응답 */
export interface StartResponse {
  explorationId: number;
  courseId: number;
  status: ExplorationStatus;
  participantId: number;
  /** ISO 8601 문자열 */
  startedAt: string;
}

/* ---------------- 탐험 합류 (4.1.1) ---------------- */

/** 탐험 합류 응답 (201 최초 / 200 재진입) */
export interface JoinResponse {
  explorationId: number;
  participantId: number;
  role: ParticipantRole;
  status: ParticipantStatus;
  displayName: string;
  locationSharingEnabled: boolean;
  /** ISO 8601 문자열 */
  joinedAt: string;
  /** 이미 합류한 사용자의 재진입이면 true */
  alreadyJoined: boolean;
}
