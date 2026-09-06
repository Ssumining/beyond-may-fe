import { http, HttpResponse, delay } from "msw";

import type {
  CourseResponse,
  GenerateCourseRequest,
  RefineCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";

/**
 * 코스 조회 mock (collection _5 구조 기준).
 * 지도 렌더 확인용으로 광주 실제 좌표 5개를 사용한다.
 *
 * - GET /courses/:id        → 확정 코스(CONFIRMED)
 * - GET /courses/:id/draft  → 초안 코스(DRAFT, AI 생성 직후 상태)
 *
 * 방문 여부는 코스 응답에 없음 → 탐험(visits API, 수민)에서 조합한다.
 * 좌표는 flat(latitude/longitude), 순서는 visitOrder, 성향은 대문자 travelMbtiType.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_PLACES: CourseResponse["places"] = [
  {
    placeId: 101,
    name: "국립아시아문화전당",
    category: "문화",
    address: "광주광역시 동구 문화전당로 38",
    latitude: 35.1469,
    longitude: 126.9199,
    dayNumber: 1,
    visitOrder: 1,
    estimatedStayMinutes: 90,
    travelModeFromPrevious: null,
    travelMbtiType: "ARTIST",
    summary: "전시 · 복합문화공간",
  },
  {
    placeId: 102,
    name: "양림동 근대골목",
    category: "역사",
    address: "광주광역시 남구 양림동",
    latitude: 35.1376,
    longitude: 126.9142,
    dayNumber: 1,
    visitOrder: 2,
    estimatedStayMinutes: 60,
    travelModeFromPrevious: "WALK",
    travelMbtiType: "REMEMBERER",
    summary: "근대 · 골목 산책",
  },
  {
    placeId: 103,
    name: "궁전제과",
    category: "음식",
    address: "광주광역시 동구 충장로 93-6",
    latitude: 35.1489,
    longitude: 126.9152,
    dayNumber: 1,
    visitOrder: 3,
    estimatedStayMinutes: 40,
    travelModeFromPrevious: "WALK",
    travelMbtiType: "FOODIE",
    summary: "빵집 · 로컬 미식",
  },
  {
    placeId: 104,
    name: "사직공원 전망타워",
    category: "자연",
    address: "광주광역시 남구 사직길 49",
    latitude: 35.1402,
    longitude: 126.9088,
    dayNumber: 1,
    visitOrder: 4,
    estimatedStayMinutes: 45,
    travelModeFromPrevious: "WALK",
    travelMbtiType: "THINKER",
    summary: "자연 · 전망",
  },
  {
    placeId: 105,
    name: "5·18 기념공원",
    category: "역사",
    address: "광주광역시 서구 내방로 152",
    latitude: 35.1468,
    longitude: 126.9,
    dayNumber: 1,
    visitOrder: 5,
    estimatedStayMinutes: 60,
    travelModeFromPrevious: "WALK",
    travelMbtiType: "REMEMBERER",
    summary: "역사 · 추모 공간",
  },
];

/** 확정 코스 (팀 탐험·공유 진입·기록 복귀에서 조회) */
const MOCK_COURSE: CourseResponse = {
  courseId: 1,
  title: "하루치 광주",
  status: "CONFIRMED",
  travelSchedule: "DAY_TRIP",
  startDate: "2026-08-20",
  endDate: "2026-08-20",
  startTime: "09:00:00",
  places: MOCK_PLACES,
};

/** 초안 코스 (추천 코스 지도 3.1.1 — AI 생성 직후, 아직 미확정) */
const MOCK_COURSE_DRAFT: CourseResponse = {
  ...MOCK_COURSE,
  courseId: 1,
  status: "DRAFT",
};

/** 개발 세션 안에서 확정·보정·직접수정 결과를 다음 조회까지 유지한다. */
const courseOverrides = new Map<number, CourseResponse>();

export const getMockCourse = (courseId: number): CourseResponse => {
  const override = courseOverrides.get(courseId);
  if (override) return override;
  return { ...MOCK_COURSE, courseId };
};

/** 성공 래퍼로 감싼다 (collection _5: message·code·data·success) */
const wrap = <T>(data: T) => ({
  code: "COMMON200",
  data,
  message: "성공입니다.",
  success: true,
});

export const courseHandlers = [
  /** 로그인 사용자의 초안·진행·완료 코스를 조회한다. */
  http.get(`${BASE_URL}/api/v1/courses`, async () => {
    await delay(450);
    return HttpResponse.json(wrap({ courses: [getMockCourse(1)] }));
  }),

  /** 선택한 장소를 이동 순서에 맞춘 초안 코스로 생성한다. */
  http.post(`${BASE_URL}/api/v1/courses/ai-generation`, async ({ request }) => {
    const body = (await request.json()) as Partial<GenerateCourseRequest>;

    if (
      !Array.isArray(body.placeIds) ||
      body.placeIds.length === 0 ||
      body.placeIds.some((placeId) => !Number.isInteger(placeId))
    ) {
      return HttpResponse.json(
        {
          code: "COURSE400",
          data: null,
          message: "코스에 담을 장소를 한 곳 이상 선택해 주세요.",
          success: false,
        },
        { status: 400 },
      );
    }

    await delay(1800);

    // TODO(생성 플로우): collection은 생성 응답이 전체 코스(CourseResponse). 지금은 통과용 최소.
    return HttpResponse.json(wrap({ courseId: 1 }));
  }),

  /** 초안 코스를 확정해 탐험에 사용할 수 있게 한다. */
  http.post(
    `${BASE_URL}/api/v1/courses/:courseId/confirm`,
    async ({ params }) => {
      await delay(900);

      const courseId = Number(params.courseId);
      const course = getMockCourse(courseId);
      const confirmedAt = new Date().toISOString();
      courseOverrides.set(courseId, { ...course, status: "CONFIRMED" });

      return HttpResponse.json(
        wrap({
          courseId,
          explorationId: courseId,
          status: "CONFIRMED" as const,
          confirmedAt,
          shareExpiresAt: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }),
      );
    },
  ),

  /** 자연어 요청으로 코스 순서를 다시 추천받는다. */
  http.post(
    `${BASE_URL}/api/v1/courses/:courseId/ai-refine`,
    async ({ params, request }) => {
      const courseId = Number(params.courseId);
      const body = (await request.json()) as Partial<RefineCourseRequest>;
      await delay(1200);

      if (!body.message?.trim() || body.message.includes("실패")) {
        return HttpResponse.json(
          {
            code: "COURSE500",
            data: null,
            message: "코스를 다듬지 못했습니다.",
            success: false,
          },
          { status: 500 },
        );
      }

      const course = getMockCourse(courseId);
      const refinedCourse: CourseResponse = {
        ...course,
        places: [...course.places]
          .reverse()
          .map((place, index) => ({ ...place, visitOrder: index + 1 })),
      };
      courseOverrides.set(courseId, refinedCourse);

      return HttpResponse.json(wrap(refinedCourse));
    },
  ),

  /** 코스 장소 순서를 직접 저장한다. */
  http.patch(
    `${BASE_URL}/api/v1/courses/:courseId`,
    async ({ params, request }) => {
      const courseId = Number(params.courseId);
      const body = (await request.json()) as Partial<UpdateCourseRequest>;
      const course = getMockCourse(courseId);
      await delay(700);

      if (!Array.isArray(body.places) || body.places.length === 0) {
        return HttpResponse.json(
          {
            code: "COURSE400",
            data: null,
            message: "장소 순서를 확인해 주세요.",
            success: false,
          },
          { status: 400 },
        );
      }

      const placesById = new Map(
        course.places.map((place) => [place.placeId, place]),
      );
      const places = body.places.flatMap(
        ({ placeId, dayNumber, visitOrder }) => {
          const place = placesById.get(placeId);
          return place ? [{ ...place, dayNumber, visitOrder }] : [];
        },
      );

      if (places.length !== body.places.length) {
        return HttpResponse.json(
          {
            code: "COURSE400",
            data: null,
            message: "유효하지 않은 장소가 포함되어 있습니다.",
            success: false,
          },
          { status: 400 },
        );
      }

      const updatedCourse = { ...course, places };
      courseOverrides.set(courseId, updatedCourse);

      return HttpResponse.json(wrap(updatedCourse));
    },
  ),

  // 초안 코스 조회 (3.1.1). :id/draft 가 :id 보다 먼저 와야 매칭됨
  http.get(`${BASE_URL}/api/v1/courses/:courseId/draft`, async () => {
    await delay(500);
    return HttpResponse.json(wrap(MOCK_COURSE_DRAFT));
  }),

  // 코스(확정) 조회
  http.get(`${BASE_URL}/api/v1/courses/:courseId`, async ({ params }) => {
    await delay(500);
    const courseId = Number(params.courseId);
    return HttpResponse.json(wrap(getMockCourse(courseId)));
  }),
];
