/**
 * 팀 탐험 실시간 통신 이벤트 계약 (Socket.IO).
 *
 * 표기: 프로젝트 컨벤션(AGENTS.md)에 따라 payload 키는 camelCase.
 * TODO: API/소켓 응답 키를 camelCase로 제공하는지 확인 (backend)
 *   (기능명세서는 display_name(snake) 표기 → 실제 전송 표기 합의 필요).
 * TODO: 방(room) 기준이 courseId인지 explorationId인지 확정 (backend)
 *   (명세 4.2.4: 탐험 시작 시 courseId/explorationId 둘 다 발급).
 *
 * [명세 확정] = 기능명세서에 근거 있는 이벤트
 * [프론트 제안] = 명세에 없으나 구현상 필요하다고 판단해 제안하는 이벤트
 */

/* ---------------- Server -> Client ---------------- */

/**
 * [명세 확정] 방문 인증이 팀에 전파될 때.
 * 명세 4.3.3: 서버가 좌표 재검증 후 방문 완료 처리 → 팀 전체 실시간 전파.
 */
export interface VisitConfirmedPayload {
  placeId: number;
  userId: number;
  displayName: string;
  /** TODO: visitedAt 단위(초/밀리초) 확인. 명세 "API 명세서 확인 요망" (backend)*/
  visitedAt: number;
}

/**
 * [명세 확정] 팀원 개인 진행상태 갱신.
 * 명세 4.3.2: 팀원별 방문 완료 장소 수 실시간 갱신(명세 표기 "WebSocket", 구현은 Socket.IO).
 */
export interface MemberProgressPayload {
  userId: number;
  displayName: string;
  visitedCount: number;
}

/**
 * [명세 확정] 팀원 위치 (위치 공유 옵트인한 팀원만).
 * 명세 4.3.2: 옵트인 동의 팀원만 지도 마커 표시(기본 비공유), 4.3.1: 10m 주기.
 */
export interface MemberLocationPayload {
  userId: number;
  latitude: number;
  longitude: number;
}

/**
 * [프론트 제안] 팀원 합류/이탈 실시간 알림.
 * 명세 4.2.2는 첫 진입 시 REST 조회만 명시. 실시간 목록 갱신을 위해 제안.
 * TODO: 합류/이탈을 소켓 이벤트로 푸시할지 확인. (backend)
 */
export interface MemberPresencePayload {
  userId: number;
  displayName: string;
}

/**
 * [프론트 제안] (재)연결 시 현재 탐험 전체 상태 동기화.
 * 명세에 없음. 끊겼다 재연결한 팀원에게 현재 밝힌 지도·팀원 상태 복구 목적.
 * TODO: 재연결 상태 복구 방식(소켓 이벤트 vs REST 재조회) 확인. (backend)
 */
export interface ExplorationStatePayload {
  visitedPlaceIds: number[];
  members: MemberProgressPayload[];
}

export interface ServerToClientEvents {
  // 명세 확정
  "visit:confirmed": (payload: VisitConfirmedPayload) => void;
  "member:progress": (payload: MemberProgressPayload) => void;
  "member:location": (payload: MemberLocationPayload) => void;

  // 프론트 제안 (백엔드 확인 필요)
  "member:joined": (payload: MemberPresencePayload) => void;
  "member:left": (payload: MemberPresencePayload) => void;
  "exploration:state": (payload: ExplorationStatePayload) => void;
}

/* ---------------- Client -> Server ---------------- */

/**
 * [명세 확정 기반] 탐험 방 합류.
 * 명세 4.2.4: 탐험 시작/합류 시 세션 활성화.
 * TODO: join 키가 courseId인지 explorationId인지 확정. (backend)
 */
export interface ExplorationJoinPayload {
  explorationId: number;
  courseId: number;
  userId: number;
}

/** [프론트 제안] 탐험 방 이탈. 명세 6.4.1(중복 참여 차단) 이탈 처리와 연계. */
export interface ExplorationLeavePayload {
  explorationId: number;
  userId: number;
}

/**
 * [명세 확정] 내 위치 전송.
 * 명세 4.3.1: 위치 업데이트 실시간, 4.3.2: 옵트인 팀원 위치 공유, 10m 주기.
 */
export interface LocationUpdatePayload {
  explorationId: number;
  userId: number;
  latitude: number;
  longitude: number;
}

/**
 * [명세 확정] 위치 공유 옵트인/아웃 토글.
 * 명세 4.3.2: 옵트인 방식, 기본 비공유.
 */
export interface LocationOptInPayload {
  explorationId: number;
  userId: number;
  enabled: boolean;
}

export interface ClientToServerEvents {
  "exploration:join": (payload: ExplorationJoinPayload) => void;
  "exploration:leave": (payload: ExplorationLeavePayload) => void;
  "location:update": (payload: LocationUpdatePayload) => void;
  "location:optIn": (payload: LocationOptInPayload) => void;
}
