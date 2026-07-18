export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    nickname: "/api/users/nickname",
    nicknameCheck: (nickname: string) =>
      `/api/users/nickname/check?nickname=${nickname}`,
  },
  place: {
    detail: (placeId: number) => `/api/places/${placeId}`,
    recommendations: (scheduleId: number) =>
      `/api/schedules/${scheduleId}/recommendations`,
  },
  course: {
    detail: (scheduleId: number) => `/api/schedules/${scheduleId}/course`,
    timeline: (scheduleId: number) =>
      `/api/schedules/${scheduleId}/course/timeline`,
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
} as const;
