export const API_ENDPOINTS = {
  auth: {
    login: "/api/v1/users/login",
    logout: "/api/v1/users/logout",
  },
  place: {
    detail: (placeId: number) => `/api/v1/places/${placeId}`,
    recommendations: "/api/v1/places/recommendations",
    search: "/api/v1/places/search",
  },
  course: {
    detail: (courseId: string) => `/api/v1/courses/${courseId}`,
    confirm: (courseId: string) => `/api/v1/courses/${courseId}/confirm`,
    aiGeneration: "/api/v1/courses/ai-generation",
  },
  preference: {
    /** 성향 검사 질문 목록 조회 (기능명세 1.1.2 / 1.2.1) */
    questions: "/api/preference-test/questions",
    /**
     * 성향 검사 결과 제출 (1.2.2)
     * TODO: userId 경로 파라미터 확정 필요. (backend)
     *   명세서: POST /api/users/{userId}/preference-test
     */
    submit: (userId: number) => `/api/users/${userId}/preference-test`,
    /** 나의 성향(결과) 조회 (1.2.2) */
    result: (userId: number) => `/api/users/${userId}/preference`,
  },
  exploration: {
    /**
     * 탐험 합류 - 중복 없이 참여 (4.1.1)
     * TODO(C 확인 필요): 실제 API는 POST /api/v1/courses/{courseId}/join (courseId 기준,
     *   공유 링크로 합류). explorationId가 아니라 courseId를 받아야 해서
     *   postJoin 함수 시그니처까지 같이 바뀌어야 함.
     */
    join: (explorationId: string) =>
      `/api/v1/explorations/${explorationId}/participants`,
    /** 탐험 시작 (4.2.4) */
    start: (explorationId: string) =>
      `/api/v1/explorations/${explorationId}/start`,
    /** 탐험 참여자 조회 - 방문 수 포함 (4.3.2) */
    participants: (explorationId: string) =>
      `/api/v1/explorations/${explorationId}/participants`,
    /** 방문 인증 (4.3.3) */
    visit: () => `/api/v1/visits`,
    /** 밝힌 장소 조회 (5.2.2) */
    visitedPlaces: (explorationId: string) =>
      `/api/v1/visits/visited-places?explorationId=${explorationId}`,
    /** 상태별 탐험 코스 목록 조회 — 홈 화면 라우팅 가드의 코스 존재 여부 판단에 사용 */
    list: (status: "ONGOING" | "COMPLETED") =>
      `/api/v1/explorations?status=${status}`,
  },
} as const;
