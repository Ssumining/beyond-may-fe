import type { CoursePlace } from "@/types/course";
import type { LatLng, MapMarker } from "@/types/map";

const getCenter = (positions: LatLng[]): LatLng => {
  const { lat, lng } = positions.reduce(
    (acc, position) => ({
      lat: acc.lat + position.lat,
      lng: acc.lng + position.lng,
    }),
    { lat: 0, lng: 0 },
  );
  const count = positions.length;
  return { lat: lat / count, lng: lng / count };
};

export interface CourseMapData {
  markers: MapMarker[];
  route: LatLng[];
  center: LatLng;
}

/**
 * 추천 코스 지도용 변환 (3.1.1).
 * dayNumber → visitOrder 순으로 정렬하고, 그 순서대로 1..N 통합 번호를 매긴다.
 * (visitOrder는 day별로 리셋돼 값이 겹치므로, 전체 순번은 정렬 후 index로 다시 부여)
 */
export const getCourseMapData = (places: CoursePlace[]): CourseMapData => {
  const sorted = [...places].sort(
    (a, b) => a.dayNumber - b.dayNumber || a.visitOrder - b.visitOrder,
  );

  const markers: MapMarker[] = sorted.map((place, index) => ({
    id: String(place.placeId),
    position: { lat: place.latitude, lng: place.longitude },
    order: index + 1, // 정렬된 전체 순서대로 1..N (day 넘어가도 이어짐)
    label: place.name,
    category: place.travelMbtiType,
  }));

  // 3.1.1 미리보기: 순서 흐름을 점선으로 연결 (실제 도보 경로는 탐험 지도에서)
  const route: LatLng[] = sorted.map((place) => ({
    lat: place.latitude,
    lng: place.longitude,
  }));

  const center =
    markers.length > 0
      ? getCenter(markers.map((marker) => marker.position))
      : { lat: 35.1595, lng: 126.8526 };

  return { markers, route, center };
};
