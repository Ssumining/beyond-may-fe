import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type { VisitedPlaceRecordListResponse } from "@/types/record";

/** 내 방문 장소 목록을 조회한다 (여행 기록 화면, 장소×사용자 단위). */
export const getVisitedPlaces =
  async (): Promise<VisitedPlaceRecordListResponse> => {
    const response = await api.get<VisitedPlaceRecordListResponse>(
      API_ENDPOINTS.record.visits,
    );
    return response.data!;
  };
