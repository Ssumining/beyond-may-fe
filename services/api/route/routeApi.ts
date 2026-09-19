import axios from "axios";
import { ENV } from "@/lib/env";
import type {
  PedestrianRouteRequest,
  TmapPedestrianResponse,
  WalkRoute,
} from "@/types/route";
import type { LatLng } from "@/types/map";

/**
 * Tmap 전용 axios 인스턴스.
 * 공통 api 인스턴스(success 래퍼·Bearer 토큰·401 처리)와 완전히 분리한다.
 * Tmap은 appKey 헤더 인증에 응답도 GeoJSON 원본이라 공통 인터셉터를 타면 안 됨.
 */
const tmapClient = axios.create({
  baseURL: "https://apis.openapi.sk.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    appKey: ENV.TMAP_APP_KEY,
  },
});

/** GeoJSON 응답을 지도에서 쓸 WalkRoute로 변환 ([lng,lat] → {lat,lng} 뒤집기) */
const parseWalkRoute = (data: TmapPedestrianResponse): WalkRoute => {
  const path: LatLng[] = [];
  let totalDistance = 0;
  let totalTime = 0;

  data.features.forEach((feature) => {
    if (feature.properties.pointType === "SP") {
      totalDistance = feature.properties.totalDistance ?? 0;
      totalTime = feature.properties.totalTime ?? 0;
    }
    if (feature.geometry.type === "LineString") {
      (feature.geometry.coordinates as number[][]).forEach(([lng, lat]) => {
        path.push({ lat, lng });
      });
    }
  });

  return { path, totalDistance, totalTime };
};

/** 현재 위치 → 목적지 보행자 경로 조회 */
export const postPedestrianRoute = async (
  params: PedestrianRouteRequest,
): Promise<WalkRoute> => {
  const response = await tmapClient.post<TmapPedestrianResponse>(
    "/tmap/routes/pedestrian?version=1",
    {
      ...params,
      startName: encodeURIComponent(params.startName),
      endName: encodeURIComponent(params.endName),
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      searchOption: "0",
    },
  );
  return parseWalkRoute(response.data);
};
