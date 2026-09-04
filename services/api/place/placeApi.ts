import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type {
  PlaceDetailResponse,
  PlaceRecommendationResponse,
} from "@/types/place";

export const getPlaceDetail = async (
  placeId: number,
): Promise<PlaceDetailResponse> => {
  const res = await api.get<PlaceDetailResponse>(
    API_ENDPOINTS.place.detail(placeId),
  );
  return res.data!;
};

export const getPlaceRecommendations = async (): Promise<
  PlaceRecommendationResponse[]
> => {
  const res = await api.get<PlaceRecommendationResponse[]>(
    API_ENDPOINTS.place.recommendations,
  );
  return res.data ?? [];
};
