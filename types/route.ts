import type { LatLng } from "@/types/map";

/** Tmap 보행자 경로 요청 (좌표는 문자열로 보냄 — 문서 예시 기준) */
export interface PedestrianRouteRequest {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  startName: string; // URL 인코딩은 호출 함수에서 처리
  endName: string;
}

/** Tmap GeoJSON 응답 — 우리가 쓰는 필드만 정의 */
export interface TmapFeature {
  geometry: {
    type: "Point" | "LineString";
    coordinates: number[] | number[][]; // Point=[lng,lat], LineString=[[lng,lat],...]
  };
  properties: {
    totalDistance?: number; // SP(출발) feature에만 (m)
    totalTime?: number; // SP feature에만 (초)
    pointType?: string;
  };
}

export interface TmapPedestrianResponse {
  type: "FeatureCollection";
  features: TmapFeature[];
}

/** 파싱 후 앱에서 실제 사용하는 형태 */
export interface WalkRoute {
  path: LatLng[]; // 지도 Polyline에 그대로 넘김
  totalDistance: number; // m
  totalTime: number; // 초
}
