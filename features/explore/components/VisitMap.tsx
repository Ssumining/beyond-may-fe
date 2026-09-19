"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import KakaoMap from "@/components/map/Map";
import type { CoursePlace } from "@/types/course";
import type { MapMarker, LatLng } from "@/types/map";

export interface VisitMapHandle {
  /** 지도 중심을 내 위치로 이동 (하단 시트의 내 위치 버튼에서 호출) */
  panToMyLocation: () => void;
}

interface VisitMapProps {
  places: CoursePlace[];
  center: LatLng;
  myLocation?: LatLng;
  visitedPlaceIds?: number[];
  route?: LatLng[];
  onMarkerClick?: (placeId: number) => void;
}

/**
 * 탐험 지도 (KakaoMap 래퍼).
 * 내 위치로 이동은 ref(panToMyLocation)로 노출 — 버튼은 하단 시트가 갖는다.
 */
const VisitMap = forwardRef<VisitMapHandle, VisitMapProps>(
  (
    { places, center, myLocation, visitedPlaceIds = [], route, onMarkerClick },
    ref,
  ) => {
    const [panTo, setPanTo] = useState<LatLng | null>(null);
    const [panToNonce, setPanToNonce] = useState(0);

    const markers: MapMarker[] = places.map((place) => ({
      id: String(place.placeId),
      position: { lat: place.latitude, lng: place.longitude },
      order: place.visitOrder,
      visited: visitedPlaceIds.includes(place.placeId),
      category: place.travelMbtiType,
    }));

    const handleMarkerClick = (markerId: string): void => {
      const numericId = Number(markerId);
      if (Number.isNaN(numericId)) return;
      setTimeout(() => onMarkerClick?.(numericId), 0);
    };

    useImperativeHandle(ref, () => ({
      panToMyLocation: () => {
        if (!myLocation) return;
        setPanTo(myLocation);
        setPanToNonce((prev) => prev + 1);
      },
    }));

    return (
      <div className="relative h-dvh w-full">
        <KakaoMap
          center={center}
          markers={markers}
          myLocation={myLocation}
          route={route}
          panTo={panTo}
          panToNonce={panToNonce}
          glow
          onMarkerClick={handleMarkerClick}
        />
      </div>
    );
  },
);

VisitMap.displayName = "VisitMap";

export default VisitMap;
