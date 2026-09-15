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

export const getPlaceRecommendations = async (
  type: string,
): Promise<PlaceRecommendationResponse[]> => {
  const res = await api.get<{ places: PlaceRecommendationResponse[] }>(
    API_ENDPOINTS.place.recommendations(type),
  );
  return res.data?.places ?? [];
};
