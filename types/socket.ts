/**
 * 팀 탐험 실시간 통신 이벤트 계약 (Socket.IO).
 * 백엔드 확정 반영.
 *
 * 연결: io(SOCKET_URL, { query: { token: authToken } })  // auth: {} 아님 (netty-socketio 제약)
 * room: exploration:{explorationId}
 * 표기: camelCase / visitedAt: epoch milliseconds
 */

/* ---------------- Server -> Client ---------------- */

/** 방문 인증이 팀에 전파될 때 */
export interface VisitConfirmedPayload {
  placeId: number;
  userId: number;
  displayName: string;
  visitedAt: number; // epoch milliseconds
}

/** 팀원 개인 진행상태 갱신 */
export interface MemberProgressPayload {
  userId: number;
  displayName: string;
  visitedCount: number;
}

/** 팀원 위치 (위치 공유 옵트인한 팀원만) */
export interface MemberLocationPayload {
  userId: number;
  latitude: number;
  longitude: number;
}

/** 팀원 합류 알림 (member:left는 미구현 — REST 재조회로 대체) */
export interface MemberPresencePayload {
  userId: number;
  displayName: string;
}

/** (재)연결 시 현재 탐험 전체 상태 스냅샷 */
export interface ExplorationStatePayload {
  visitedPlaceIds: number[];
  members: MemberProgressPayload[];
}

export interface ServerToClientEvents {
  "visit:confirmed": (payload: VisitConfirmedPayload) => void;
  "member:progress": (payload: MemberProgressPayload) => void;
  "member:location": (payload: MemberLocationPayload) => void;
  "member:joined": (payload: MemberPresencePayload) => void;
  // "member:left"는 아직 미구현 — 트리거 REST가 없음. 추가 시 반영
  "exploration:state": (payload: ExplorationStatePayload) => void;
}

/* ---------------- Client -> Server ---------------- */

/**
 * 탐험 방 합류.
 * courseId·userId는 서버가 무시함 — userId는 인증 handshake로만 식별.
 */
export interface ExplorationJoinPayload {
  explorationId: number;
}

export interface ExplorationLeavePayload {
  explorationId: number;
}

export interface LocationUpdatePayload {
  explorationId: number;
  latitude: number;
  longitude: number;
}

export interface LocationOptInPayload {
  explorationId: number;
  enabled: boolean;
}

export interface ClientToServerEvents {
  "exploration:join": (payload: ExplorationJoinPayload) => void;
  "exploration:leave": (payload: ExplorationLeavePayload) => void;
  "location:update": (payload: LocationUpdatePayload) => void;
  "location:optIn": (payload: LocationOptInPayload) => void;
}
