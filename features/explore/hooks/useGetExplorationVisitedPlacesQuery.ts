import { useQuery } from "@tanstack/react-query";
import { getVisitedPlaces } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 탐험의 팀 밝힌 장소 조회 (5.2.2). 방문 인증 핀 색 판단용. */
const useGetExplorationVisitedPlacesQuery = (explorationId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.EXPLORATION.VISITED_PLACES(explorationId),
    queryFn: () => getVisitedPlaces(explorationId),
    enabled: explorationId.length > 0, // 빈 문자열이면 조회 안 함
  });

export default useGetExplorationVisitedPlacesQuery;
