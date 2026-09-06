import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type {
  ConfirmCourseResponse,
  CourseResponse,
  CourseListResponse,
  GenerateCourseRequest,
  GenerateCourseResponse,
  RefineCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";

/**
 * 확정된 코스 상세를 조회한다.
 * 팀 탐험 지도·공유 링크 진입·여행 기록 복귀 화면에서 사용된다.
 */
export const getCourseDetail = async (
  courseId: string,
): Promise<CourseResponse> => {
  const response = await api.get<CourseResponse>(
    API_ENDPOINTS.course.detail(courseId),
  );
  return response.data!;
};

/** 로그인 사용자의 초안·진행·완료 코스를 조회한다. */
export const getCourses = async (): Promise<CourseListResponse> => {
  const response = await api.get<CourseListResponse>(API_ENDPOINTS.course.list);
  return response.data!;
};

/**
 * 초안 코스를 확정해 탐험에 사용할 수 있게 한다. (3.3.1 / 6번)
 * 응답의 explorationId로 탐험 시작(8번)에 이어진다.
 */
export const postCourseConfirm = async (
  courseId: string,
): Promise<ConfirmCourseResponse> => {
  const response = await api.post<ConfirmCourseResponse>(
    API_ENDPOINTS.course.confirm(courseId),
  );
  return response.data!;
};

/** 선택한 장소를 이동 순서에 맞춘 초안 코스로 생성한다. (3.1.0)
 *  TODO(생성 플로우): collection은 생성 응답이 전체 코스(CourseResponse). 반환타입 교체 예정. */
export const postCourseGeneration = async (
  body: GenerateCourseRequest,
): Promise<GenerateCourseResponse> => {
  const response = await api.post<GenerateCourseResponse>(
    API_ENDPOINTS.course.aiGeneration,
    body,
  );
  return response.data!;
};

/** 자연어 요청으로 코스 순서를 다시 추천받는다. (3.2.1 / 9번)
 *  TODO(9번): collection은 챗봇 구조(POST /courses/{id}/chat → proposedPlaces·recommendations·
 *  remainingRevisions). 엔드포인트·요청·응답 전면 교체 예정. */
export const postCourseRefine = async (
  courseId: string,
  body: RefineCourseRequest,
): Promise<CourseResponse> => {
  const response = await api.post<CourseResponse>(
    API_ENDPOINTS.course.refine(courseId),
    body,
  );
  return response.data!;
};

/** 코스 장소 순서를 직접 저장한다. (3.2.2 / 10번)
 *  TODO(10번): collection은 PUT /courses/{id}/places. 엔드포인트·요청 구조 교체 예정. */
export const patchCourse = async (
  courseId: string,
  body: UpdateCourseRequest,
): Promise<CourseResponse> => {
  const response = await api.patch<CourseResponse>(
    API_ENDPOINTS.course.detail(courseId),
    body,
  );
  return response.data!;
};
