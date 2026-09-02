"use client";

import { useState } from "react";
import KakaoMap from "@/components/map/Map";
import MyLocationButton from "@/components/map/MyLocationButton";
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

  const [panTo, setPanTo] = useState<LatLng | null>(null);
  const [panToNonce, setPanToNonce] = useState(0);

  const myLocation =
    coordinates && isAccurate ? toLatLng(coordinates) : undefined;

  const center = myLocation ?? GWANGJU_CENTER;

  const handleMyLocation = (): void => {
    if (!coordinates) return;
    setPanTo(toLatLng(coordinates));
    setPanToNonce((prev) => prev + 1);
  };

  if (mapError) {
    return (
      <div className="text-neutral-05 p-4">
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
        panTo={panTo}
        panToNonce={panToNonce}
        onError={() => setMapError(true)}
      />

      {coordinates && (
        <MyLocationButton
          onClick={handleMyLocation}
          className="absolute right-4 bottom-6 z-30"
        />
      )}

      {permission === "denied" && (
        <div className="text-neutral-01 absolute inset-x-0 top-0 bg-black/70 p-3 text-center text-sm">
          위치 권한이 꺼져 있어요. 방문 인증·주변 추천을 쓰려면 권한을 허용해
          주세요.
        </div>
      )}

      {permission === "granted" && !isAccurate && (
        <div className="text-neutral-01 absolute inset-x-0 top-0 bg-black/50 p-3 text-center text-sm">
          위치를 확인하고 있어요…
        </div>
      )}
    </div>
  );
};

export default ExploreMap;
