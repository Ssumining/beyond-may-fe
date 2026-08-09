"use client";

import { useQuery } from "@tanstack/react-query";

import { getCourseDetail } from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 확정 코스 상세를 조회한다.
 * courseId가 있을 때만 호출된다.
 */
export const useGetCourseDetailQuery = (courseId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.COURSE.DETAIL(courseId),
    queryFn: () => getCourseDetail(courseId),
    enabled: !!courseId,
  });
