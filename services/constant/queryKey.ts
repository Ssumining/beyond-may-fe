export const QUERY_KEYS = {
  PREFERENCE: {
    ALL: ["preference"] as const,
    QUESTIONS: () => [...QUERY_KEYS.PREFERENCE.ALL, "questions"] as const,
    RESULT: (userId: number) =>
      [...QUERY_KEYS.PREFERENCE.ALL, "result", userId] as const,
  },
} as const;
