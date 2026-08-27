export const QUERY_KEYS = {
  PREFERENCE: {
    ALL: ["preference"] as const,
    QUESTIONS: () => [...QUERY_KEYS.PREFERENCE.ALL, "questions"] as const,
    RESULT: (userId: number) =>
      [...QUERY_KEYS.PREFERENCE.ALL, "result", userId] as const,
  },
  COURSE: {
    ALL: ["course"] as const,
    DETAIL: (courseId: string) =>
      [...QUERY_KEYS.COURSE.ALL, "detail", courseId] as const,
  },
  PLACE: {
    ALL: ["place"] as const,
    DETAIL: (placeId: number) =>
      [...QUERY_KEYS.PLACE.ALL, "detail", placeId] as const,
  },
} as const;
