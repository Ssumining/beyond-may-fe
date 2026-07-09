"use client";

import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { cn } from "@/lib/cn";
import type { MapProps } from "@/types/map";

// TODO(디자인 확정 후 수정): 경로선 색상·굵기는 임시값
const ROUTE_STROKE_COLOR = "#FFC147";
const ROUTE_STROKE_WEIGHT = 4;

/**
 * 카카오 지도 베이스 컴포넌트.
 * 마커·경로·방문 효과를 props로 받아 그리며, 탐험·코스 화면이 공용으로 사용한다.
 *
 * 크기는 부모가 결정한다. 반응형 처리도 부모에서 하며,
 * 부모에 높이가 없으면 지도가 렌더되지 않으니 주의.
 *
 * @example
 * <div className="h-[50vh] md:h-[70vh]">
 *   <KakaoMap center={center} markers={markers} onMarkerClick={handleMarkerClick} />
 * </div>
 */
const KakaoMap = ({
  center,
  markers,
  route,
  level = 6,
  fitBounds = true,
  onMarkerClick,
  className,
}: MapProps) => {
  const [loading, error] = useKakaoLoader();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const hasFitted = useRef(false);

  // 마커·경로가 모두 보이도록 지도 범위를 최초 1회 맞춘다.
  // 이후에는 사용자의 확대·이동 조작을 덮어쓰지 않는다.
  useEffect(() => {
    if (!map || !fitBounds || hasFitted.current) return;

    const positions = [
      ...markers.map((marker) => marker.position),
      ...(route ?? []),
    ];
    if (positions.length < 2) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    positions.forEach(({ lat, lng }) => {
      bounds.extend(new window.kakao.maps.LatLng(lat, lng));
    });
    map.setBounds(bounds);
    hasFitted.current = true;
  }, [map, fitBounds, markers, route]);

  if (error)
    return <div className="p-4 text-red-500">지도를 불러오지 못했어요.</div>;
  if (loading)
    return <div className="p-4 text-gray-500">지도 불러오는 중…</div>;

  const hasRoute = route !== undefined && route.length >= 2;

  return (
    <Map
      center={center}
      level={level}
      className={cn("h-full w-full", className)}
      onCreate={setMap}
    >
      {hasRoute && (
        <Polyline
          path={route}
          strokeWeight={ROUTE_STROKE_WEIGHT}
          strokeColor={ROUTE_STROKE_COLOR}
          strokeOpacity={0.9}
          strokeStyle="solid"
        />
      )}

      {markers.map((marker) => (
        <MapMarker
          key={marker.id}
          position={marker.position}
          title={marker.label}
          onClick={() => onMarkerClick?.(marker.id)}
        />
      ))}
    </Map>
  );
};

export default KakaoMap;
