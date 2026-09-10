"use client";

import { useState } from "react";
import KakaoMap from "@/components/map/Map";
import MyLocationButton from "@/components/map/MyLocationButton";
import PlaceDetailSheet from "@/components/place-detail/PlaceDetailSheet";
import VisitFooter from "@/features/explore/components/VisitFooter";
import useGetPlaceDetailQuery from "@/features/explore/hooks/useGetPlaceDetailQuery";
import type { CoursePlace } from "@/types/course";
import type { MapMarker, LatLng } from "@/types/map";
import type { VisitResponse } from "@/types/exploration";
import { normalizeCategory } from "@/features/course/utils/courseMapAdapter";

interface VisitMapProps {
  explorationId: number;
  places: CoursePlace[];
  center: LatLng;
  myLocation?: LatLng;
  /** 방문 완료된 placeId 초기 집합. 부모가 visits API(/visits/visited-places)로 채워 내려준다.
   *  방문 여부는 코스 응답에 없으므로 CoursePlace가 아닌 이 prop이 소스다. */
  initialVisitedPlaceIds?: number[];
}

const VisitMap = ({
  explorationId,
  places,
  center,
  myLocation,
  initialVisitedPlaceIds = [],
}: VisitMapProps) => {
  // 로컬 방문 상태 (인증 성공 시 갱신 → 핀 컬러 전환)
  const [visitedPlaceIds, setVisitedPlaceIds] = useState<Set<number>>(
    () => new Set(initialVisitedPlaceIds),
  );

  // 선택된 장소의 placeId (핀 클릭 시). null이면 시트 닫힘
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // 내 위치로 이동 트리거
  const [panTo, setPanTo] = useState<LatLng | null>(null);
  const [panToNonce, setPanToNonce] = useState(0);

  const { data: placeDetail, isPending: isPlaceDetailPending } =
    useGetPlaceDetailQuery(selectedPlaceId);

  // CoursePlace → 지도 마커 변환
  const markers: MapMarker[] = places.map((place) => ({
    id: String(place.placeId),
    position: { lat: place.latitude, lng: place.longitude },
    order: place.visitOrder,
    visited: visitedPlaceIds.has(place.placeId),
    category: normalizeCategory(place.travelMbtiType),
  }));

  const handleMarkerClick = (markerId: string): void => {
    const numericId = Number(markerId);
    if (Number.isNaN(numericId)) return;
    setTimeout(() => setSelectedPlaceId(numericId), 0);
  };

  const handleVisitSuccess = (response: VisitResponse): void => {
    // 인증된 장소를 방문 처리 → 핀 컬러 전환
    setVisitedPlaceIds((prev) => {
      const next = new Set(prev);
      next.add(response.placeId);
      return next;
    });
    // TODO: STOMP로 팀 전체에 전파 (소켓 연결 후)
  };

  const handleClose = (): void => setSelectedPlaceId(null);

  // 내 위치로 버튼 — 현재 위치로 지도 이동 (같은 위치 반복 대응 nonce)
  const handleMyLocation = (): void => {
    if (!myLocation) return;
    setPanTo(myLocation);
    setPanToNonce((prev) => prev + 1);
  };

  const isSelectedVisited =
    selectedPlaceId !== null && visitedPlaceIds.has(selectedPlaceId);

  return (
    <div className="relative h-dvh w-full">
      <KakaoMap
        center={center}
        markers={markers}
        myLocation={myLocation}
        panTo={panTo}
        panToNonce={panToNonce}
        glow
        onMarkerClick={handleMarkerClick}
      />

      {myLocation && (
        <MyLocationButton
          onClick={handleMyLocation}
          className="absolute right-4 bottom-6 z-30"
        />
      )}

      {selectedPlaceId !== null && (
        <div className="fixed inset-0 z-50">
          {/* 오버레이 */}
          <div
            className="absolute inset-0 bg-black/12 backdrop-blur-xl"
            onClick={handleClose}
            aria-hidden="true"
          />
          {/* 시트 영역 */}
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px]">
            {isPlaceDetailPending || !placeDetail ? (
              <div className="bg-white-01 rounded-t-2xl p-6 text-center">
                <p className="text-neutral-04 text-sm">
                  장소 정보를 불러오고 있어요…
                </p>
              </div>
            ) : (
              <PlaceDetailSheet
                place={placeDetail}
                footer={
                  <VisitFooter
                    placeId={placeDetail.placeId}
                    latitude={placeDetail.latitude}
                    longitude={placeDetail.longitude}
                    isVisited={isSelectedVisited}
                    explorationId={explorationId}
                    onVisitSuccess={handleVisitSuccess}
                    onClose={handleClose}
                  />
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitMap;
