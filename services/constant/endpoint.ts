export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    nickname: "/api/users/nickname",
    nicknameCheck: (nickname: string) =>
      `/api/users/nickname/check?nickname=${nickname}`,
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
    /** 공유 링크로 팀 합류 (4.1.1) */
    join: (courseId: string) => `/api/v1/courses/${courseId}/join`,
    /** 탐험 시작 (4.2.4) */
    start: (explorationId: string) =>
      `/api/v1/explorations/${explorationId}/start`,
    /** 팀원 목록 조회 - 방문 수 포함 (4.3.2) */
    members: (explorationId: string) =>
      `/api/v1/explorations/${explorationId}/members`,
    /** 방문 인증 (4.3.3) */
    visit: (explorationId: string, placeId: string) =>
      `/api/v1/explorations/${explorationId}/places/${placeId}/visits`,
  },
} as const;
