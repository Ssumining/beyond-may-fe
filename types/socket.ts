/**
 * 팀 탐험 실시간 통신 계약 (STOMP).
 * 백엔드 확정 반영.
 *
 * 연결: CONNECT /ws (SockJS 미사용), 인증은 CONNECT 프레임 헤더에 Authorization: Bearer
 * 구독(SUBSCRIBE): /topic/explorations/{explorationId}/{visits|locations|events}
 * 발행(SEND): /app/explorations/{explorationId}/locations
 * 표기: camelCase
 *
 * STOMP 메시지는 문자열(body)로 오고 가므로, 아래 타입은 JSON.parse/stringify 대상의 형태를 정의.
 */

/* ---------------- 구독 수신 payload (/topic/...) ---------------- */

/**
 * 방문 인증 전파 (/topic/explorations/{id}/visits).
 * 소켓 payload 날짜는 epoch milliseconds.
 */

export interface VisitConfirmedPayload {
  placeId: number;
  userId: number;
  displayName: string;
  visitedAt: number;
}

/** 팀원 개인 진행상태 갱신 (/topic/.../events 또는 visits 파생) */
export interface MemberProgressPayload {
  userId: number;
  displayName: string;
  visitedCount: number;
}

/** 팀원 위치 (/topic/explorations/{id}/locations) */
export interface MemberLocationPayload {
  userId: number;
  latitude: number;
  longitude: number;
}

/** 팀원 합류/상태 이벤트 (/topic/explorations/{id}/events) */
export interface MemberPresencePayload {
  userId: number;
  displayName: string;
}

/** 재연결 시 현재 탐험 전체 상태 스냅샷 */
export interface ExplorationStatePayload {
  visitedPlaceIds: number[];
  members: MemberProgressPayload[];
}

/* ---------------- 발행 송신 payload (/app/...) ---------------- */

/** 내 위치 전송 (/app/explorations/{id}/locations) */
export interface LocationUpdatePayload {
  latitude: number;
  longitude: number;
}
