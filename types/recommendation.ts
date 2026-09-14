import type { DurationType } from "@/types/course";

/**
 * 추천 세트(장소 선택 카드덱) 계약 — 여행 기간별 최소 선택 수를 만족할 때까지
 * 최대 20곳씩 회차(batch) 단위로 받고, 한 회차를 다 넘기면 반응을 일괄 제출해야
 * 다음 회차를 받는다.
 */

/** 추천 회차에 담긴 장소 하나. 카드 표시에 필요한 필드만 내려온다 */
export interface RecommendationPlace {
  placeId: number;
  name: string;
  category: string;
  tags: string[];
  /** 비동기 상세 보강 전이거나 실패 시 null일 수 있음 */
  summary: string | null;
  thumbnailUrl: string | null;
}

/** 추천 회차 하나 */
export interface RecommendationBatch {
  batchNumber: number;
  places: RecommendationPlace[];
  /** 이미 반응을 제출한(완료된) 회차에서만 값이 채워짐 */
  likedPlaceIds: number[];
  dislikedPlaceIds: number[];
  completed: boolean;
}

/** 현재 추천 세트 조회 응답 (GET /recommendations) */
export interface RecommendationResponse {
  recommendationId: number;
  travelSchedule: DurationType;
  startDate: string;
  endDate: string;
  batchSize: number;
  minimumSelectionCount: number;
  selectedPlaceCount: number;
  selectionReady: boolean;
  batches: RecommendationBatch[];
}

/** 추천 세트 생성 요청 (POST /recommendations/sets) */
export interface CreateRecommendationSetRequest {
  travelSchedule: DurationType;
  startDate: string;
  endDate: string;
}

/** 추천 세트 생성 응답 — 최초 회차 하나만 온다(batches 전체 아님) */
export interface CreateRecommendationSetResponse {
  recommendationId: number;
  travelSchedule: DurationType;
  startDate: string;
  endDate: string;
  minimumSelectionCount: number;
  batch: RecommendationBatch;
}

/** 추천 회차 반응 교체 요청 (POST /recommendations/{id}/reactions).
 *  두 배열이 현재 회차 장소를 중복·교집합·누락 없이 정확히 분할해야 한다. */
export interface ReplaceBatchReactionsRequest {
  likedPlaceIds: number[];
  dislikedPlaceIds: number[];
}

/** 추천 회차 반응 교체 응답 */
export interface ReplaceBatchReactionsResponse {
  recommendationId: number;
  batchNumber: number;
  selectedPlaceCount: number;
  minimumSelectionCount: number;
  selectionReady: boolean;
  hasNextBatch: boolean;
  nextBatch: RecommendationBatch | null;
}
