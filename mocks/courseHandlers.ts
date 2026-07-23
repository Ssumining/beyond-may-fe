import { http, HttpResponse, delay } from "msw";

import type { CourseDetailResponse } from "@/types/course";

/**
 * 코스 조회 mock.
 * 지도 렌더 확인용으로 광주 실제 좌표 5개를 사용하며,
 * 앞 2곳은 방문 완료 상태로 두어 glow·체크 핀을 확인할 수 있다.
 *
 * TODO: curatedType 필드명·값 형식은 백엔드 확정 후 조정. (backend)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const MOCK_COURSE: CourseDetailResponse = {
  courseId: "course_01J",
  title: "하루치 광주",
  status: "IN_PROGRESS",
  durationType: "DAY_TRIP",
  ownerSessionId: "sess_01J",
  myRole: "MEMBER",
  summary: {
    totalPlaceCount: 5,
    visitedPlaceCount: 2,
    teamMemberCount: 4,
    maxMemberCount: 5,
    estimatedDurationMinutes: 360,
    estimatedDistanceMeters: 8200,
  },
  share: {
    shareId: "share_01J",
    isExpiredForNewJoin: false,
    expiresAt: "2026-08-03T09:20:00+09:00",
  },
  places: [
    {
      order: 1,
      placeId: "place_001",
      name: "국립아시아문화전당",
      category: "문화",
      curatedType: "artist",
      address: "광주광역시 동구 문화전당로 38",
      thumbnailUrl: "",
      location: { lat: 35.1469, lng: 126.9199 },
      estimatedArrivalTime: "09:30",
      estimatedStayMinutes: 90,
      visitStatus: {
        isVisited: true,
        visitedAt: "2026-07-22T10:40:00+09:00",
        verifiedByNickname: "김감자감자",
      },
    },
    {
      order: 2,
      placeId: "place_002",
      name: "양림동 근대골목",
      category: "역사",
      curatedType: "remember",
      address: "광주광역시 남구 양림동",
      thumbnailUrl: "",
      location: { lat: 35.1376, lng: 126.9142 },
      estimatedArrivalTime: "11:30",
      estimatedStayMinutes: 60,
      visitStatus: {
        isVisited: true,
        visitedAt: "2026-07-22T12:10:00+09:00",
        verifiedByNickname: "김감자감자",
      },
    },
    {
      order: 3,
      placeId: "place_003",
      name: "궁전제과",
      category: "음식",
      curatedType: "foodie",
      address: "광주광역시 동구 충장로 93-6",
      thumbnailUrl: "",
      location: { lat: 35.1489, lng: 126.9152 },
      estimatedArrivalTime: "13:30",
      estimatedStayMinutes: 40,
      visitStatus: {
        isVisited: false,
        visitedAt: null,
        verifiedByNickname: null,
      },
    },
    {
      order: 4,
      placeId: "place_004",
      name: "사직공원 전망타워",
      category: "자연",
      curatedType: "thinker",
      address: "광주광역시 남구 사직길 49",
      thumbnailUrl: "",
      location: { lat: 35.1402, lng: 126.9088 },
      estimatedArrivalTime: "16:00",
      estimatedStayMinutes: 45,
      visitStatus: {
        isVisited: false,
        visitedAt: null,
        verifiedByNickname: null,
      },
    },
    {
      order: 5,
      placeId: "place_005",
      name: "5·18 기념공원",
      category: "역사",
      curatedType: "remember",
      address: "광주광역시 서구 내방로 152",
      thumbnailUrl: "",
      location: { lat: 35.1468, lng: 126.9 },
      estimatedArrivalTime: "17:30",
      estimatedStayMinutes: 60,
      visitStatus: {
        isVisited: false,
        visitedAt: null,
        verifiedByNickname: null,
      },
    },
  ],
  teamMembers: [
    {
      sessionId: "sess_01J",
      nickname: "김감자감자",
      role: "OWNER",
      visitedPlaceCount: 2,
    },
  ],
  createdAt: "2026-07-22T09:15:00+09:00",
  confirmedAt: "2026-07-22T09:20:00+09:00",
  completedAt: null,
};

export const courseHandlers = [
  // 코스(확정) 조회. courseId는 어떤 값이 와도 mock 코스 반환.
  http.get(`${BASE_URL}/api/v1/courses/:courseId`, async () => {
    await delay(500);
    return HttpResponse.json({
      code: 200,
      data: MOCK_COURSE,
      message: "OK",
    });
  }),
];
