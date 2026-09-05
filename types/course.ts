/** 코스 진행 상태 — 코스는 DRAFT/CONFIRMED만.
 *  ONGOING·COMPLETED는 exploration 소관 → types/exploration(수민).
 *  (완료 코스 목록 5.1.2도 exploration status 기준이지 course.status 아님) */
export type CourseStatus = "DRAFT" | "CONFIRMED";

/** 여행 기간 유형. collection 확인값만 확정.
 *  TODO(백엔드): 2박3일·그이상 코드값 — 추천세트 생성(2.1.1, 김혜진)에 4종 있으니 대조 후 추가 */
export type TravelSchedule = "DAY_TRIP" | "ONE_NIGHT_TWO_DAYS";

/** 성향 유형 raw(대문자). 색 정규화(→PlaceCategory)는 courseMapAdapter가 담당 */
export type TravelMbtiType = "THINKER" | "FOODIE" | "ARTIST" | "REMEMBERER";

/** 이전 장소→현재 장소 이동수단. 현재 WALK만 관측(없으면 null) */
export type TravelMode = "WALK";

/** 코스 장소 하나 — 조회/AI생성/직접수정/챗봇적용 응답 공통.
 *  방문 여부는 이 응답에 없음 → visits API와 조합(explore, 수민). */
export interface CoursePlace {
  placeId: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  dayNumber: number;
  visitOrder: number;
  estimatedStayMinutes: number;
  travelModeFromPrevious: TravelMode | null;
  /** 조회·직접수정·챗봇적용 응답엔 없음(AI생성·추천추가엔 있음) → optional. 색 매핑용 */
  travelMbtiType?: TravelMbtiType;
  /** 코스 응답엔 없고 추천 API에만 존재 → optional. 부제 fallback: summary ?? category */
  summary?: string;
}

/** 코스 응답 data — detail·draft·ai-generation·직접수정·챗봇적용 공통 shape.
 *  확정 응답(courseId·explorationId·confirmedAt·shareExpiresAt)은 별도 타입(6번). */
export interface CourseResponse {
  courseId: number;
  title: string;
  status: CourseStatus;
  travelSchedule: TravelSchedule;
  startDate: string; // ISO date "2026-08-20"
  endDate: string; // ISO date
  startTime: string; // "09:00:00"
  places: CoursePlace[];
}
