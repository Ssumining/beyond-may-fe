import type { PlaceCategory } from "./map";

/** 장소 상세 조회 응답 (GET /api/v1/places/{placeId}) */
export interface PlaceDetailResponse {
  placeId: number;
  name: string;
  /** 장소의 업종·형태를 나타내는 화면 표시용 분류 (예: "전시"). travelMbtiType과는 별개 필드 */
  category: string;
  // TODO(백엔드 확인): 실제 값은 THINKER/FOODIE/ARTIST/REMEMBERER(대문자)로 내려옴.
  //   팀 전체 4유형 값 통일 논의 후 값 형식 맞출 예정, 우선 기존 PlaceCategory(소문자) 유지.
  travelMbtiType: PlaceCategory;
  tags: string[];
  address: string;
  /** 방문 인증 거리 계산에 사용 */
  latitude: number;
  longitude: number;
  businessHours: string | null;
  /** 상세 설명. 5·18 관련 의미가 있으면 이 안에 포함되어 내려옴(별도 boolean 필드 없음) */
  description: string;
  thumbnailUrl: string | null;
}

/**
 * 장소 카드덱 추천 조회 응답 (GET /api/v1/places/recommendations).
 * 카드에는 이미지·카테고리·태그만 노출되므로 PlaceDetailResponse에서
 * 카드 표시에 필요한 필드만 추린 최소 형태로 가정한다.
 *
 * TODO(백엔드 확인): 응답 스펙 미확정 — 배열 형태, 필드 구성 모두 가정치. (backend)
 */
export interface PlaceRecommendationResponse {
  placeId: number;
  name: string;
  category: string;
  travelMbtiType: PlaceCategory;
  tags: string[];
  thumbnailUrl: string | null;
}
