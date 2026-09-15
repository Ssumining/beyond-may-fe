/** 방문 사진 */
export interface VisitPhoto {
  visitPhotoId: number;
  displayOrder: number;
  imageUrl: string;
  urlExpiresAt: string;
}

/** 방문 기록 저장 요청값 (multipart). memo 생략=기존 유지, ""=삭제. 사진은 files 키로 여러 장. */
export interface SaveVisitRecordRequest {
  memo?: string;
  photos?: File[];
}

/** 방문 기록 저장 응답 — 이번 요청에서 추가한 사진만 반환 */
export interface SaveVisitRecordResponse {
  visitId: number;
  memo: string | null;
  photos: VisitPhoto[];
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
  /** 방문 메모 (없으면 null) */
  memo: string | null;
  photos: VisitPhoto[];
}

/** 팀 방문 기록 목록 응답 */
export interface TeamVisitListResponse {
  explorationId: number;
  visits: TeamVisit[];
  totalCount: number;
}
