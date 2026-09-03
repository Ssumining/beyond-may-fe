import { useQuery } from "@tanstack/react-query";
import { getPlaceRecommendations } from "@/services/api/place/placeApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 장소 카드덱 추천 목록 조회 (GET /places/recommendations).
 * 장소 선택 화면(2.1.1)의 카드덱 데이터 소스.
 */
const useGetPlaceRecommendationsQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.PLACE.RECOMMENDATIONS(),
    queryFn: getPlaceRecommendations,
  });

export default useGetPlaceRecommendationsQuery;
