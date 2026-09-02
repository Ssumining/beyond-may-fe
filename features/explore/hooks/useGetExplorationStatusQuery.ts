import { useQuery } from "@tanstack/react-query";
import { getExplorationStatus } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 탐험 상태 조회 (4.2.2 / 4.3.2). status로 방문 수 표시 분기. */
const useGetExplorationStatusQuery = (explorationId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.EXPLORATION.STATUS(explorationId),
    queryFn: () => getExplorationStatus(explorationId),
  });

export default useGetExplorationStatusQuery;
