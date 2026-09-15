"use client";

import { useQuery } from "@tanstack/react-query";

import { getCourseForView } from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 코스 상세 조회 (추천 코스 지도 3.1.1).
 * 초안·확정 상태를 모르는 진입점이라, 초안 우선 조회 후 확정으로 폴백.
 * courseId가 있을 때만 호출.
 */
export const useGetCourseDetailQuery = (courseId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.COURSE.DETAIL(courseId),
    queryFn: () => getCourseForView(courseId),
    enabled: !!courseId,
  });