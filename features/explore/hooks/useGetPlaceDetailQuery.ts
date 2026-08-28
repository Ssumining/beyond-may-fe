import { useQuery } from "@tanstack/react-query";
import { getPlaceDetail } from "@/services/api/place/placeApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 장소 상세 조회 (GET /places/{placeId}).
 * 방문 인증 시트에서 핀 클릭한 장소의 상세 정보(이름·태그·설명·좌표)를 가져옴.
 * enabled로 placeId가 있을 때만 조회.
 */
const useGetPlaceDetailQuery = (placeId: number | null) =>
  useQuery({
    queryKey: QUERY_KEYS.PLACE.DETAIL(placeId ?? 0),
    queryFn: () => getPlaceDetail(placeId as number),
    enabled: placeId !== null,
  });

export default useGetPlaceDetailQuery;
