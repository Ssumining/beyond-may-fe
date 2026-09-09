import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type {
  ChatCourseRequest,
  ChatCourseResponse,
  ConfirmCourseResponse,
  CourseResponse,
  CourseListResponse,
  GenerateCourseRequest,
  GenerateCourseResponse,
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

/** 자연어 요청으로 코스 수정을 요청한다. (3.2.1 / 9번)
 *  저장하지 않고 미리보기만 반환한다 — 장소 재배치 제안(COURSE_REVISION)이거나
 *  추가할 장소 추천(ADD_RECOMMENDATION)이다. 최대 2회, 초과 시 서버가 409를 준다. */
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

/** postCourseChat의 COURSE_REVISION 미리보기를 실제로 저장한다. */
export const postCourseChatApply = async (
  courseId: string,
  body: UpdateCourseRequest,
): Promise<CourseResponse> => {
  const response = await api.post<CourseResponse>(
    API_ENDPOINTS.course.chatApply(courseId),
    body,
  );
  return response.data!;
};

/** 코스 장소 순서를 직접 저장한다. (3.2.2 / 10번)
 *  body의 places 배열이 코스의 최종 상태 전체를 대체한다 — 빠진 장소는 삭제로 취급된다. */
export const putCoursePlaces = async (
  courseId: string,
  body: UpdateCourseRequest,
): Promise<CourseResponse> => {
  const response = await api.put<CourseResponse>(
    API_ENDPOINTS.course.places(courseId),
    body,
  );
  return response.data!;
};

/** postCourseChat의 ADD_RECOMMENDATION 카드에서 장소 1곳을 즉시 추가한다.
 *  미리보기 없이 바로 저장되며, AI가 전체 코스를 재배치한다. */
export const postCourseAddPlace = async (
  courseId: string,
  placeId: number,
): Promise<CourseResponse> => {
  const response = await api.post<CourseResponse>(
    API_ENDPOINTS.course.addPlace(courseId, placeId),
  );
  return response.data!;
};
