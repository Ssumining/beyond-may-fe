"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeamVisits } from "@/services/api/record/recordApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 팀 방문 기록 조회 (회차별). 여행 기록 상세에서 사용. */
const useGetTeamVisitsQuery = (explorationId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.RECORD.TEAM_VISITS(explorationId),
    queryFn: () => getTeamVisits(explorationId),
    enabled: !!explorationId,
  });

export default useGetTeamVisitsQuery;