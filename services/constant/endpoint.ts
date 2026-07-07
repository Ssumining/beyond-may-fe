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
} as const;
