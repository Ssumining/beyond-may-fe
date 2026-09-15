/** 방문 인증 사진 업로드 응답 */
export interface UploadVisitPhotoResponse {
  visitId: number;
  photoUrl: string;
}

/** 방문 사진 */
export interface VisitPhoto {
  visitPhotoId: number;
  displayOrder: number;
  imageUrl: string;
  urlExpiresAt: string;
}

/** 팀 방문 기록 항목 하나 (GET /api/v1/visits?explorationId=) */
export interface TeamVisit {
  visitId: number;
  participant: { participantId: number; displayName: string };
  place: {
    placeId: number;
    name: string;
    category: string;
    travelMbtiType: string;
    tags: string[];
    address: string;
    thumbnailUrl: string | null;
  };
  coursePlaceId: number | null;
  isCoursePlace: boolean;
  /** ISO 8601 */
  visitedAt: string;
  photos: VisitPhoto[];
}

/** 팀 방문 기록 목록 응답 */
export interface TeamVisitListResponse {
  explorationId: number;
  visits: TeamVisit[];
  totalCount: number;
}
