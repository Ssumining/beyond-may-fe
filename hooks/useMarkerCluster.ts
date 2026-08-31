import { useEffect, useMemo, useState } from "react";

import type { LatLng, MapMarker } from "@/types/map";

/** 이 픽셀 거리 이내로 겹치는 미방문 마커끼리 하나로 묶는다 */
const CLUSTER_PIXEL_DISTANCE = 44;

export interface MarkerCluster {
  id: string;
  position: LatLng;
  count: number;
  markerIds: string[];
}

interface UseMarkerClusterResult {
  clusters: MarkerCluster[];
  singles: MapMarker[];
}

/**
 * 지도 화면상 겹치는 마커를 픽셀 거리 기준으로 묶는다.
 * - 대상: 넘어온 마커만 (미방문 물방울). 깃발·방문완료는 호출부에서 제외.
 * - 화면 픽셀 기준이라 확대하면 거리가 벌어져 자동으로 클러스터가 풀린다.
 * - 지도 idle(드래그·줌 종료) 때마다 재계산한다.
 */
const useMarkerCluster = (
  map: kakao.maps.Map | null,
  markers: MapMarker[],
): UseMarkerClusterResult => {
  // 지도 뷰가 바뀔 때마다(idle) 이 값을 올려 재계산을 유발한다.
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
    if (!map) return { clusters: [], singles: markers };

    const projection = map.getProjection();

    const points = markers.map((marker) => {
      const point = projection.pointFromCoords(
        new window.kakao.maps.LatLng(marker.position.lat, marker.position.lng),
      );
      return { marker, x: point.x, y: point.y };
    });

    const used = new Array(points.length).fill(false);
    const clusters: MarkerCluster[] = [];
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
        singles.push(group[0].marker);
      } else {
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
      }
    }

    return { clusters, singles };
    // viewVersion이 바뀌면(지도 이동/줌) 재계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, markers, viewVersion]);
};

export default useMarkerCluster;
