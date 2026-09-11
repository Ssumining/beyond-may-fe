import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type {
  ConfirmCourseResponse,
  CourseResponse,
  CourseListResponse,
  GenerateCourseRequest,
  GenerateCourseResponse,
  ChatCourseRequest,
  ChatCourseResponse,
  CoursePlacesRequest,
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

/** 초안 코스 상세를 조회한다. (추천 코스 지도 3.1.1 — 확정 전 draft 상태) */
export const getCourseDraft = async (
  courseId: string,
): Promise<CourseResponse> => {
  const response = await api.get<CourseResponse>(
    API_ENDPOINTS.course.draft(courseId),
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

/** 자연어로 코스 수정을 요청한다. (3.2.1 / 9번)
 *  전체 코스가 아니라 제안(proposedPlaces·recommendations)과 남은 횟수를 반환한다.
 *  실제 반영은 postCourseChatApply(변경) 또는 postCoursePlaceAdd(추천 추가)로 한다. */
export const postCourseChat = async (
  courseId: string,
  body: ChatCourseRequest,
): Promise<ChatCourseResponse> => {
  const response = await api.post<ChatCourseResponse>(
    API_ENDPOINTS.course.chat(courseId),
    body,
  );
  return response.data!;
};

/** 챗봇이 제안한 코스(순서)를 적용한다. (3.2.1 / 9번)
 *  적용 결과로 갱신된 전체 코스를 반환한다. */
export const postCourseChatApply = async (
  courseId: string,
  body: CoursePlacesRequest,
): Promise<CourseResponse> => {
  const response = await api.post<CourseResponse>(
    API_ENDPOINTS.course.chatApply(courseId),
    body,
  );
  return response.data!;
};

/** 챗봇이 추천한 장소를 코스에 추가한다. (3.2.1 / 9번, ADD_RECOMMENDATION)
 *  추가 결과로 갱신된 전체 코스를 반환한다. */
export const postCoursePlaceAdd = async (
  courseId: string,
  placeId: number,
): Promise<CourseResponse> => {
  const response = await api.post<CourseResponse>(
    API_ENDPOINTS.course.placeAdd(courseId, placeId),
  );
  return response.data!;
};

/** 코스 장소 순서를 직접 저장한다. (3.2.2 / 10번)
 *  TODO(10번): collection은 PUT /courses/{id}/places. 현재 경로·메서드는 임시 —
 *  10번 착수 시 endpoint에 places 경로 추가하고 PUT으로 교체한다. */
export const patchCourse = async (
  courseId: string,
  body: CoursePlacesRequest,
): Promise<CourseResponse> => {
  const response = await api.patch<CourseResponse>(
    API_ENDPOINTS.course.detail(courseId),
    body,
  );
  return response.data!;
};
