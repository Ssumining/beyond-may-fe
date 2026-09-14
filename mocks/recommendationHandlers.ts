import { http, HttpResponse, delay } from "msw";

import {
  getMockPlaceDetail,
  MOCK_PLACE_RECOMMENDATIONS,
} from "@/mocks/placeHandlers";
import type { DurationType } from "@/types/course";
import type {
  CreateRecommendationSetRequest,
  RecommendationBatch,
  RecommendationPlace,
  ReplaceBatchReactionsRequest,
} from "@/types/recommendation";

/**
 * 추천 세트(장소 선택 카드덱) mock.
 *
 * 실제 계약: 최대 20곳씩 회차로 나눠 내려주고, 한 회차를 다 넘기면 반응을
 * 일괄 제출해야 다음 회차를 받는다. 여기서는 단일 사용자 로컬 개발을
 * 가정해 세션 하나만 메모리에 유지한다(새로고침해도 개발 서버 재시작 전까진 유지).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const BATCH_SIZE = 20;

/** 여행 기간별 최소 선택 수 — features/places/utils/travelSchedule.ts의 값과 동일하게 맞춤 */
const MINIMUM_SELECTION_COUNT: Record<DurationType, number> = {
  DAY_TRIP: 3,
  ONE_NIGHT_TWO_DAYS: 5,
  TWO_NIGHTS_THREE_DAYS: 7,
  CUSTOM: 20,
};

const PLACE_POOL: RecommendationPlace[] = MOCK_PLACE_RECOMMENDATIONS.map(
  (place) => ({
    placeId: place.placeId,
    name: place.name,
    category: place.category,
    tags: place.tags,
    summary: getMockPlaceDetail(place.placeId)?.description ?? null,
    thumbnailUrl: place.thumbnailUrl,
  }),
);

interface RecommendationState {
  recommendationId: number;
  travelSchedule: DurationType;
  startDate: string;
  endDate: string;
  minimumSelectionCount: number;
  batches: RecommendationBatch[];
  /** 아직 반응을 제출하지 않은 현재 회차 인덱스 */
  currentBatchIndex: number;
}

let recommendation: RecommendationState | null = null;
let nextRecommendationId = 1;

const buildBatches = (): RecommendationBatch[] => {
  const batches: RecommendationBatch[] = [];
  for (let start = 0; start < PLACE_POOL.length; start += BATCH_SIZE) {
    batches.push({
      batchNumber: batches.length + 1,
      places: PLACE_POOL.slice(start, start + BATCH_SIZE),
      likedPlaceIds: [],
      dislikedPlaceIds: [],
      completed: false,
    });
  }
  return batches;
};

const wrap = <T>(data: T) => ({
  code: "COMMON200",
  data,
  message: "성공입니다.",
  success: true,
});

/** AI 코스 생성(mock)이 참조하는, 지금까지 제출된 회차의 좋아요 장소 전체 */
export const getCurrentRecommendationLikedPlaces = (): RecommendationPlace[] =>
  recommendation
    ? recommendation.batches.flatMap((batch) =>
        batch.places.filter((place) =>
          batch.likedPlaceIds.includes(place.placeId),
        ),
      )
    : [];

/** AI 코스 생성(mock)이 참조하는 현재 추천 세트의 여행 기간 */
export const getCurrentRecommendationSchedule = () =>
  recommendation
    ? {
        travelSchedule: recommendation.travelSchedule,
        startDate: recommendation.startDate,
        endDate: recommendation.endDate,
      }
    : null;

