import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type { PlaceDetailResponse } from "@/types/place";

export const getPlaceDetail = async (
  placeId: number,
): Promise<PlaceDetailResponse> => {
  const res = await api.get<PlaceDetailResponse>(
    API_ENDPOINTS.place.detail(placeId),
  );
  return res.data;
};
