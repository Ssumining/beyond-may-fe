import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type { CourseDetailResponse } from "@/types/course";

/**
 * 확정된 코스 상세를 조회한다.
 * 팀 탐험 지도·공유 링크 진입·여행 기록 복귀 화면에서 사용된다.
 */
export const getCourseDetail = async (
  courseId: string,
): Promise<CourseDetailResponse> => {
  const response = await api.get<CourseDetailResponse>(
    API_ENDPOINTS.course.detail(courseId),
  );
  return response.data;
};
