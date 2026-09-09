import { useQuery } from "@tanstack/react-query";

import { getVisitedPlaces } from "@/services/api/record/recordApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 내 방문 장소 목록 조회 (여행 기록 화면 "방문 장소" 탭). */
const useGetVisitedPlacesQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.RECORD.VISITS(),
    queryFn: getVisitedPlaces,
  });

export default useGetVisitedPlacesQuery;
