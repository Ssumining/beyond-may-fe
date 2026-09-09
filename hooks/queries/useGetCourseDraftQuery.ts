"use client";

import { useQuery } from "@tanstack/react-query";

import { getCourseDraft } from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 초안 코스 상세를 조회한다. (확정 전, 추천 코스 지도 3.1.1)
 * courseId가 있을 때만 호출된다.
 */
export const useGetCourseDraftQuery = (courseId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.COURSE.DRAFT(courseId),
    queryFn: () => getCourseDraft(courseId),
    enabled: !!courseId,
  });
