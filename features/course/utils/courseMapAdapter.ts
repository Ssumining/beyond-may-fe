import type { TravelMbtiType, CoursePlace } from "@/types/course";
import type { LatLng, MapMarker, PlaceCategory } from "@/types/map";

/**
 * 코스 장소 배열을 지도 props(마커·경로·중심)로 변환한다.
 * 추천 코스 지도(3.1.1)용 — 방문 상태와 무관하게 visitOrder대로 1..N 핀을 찍는다.
 * (탐험 지도의 '방문 제외 번호매김'과 다른 계산이라 별도 어댑터로 둔다)
 */

/**
 * 백엔드 travelMbtiType(대문자) → 프론트 PlaceCategory(소문자) 정규화.
 * API는 REMEMBERER(er 둘)로 오지만 색 토큰·지도 매핑은 remember(er 하나)라
 * rememberer→remember 별칭으로 흡수한다. 미확정·미매핑 값은 undefined로 두어
 * 핀이 기본색으로 떨어지게 한다.
 */
const CATEGORY_ALIASES: Record<string, PlaceCategory> = {
  thinker: "thinker",
  foodie: "foodie",
  artist: "artist",
  remember: "remember",
  rememberer: "remember", // REMEMBERER(대문자 raw) 소문자화 대응
};

export const normalizeCategory = (
  travelMbtiType: TravelMbtiType | undefined,
): PlaceCategory | undefined => {
  if (!travelMbtiType) return undefined;
  return CATEGORY_ALIASES[travelMbtiType.toLowerCase()];
};

/** 좌표 배열의 평균점 (지도 초기 center용, fitBounds 전 임시 중심) */
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
 * 추천 코스 지도용 변환.
 * visitOrder 순서대로 번호 핀을 찍고, 좌표를 이어 경로선을 만든다.
 * 경로는 현재 장소 좌표 직선 연결이며, 실제 도보 경로는 후속(5번)에서 교체한다.
 */
export const getCourseMapData = (places: CoursePlace[]): CourseMapData => {
  const sorted = [...places].sort((a, b) => a.visitOrder - b.visitOrder);

  const markers: MapMarker[] = sorted.map((place) => ({
    id: String(place.placeId),
    position: { lat: place.latitude, lng: place.longitude },
    order: place.visitOrder,
    label: place.name,
    category: normalizeCategory(place.travelMbtiType),
  }));

  const route = markers.map((marker) => marker.position); // sorted → markers
  const center =
    route.length > 0 ? getCenter(route) : { lat: 35.1595, lng: 126.8526 };

  return { markers, route, center };
};
