/**
 * 방문 장소 기록 하나 — 장소×사용자(개인) 단위.
 * types/exploration.ts의 VisitedPlace(팀 공유, "밝힌 장소")와는 다른 개인 기록이다.
 */
export interface VisitedPlaceRecord {
  visitId: number;
  placeId: number;
  name: string;
  category: string;
  tags: string[];
  thumbnailUrl: string | null;
  /** ISO 8601 문자열 */
  visitedAt: string;
  /** 인증 사진. 아직 안 올렸으면 null */
  photoUrl: string | null;
}

/** 방문 장소 목록 응답 — 방문 시각 내림차순 정렬은 화면에서 처리 */
export interface VisitedPlaceRecordListResponse {
  visits: VisitedPlaceRecord[];
}

/** 방문 인증 사진 업로드 응답 */
export interface UploadVisitPhotoResponse {
  visitId: number;
  photoUrl: string;
}
