import { useQuery } from "@tanstack/react-query";
import { getPlaceRecommendations } from "@/services/api/place/placeApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 장소 추천 목록 조회 (GET /places/recommendations?type=).
 * type(사용자 성향)이 없으면 조회하지 않음.
 */
const useGetPlaceRecommendationsQuery = (type: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.PLACE.RECOMMENDATIONS(type ?? ""),
    queryFn: () => getPlaceRecommendations(type as string),
    enabled: !!type,
  });

export default useGetPlaceRecommendationsQuery;