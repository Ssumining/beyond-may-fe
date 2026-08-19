import type { LatLng, PlaceCategory } from "./map";

/** 코스 진행 상태 */
export type CourseStatus = "DRAFT" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";

/** 여행 기간 유형 */
export type DurationType = "DAY_TRIP" | "ONE_NIGHT" | "TWO_NIGHTS";

/** 팀 내 역할 */
export type TeamRole = "OWNER" | "MEMBER";

/** 코스에 포함된 장소 하나 */
export interface CoursePlace {
  order: number;
  placeId: string;
  name: string;
  /** 장소 한 줄 설명 ("전시 · 복합문화공간" 등). 목록·폴백 표시용 */
  summary?: string;
  /** TourAPI 분류 ("문화" 등). 장소 검색 필터용 */
  category: string;
  // TODO(백엔드 확인): 4유형 필드명·값 형식 제안함
  /** Curated Layer 4분류. 핀·glow 색상 결정 */
  curatedType?: PlaceCategory;
  address: string;
  thumbnailUrl: string;
  location: LatLng;
  estimatedArrivalTime: string;
  estimatedStayMinutes: number;
  visitStatus: {
    isVisited: boolean;
    visitedAt: string | null;
    verifiedByNickname: string | null;
  };
}

/** 팀원 정보 */
export interface CourseTeamMember {
  sessionId: string;
  nickname: string;
  role: TeamRole;
  visitedPlaceCount: number;
}

/** 코스(확정) 조회 응답 */
export interface CourseDetailResponse {
  courseId: string;
  title: string;
  status: CourseStatus;
  durationType: DurationType;
  ownerSessionId: string;
  myRole: TeamRole;
  summary: {
    totalPlaceCount: number;
    visitedPlaceCount: number;
    teamMemberCount: number;
    maxMemberCount: number;
    estimatedDurationMinutes: number;
    estimatedDistanceMeters: number;
  };
  share: {
    shareId: string;
    isExpiredForNewJoin: boolean;
    expiresAt: string;
  };
  places: CoursePlace[];
  teamMembers: CourseTeamMember[];
  createdAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
}
