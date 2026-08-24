"use client";

import { useState } from "react";
import KakaoMap from "@/components/map/Map";
import VisitSheet from "@/features/explore/components/VisitSheet";
import type { CoursePlace } from "@/types/course";
import type { MapMarker, LatLng } from "@/types/map";
import type { VisitResponse } from "@/types/exploration";

interface VisitMapProps {
  explorationId: number;
  places: CoursePlace[];
  center: LatLng;
  myLocation?: LatLng;
}

const VisitMap = ({
  explorationId,
  places,
  center,
  myLocation,
}: VisitMapProps) => {
  // 로컬 방문 상태 (인증 성공 시 갱신 → 핀 컬러 전환)
  const [visitedPlaceIds, setVisitedPlaceIds] = useState<Set<string>>(
    () =>
      new Set(
        places.filter((p) => p.visitStatus.isVisited).map((p) => p.placeId),
      ),
  );

  const [selectedPlace, setSelectedPlace] = useState<CoursePlace | null>(null);

  // CoursePlace → 지도 마커 변환
  const markers: MapMarker[] = places.map((place) => ({
    id: place.placeId,
    position: place.location,
    order: place.order,
    visited: visitedPlaceIds.has(place.placeId),
    category: place.curatedType,
  }));

  const handleMarkerClick = (markerId: string): void => {
    const place = places.find((p) => p.placeId === markerId);
    if (place) {
      // 카카오맵 이벤트 사이클 밖에서 상태 변경 → 즉시 리렌더
      setTimeout(() => setSelectedPlace(place), 0);
    }
  };

  const handleVisitSuccess = (response: VisitResponse): void => {
    // 인증된 장소를 방문 처리 → 핀 컬러 전환
    setVisitedPlaceIds((prev) => {
      const next = new Set(prev);
      next.add(String(response.placeId));
      return next;
    });
    // TODO: STOMP로 팀 전체에 전파 (소켓 연결 후)
  };

  return (
    <div className="relative h-[100dvh] w-full">
      <KakaoMap
        center={center}
        markers={markers}
        myLocation={myLocation}
        glow
        onMarkerClick={handleMarkerClick}
      />

      {selectedPlace && (
        <div className="relative z-50">
          <VisitSheet
            place={selectedPlace}
            explorationId={explorationId}
            onVisitSuccess={handleVisitSuccess}
            onClose={() => setSelectedPlace(null)}
          />
        </div>
      )}
    </div>
  );
};

export default VisitMap;
