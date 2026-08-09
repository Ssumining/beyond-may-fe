"use client";

import { useEffect, useRef, useState } from "react";
import { CustomOverlayMap, Map, Polyline } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import MapPin from "@/components/map/MapPin";
import { cn } from "@/lib/cn";
import type { MapProps, PlaceCategory } from "@/types/map";

// 경로선 색상 (--color-accent-route와 동일)
// 카카오맵 Polyline strokeColor는 CSS 변수를 못 받아 hex 직접 지정
const ROUTE_STROKE_COLOR = "#ffc9d7";
const ROUTE_STROKE_WEIGHT = 3;

// 유형 ↔ 색 매핑
// TODO(임시): 색을 RGB로 관리 중.
// 디자인에서 투명도 확정되면 globals.css에 --color-type-*-rgb 추가하고
// rgba(var(--color-type-thinker-rgb), 투명도)로 이전할 것
const CATEGORY_COLORS: Record<PlaceCategory, string> = {
  thinker: "160, 126, 234", // 사색러 (purple-02)
  foodie: "255, 194, 141", // 미식러 (orange-02)
  artist: "236, 244, 162", // 예술러 (green-01)
  remember: "183, 202, 255", // 기억러 (blue-01)
};
const DEFAULT_COLOR = CATEGORY_COLORS.thinker; // category 미확정 장소용

const GLOW_SIZE = 250;
const GLOW_OPACITY_INNER = 0.55;
const GLOW_OPACITY_MID = 0.2;

// 레이어 순서: glow(배경) < 경로선 < 내 위치 < 핀 < 다음 목적지(최상단)
const Z_INDEX_GLOW = 1;
const Z_INDEX_ROUTE = 3;
const Z_INDEX_MY_LOCATION = 5;
const Z_INDEX_PIN = 10;
const Z_INDEX_PIN_CURRENT = 20;

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
  myLocation,
  level = 6,
  fitBounds = true,
  glow = false,
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
          zIndex={Z_INDEX_ROUTE}
        />
      )}

      {glow &&
        markers
          .filter((marker) => marker.visited)
          .map((marker) => {
            const color = marker.category
              ? CATEGORY_COLORS[marker.category]
              : DEFAULT_COLOR;

            return (
              <CustomOverlayMap
                key={`glow-${marker.id}`}
                position={marker.position}
                xAnchor={0.5}
                yAnchor={0.5}
                zIndex={Z_INDEX_GLOW}
              >
                <div
                  style={{
                    width: GLOW_SIZE,
                    height: GLOW_SIZE,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(${color}, ${GLOW_OPACITY_INNER}) 0%, rgba(${color}, ${GLOW_OPACITY_MID}) 40%, rgba(${color}, 0) 70%)`,
                    pointerEvents: "none",
                  }}
                />
              </CustomOverlayMap>
            );
          })}

      {myLocation && (
        <CustomOverlayMap
          position={myLocation}
          xAnchor={0.5}
          yAnchor={0.5}
          zIndex={Z_INDEX_MY_LOCATION}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="animate-location-pulse absolute rounded-full"
              style={{
                width: 36,
                height: 36,
                backgroundColor: "rgba(var(--color-location-rgb), 0.35)",
              }}
            />
            <span
              className="rounded-full border-2 border-white"
              style={{
                width: 16,
                height: 16,
                backgroundColor: "var(--color-location)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </CustomOverlayMap>
      )}

      {markers.map((marker) => {
        const color = marker.category
          ? CATEGORY_COLORS[marker.category]
          : DEFAULT_COLOR;
        const state = marker.visited
          ? "visited"
          : marker.isCurrent
            ? "current"
            : "default";

        return (
          <CustomOverlayMap
            key={marker.id}
            position={marker.position}
            xAnchor={state === "current" ? 0.05 : 0.5}
            yAnchor={state === "current" ? 1 : 0.9}
            zIndex={state === "current" ? Z_INDEX_PIN_CURRENT : Z_INDEX_PIN}
          >
            {/* CustomOverlayMap은 onClick을 지원하지 않아 래퍼로 처리 */}
            <div
              className="cursor-pointer"
              onClick={() => onMarkerClick?.(marker.id)}
            >
              <MapPin order={marker.order} color={color} state={state} />
            </div>
          </CustomOverlayMap>
        );
      })}
    </Map>
  );
};

export default KakaoMap;
