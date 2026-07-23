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
} as const;
