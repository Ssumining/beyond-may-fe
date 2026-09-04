import { useQuery } from "@tanstack/react-query";
import { getPlaceDetail } from "@/services/api/place/placeApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 장소 상세 조회 (GET /places/{placeId}).
 * 카드덱에서 카드를 탭했을 때 PlaceDetailSheet에 표시할 상세 정보 조회.
 * enabled로 placeId가 있을 때만 조회.
 */
const useGetPlaceDetailQuery = (placeId: number | null) =>
  useQuery({
    queryKey: QUERY_KEYS.PLACE.DETAIL(placeId ?? 0),
    queryFn: () => getPlaceDetail(placeId as number),
    enabled: placeId !== null,
  });

export default useGetPlaceDetailQuery;