export const recommendationHandlers = [
  http.get(`${BASE_URL}/api/v1/recommendations`, async () => {
    await delay(400);
    if (!recommendation) {
      return HttpResponse.json(
        {
          code: "RECOMMENDATION404",
          data: null,
          message: "현재 추천을 찾을 수 없습니다.",
          success: false,
        },
        { status: 404 },
      );
    }

    const selectedPlaceCount = recommendation.batches.reduce(
      (sum, batch) => sum + batch.likedPlaceIds.length,
      0,
    );

    return HttpResponse.json(
      wrap({
        recommendationId: recommendation.recommendationId,
        travelSchedule: recommendation.travelSchedule,
        startDate: recommendation.startDate,
        endDate: recommendation.endDate,
        batchSize: BATCH_SIZE,
        minimumSelectionCount: recommendation.minimumSelectionCount,
        selectedPlaceCount,
        selectionReady:
          selectedPlaceCount >= recommendation.minimumSelectionCount,
        // 아직 도달하지 않은 회차는 실제 서버도 미리 안 내려주므로 현재까지만 노출
        batches: recommendation.batches.slice(
          0,
          recommendation.currentBatchIndex + 1,
        ),
      }),
    );
  }),

  http.post(`${BASE_URL}/api/v1/recommendations/sets`, async ({ request }) => {
    await delay(900);
    const body =
      (await request.json()) as Partial<CreateRecommendationSetRequest>;

    if (!body.travelSchedule || !body.startDate || !body.endDate) {
      return HttpResponse.json(
        {
          code: "RECOMMENDATION400",
          data: null,
          message: "여행 기간이 올바르지 않습니다.",
          success: false,
        },
        { status: 400 },
      );
    }

    const isSameSchedule =
      recommendation &&
      recommendation.travelSchedule === body.travelSchedule &&
      recommendation.startDate === body.startDate &&
      recommendation.endDate === body.endDate;

    if (!isSameSchedule) {
      recommendation = {
        recommendationId: nextRecommendationId,
        travelSchedule: body.travelSchedule,
        startDate: body.startDate,
        endDate: body.endDate,
        minimumSelectionCount:
          MINIMUM_SELECTION_COUNT[body.travelSchedule] ?? 3,
        batches: buildBatches(),
        currentBatchIndex: 0,
      };
      nextRecommendationId += 1;
    }

    // 위에서 없으면 새로 만들고 있으면 그대로 두므로 이 시점엔 항상 존재한다
    const active = recommendation!;
    const current = active.batches[active.currentBatchIndex];

    return HttpResponse.json(
      wrap({
        recommendationId: active.recommendationId,
        travelSchedule: active.travelSchedule,
        startDate: active.startDate,
        endDate: active.endDate,
        minimumSelectionCount: active.minimumSelectionCount,
        batch: current,
      }),
    );
  }),

  http.post(
    `${BASE_URL}/api/v1/recommendations/:recommendationId/reactions`,
    async ({ params, request }) => {
      await delay(500);
      const recommendationId = Number(params.recommendationId);
      const body =
        (await request.json()) as Partial<ReplaceBatchReactionsRequest>;

      if (
        !recommendation ||
        recommendation.recommendationId !== recommendationId
      ) {
        return HttpResponse.json(
          {
            code: "RECOMMENDATION404",
            data: null,
            message: "현재 추천을 찾을 수 없습니다.",
            success: false,
          },
          { status: 404 },
        );
      }

      const currentBatch =
        recommendation.batches[recommendation.currentBatchIndex];
      const liked = body.likedPlaceIds ?? [];
      const disliked = body.dislikedPlaceIds ?? [];
      const submittedIds = [...liked, ...disliked];
      const batchIds = currentBatch.places.map((place) => place.placeId);
      const isExactPartition =
        submittedIds.length === batchIds.length &&
        new Set(submittedIds).size === submittedIds.length &&
        batchIds.every((id) => submittedIds.includes(id));

      if (!isExactPartition) {
        return HttpResponse.json(
          {
            code: "RECOMMENDATION400_2",
            data: null,
            message: "추천 회차 반응이 올바르지 않습니다.",
            success: false,
          },
          { status: 400 },
        );
      }

      currentBatch.likedPlaceIds = liked;
      currentBatch.dislikedPlaceIds = disliked;
      currentBatch.completed = true;

      const selectedPlaceCount = recommendation.batches.reduce(
        (sum, batch) => sum + batch.likedPlaceIds.length,
        0,
      );
      const hasNextBatch =
        recommendation.currentBatchIndex + 1 < recommendation.batches.length;
      if (hasNextBatch) recommendation.currentBatchIndex += 1;

      return HttpResponse.json(
        wrap({
          recommendationId: recommendation.recommendationId,
          batchNumber: currentBatch.batchNumber,
          selectedPlaceCount,
          minimumSelectionCount: recommendation.minimumSelectionCount,
          selectionReady:
            selectedPlaceCount >= recommendation.minimumSelectionCount,
          hasNextBatch,
          nextBatch: hasNextBatch
            ? recommendation.batches[recommendation.currentBatchIndex]
            : null,
        }),
      );
    },
  ),
];
