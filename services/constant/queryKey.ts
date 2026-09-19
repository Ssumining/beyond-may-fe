export const QUERY_KEYS = {
  HOME: { RESUME: () => ["home", "resume"] as const },
  PREFERENCE: {
    ALL: ["preference"] as const,
    QUESTIONS: () => [...QUERY_KEYS.PREFERENCE.ALL, "questions"] as const,
    RESULT: (userId: number) =>
      [...QUERY_KEYS.PREFERENCE.ALL, "result", userId] as const,
    ME: () => [...QUERY_KEYS.PREFERENCE.ALL, "me"] as const,
  },
  COURSE: {
    ALL: ["course"] as const,
    LIST: () => [...QUERY_KEYS.COURSE.ALL, "list"] as const,
    DETAIL: (courseId: string) =>
      [...QUERY_KEYS.COURSE.ALL, "detail", courseId] as const,
    DRAFT: (courseId: string) =>
      [...QUERY_KEYS.COURSE.ALL, "draft", courseId] as const,
  },
  PLACE: {
    ALL: ["place"] as const,
    DETAIL: (placeId: number) =>
      [...QUERY_KEYS.PLACE.ALL, "detail", placeId] as const,
    RECOMMENDATIONS: (type: string) =>
      [...QUERY_KEYS.PLACE.ALL, "recommendations", type] as const,
  },
  RECOMMENDATION: {
    ALL: ["recommendation"] as const,
    CURRENT: () => [...QUERY_KEYS.RECOMMENDATION.ALL, "current"] as const,
  },
  EXPLORATION: {
    ALL: ["exploration"] as const,
    PARTICIPANTS: (explorationId: string) =>
      [...QUERY_KEYS.EXPLORATION.ALL, "participants", explorationId] as const,
    LIST: (status: "BEFORE" | "ONGOING" | "COMPLETED") =>
      [...QUERY_KEYS.EXPLORATION.ALL, "list", status] as const,
    STATUS: (explorationId: string) =>
      [...QUERY_KEYS.EXPLORATION.ALL, "status", explorationId] as const,
    VISITED_PLACES: (explorationId: string) =>
      [...QUERY_KEYS.EXPLORATION.ALL, "visited-places", explorationId] as const,
    NEARBY: (explorationId: string, latitude: number, longitude: number) =>
      [
        ...QUERY_KEYS.EXPLORATION.ALL,
        "nearby",
        explorationId,
        latitude,
        longitude,
      ] as const,
  },
  RECORD: {
    ALL: ["record"] as const,
    TEAM_VISITS: (explorationId: string) =>
      [...QUERY_KEYS.RECORD.ALL, "team-visits", explorationId] as const,
  },
} as const;
