"use client";

import { useState } from "react";
import KakaoMap from "@/components/map/Map";
import useGeolocation from "@/features/explore/hooks/useGeolocation";
import useGeolocationStore from "@/stores/geolocationStore";
import { toLatLng } from "@/features/explore/utils/toLatLng";
import type { LatLng } from "@/types/map";

/** 광주 중심 좌표 — 위치 취득 전 지도 기본 중심 */
const GWANGJU_CENTER: LatLng = { lat: 35.1595, lng: 126.8526 };

const ExploreMap = () => {
  useGeolocation({ enabled: true });

  const coordinates = useGeolocationStore((state) => state.coordinates);
  const permission = useGeolocationStore((state) => state.permission);
  const isAccurate = useGeolocationStore((state) => state.isAccurate);

  const [mapError, setMapError] = useState(false);

  // 좌표 있고 정확도 기준 통과 시에만 내 위치 마커 표시
  const myLocation =
    coordinates && isAccurate ? toLatLng(coordinates) : undefined;

  const center = myLocation ?? GWANGJU_CENTER;

  if (mapError) {
    return (
      <div className="p-4 text-gray-500">
        지도를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full">
      <KakaoMap
        center={center}
        markers={[]}
        myLocation={myLocation}
        onError={() => setMapError(true)}
      />

      {permission === "denied" && (
        <div className="absolute inset-x-0 top-0 bg-black/70 p-3 text-center text-sm text-white">
          위치 권한이 꺼져 있어요. 방문 인증·주변 추천을 쓰려면 권한을 허용해
          주세요.
        </div>
      )}

      {permission === "granted" && !isAccurate && (
        <div className="absolute inset-x-0 top-0 bg-black/50 p-3 text-center text-sm text-white">
          위치를 확인하고 있어요…
        </div>
      )}
    </div>
  );
};

export default ExploreMap;
