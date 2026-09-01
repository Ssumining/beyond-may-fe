import { useEffect, useMemo, useState } from "react";

import type { LatLng, MapMarker } from "@/types/map";

/** 이 픽셀 거리 이내로 겹치는 미방문 마커끼리 한 그룹으로 본다 */
const CLUSTER_PIXEL_DISTANCE = 44;
/** 이 개수 이상이면 클러스터, 미만이면 오프셋(밀어서 표시) */
const CLUSTER_MIN_COUNT = 4;
/** 오프셋으로 밀어낼 거리 (화면 픽셀) */
const OFFSET_RADIUS = 22;

export interface MarkerCluster {
  id: string;
  position: LatLng;
  count: number;
  markerIds: string[];
}

export interface OffsetMarker {
  marker: MapMarker;
  dx: number; // 화면상 x 밀기 (px)
  dy: number; // 화면상 y 밀기 (px)
}

export interface OffsetGroup {
  id: string;
  markers: OffsetMarker[];
}

interface UseMarkerClusterResult {
  clusters: MarkerCluster[];
  offsetGroups: OffsetGroup[];
  singles: MapMarker[];
}

/**
 * 지도 화면상 겹치는 마커를 픽셀 거리 기준으로 분류한다.
 * - 1개: 단독(singles)
 * - 2~3개: 오프셋(offsetGroups) — 안 묶고 방사형으로 살짝 밀어 다 보이게
 * - 4개↑: 클러스터(clusters) — 차콜 원 + 개수로 묶음
 * 화면 픽셀 기준이라 확대하면 거리가 벌어져 자동으로 풀린다.
 * 지도 idle(드래그·줌 종료) 때마다 재계산한다.
 */
const useMarkerCluster = (
  map: kakao.maps.Map | null,
  markers: MapMarker[],
): UseMarkerClusterResult => {
  const [viewVersion, setViewVersion] = useState(0);

  useEffect(() => {
    if (!map) return;
    const handleIdle = () => setViewVersion((v) => v + 1);
    window.kakao.maps.event.addListener(map, "idle", handleIdle);
    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [map]);

  return useMemo<UseMarkerClusterResult>(() => {
    if (!map) return { clusters: [], offsetGroups: [], singles: markers };

    const projection = map.getProjection();

    const points = markers.map((marker) => {
      const point = projection.pointFromCoords(
        new window.kakao.maps.LatLng(marker.position.lat, marker.position.lng),
      );
      return { marker, x: point.x, y: point.y };
    });

    const used = new Array(points.length).fill(false);
    const clusters: MarkerCluster[] = [];
    const offsetGroups: OffsetGroup[] = [];
    const singles: MapMarker[] = [];

    for (let i = 0; i < points.length; i++) {
      if (used[i]) continue;
      used[i] = true;

      const group = [points[i]];
      for (let j = i + 1; j < points.length; j++) {
        if (used[j]) continue;
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        if (Math.sqrt(dx * dx + dy * dy) <= CLUSTER_PIXEL_DISTANCE) {
          used[j] = true;
          group.push(points[j]);
        }
      }

      if (group.length === 1) {
        // 단독
        singles.push(group[0].marker);
      } else if (group.length >= CLUSTER_MIN_COUNT) {
        // 4개 이상 → 클러스터
        const avgLat =
          group.reduce((sum, p) => sum + p.marker.position.lat, 0) /
          group.length;
        const avgLng =
          group.reduce((sum, p) => sum + p.marker.position.lng, 0) /
          group.length;
        const markerIds = group.map((p) => p.marker.id);
        clusters.push({
          id: `cluster-${markerIds.join("-")}`,
          position: { lat: avgLat, lng: avgLng },
          count: group.length,
          markerIds,
        });
      } else {
        // 2~3개 → 오프셋 (방사형으로 밀기)
        const offsetMarkers: OffsetMarker[] = group.map((p, index) => {
          const angle = (2 * Math.PI * index) / group.length - Math.PI / 2;
          return {
            marker: p.marker,
            dx: Math.cos(angle) * OFFSET_RADIUS,
            dy: Math.sin(angle) * OFFSET_RADIUS,
          };
        });
        offsetGroups.push({
          id: `offset-${group.map((p) => p.marker.id).join("-")}`,
          markers: offsetMarkers,
        });
      }
    }

    return { clusters, offsetGroups, singles };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, markers, viewVersion]);
};

export default useMarkerCluster;
