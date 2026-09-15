import { useQuery } from "@tanstack/react-query";
import { getCurrentRecommendation } from "@/services/api/recommendation/recommendationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 현재 추천 세트 조회 (GET /recommendations).
 * 장소 선택 화면 재진입 시 이어서 진행할 회차가 있는지 확인하는 데 쓴다.
 * 아직 추천 세트가 없으면(404) data는 null — 새로 만들어야 함을 뜻하는 정상 상태.
 */
const useGetCurrentRecommendationQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATION.CURRENT(),
    queryFn: getCurrentRecommendation,
  });

export default useGetCurrentRecommendationQuery;
