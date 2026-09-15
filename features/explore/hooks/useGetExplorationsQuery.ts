"use client";

import { useQuery } from "@tanstack/react-query";

import { getExplorations } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 상태별 탐험(여행) 목록 조회 — 여행 기록·코스 허브에서 사용. */
const useGetExplorationsQuery = (status: "ONGOING" | "COMPLETED") =>
  useQuery({
    queryKey: QUERY_KEYS.EXPLORATION.LIST(status),
    queryFn: () => getExplorations(status),
  });

export default useGetExplorationsQuery;