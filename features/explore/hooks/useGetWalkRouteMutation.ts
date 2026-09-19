import { useMutation } from "@tanstack/react-query";

import { postPedestrianRoute } from "@/services/api/route/routeApi";
import type { LatLng } from "@/types/map";
import type { WalkRoute } from "@/types/route";

interface WalkRouteParams {
  start: LatLng;
  end: LatLng;
  startName?: string;
  endName?: string;
}

/**
 * 현재 위치 → 목적지 보행자 경로 조회 (Tmap).
 * '도보 길찾기' 버튼 클릭 시 1회 호출이라 query 대신 mutation.
 * 성공 시 받은 WalkRoute를 호출처에서 지도 경로선으로 표시.
 */
const useGetWalkRouteMutation = () =>
  useMutation<WalkRoute, Error, WalkRouteParams>({
    mutationFn: ({ start, end, startName = "현재 위치", endName = "목적지" }) =>
      postPedestrianRoute({
        startX: String(start.lng), // X=경도, Y=위도 (뒤집힘 주의)
        startY: String(start.lat),
        endX: String(end.lng),
        endY: String(end.lat),
        startName,
        endName,
      }),
  });

export default useGetWalkRouteMutation;
