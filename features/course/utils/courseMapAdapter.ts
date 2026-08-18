import type { CoursePlace } from "@/types/course";
import type { LatLng, MapMarker, PlaceCategory } from "@/types/map";

/**
 * 코스 장소 배열을 지도 props(마커·경로·중심)로 변환한다.
 * 추천 코스 지도(3.1.1)용 — 방문 상태와 무관하게 order대로 1..N 핀을 찍는다.
 * (탐험 지도의 '방문 제외 번호매김'과 다른 계산이라 별도 어댑터로 둔다)
 */

/**
 * 백엔드 curatedType → 프론트 PlaceCategory 정규화.
 * 대문자 enum(THINKER 등) 및 철자 변형(TINKER)을 흡수하며,
 * 미확정·미매핑 값은 undefined로 두어 핀이 기본색으로 떨어지게 한다.
 * TODO(백엔드 확인): curatedType "TINKER" 철자 확정 시 별칭 정리. (backend)
 */
const CATEGORY_ALIASES: Record<string, PlaceCategory> = {
  thinker: "thinker",
  tinker: "thinker", // 백엔드 철자 대응 (확정 시 제거)
  foodie: "foodie",
  artist: "artist",
  remember: "remember",
};

const normalizeCategory = (
  curatedType: string | undefined,
): PlaceCategory | undefined => {
  if (!curatedType) return undefined;
  return CATEGORY_ALIASES[curatedType.toLowerCase()];
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
 * order 순서 그대로 번호 핀을 찍고, 좌표를 이어 경로선을 만든다.
 * 경로는 현재 장소 좌표 직선 연결이며, 실제 도보 경로는 S2에서 교체한다.
 */
export const getCourseMapData = (places: CoursePlace[]): CourseMapData => {
  const sorted = [...places].sort((a, b) => a.order - b.order);

  const markers: MapMarker[] = sorted.map((place) => ({
    id: place.placeId,
    position: place.location,
    order: place.order,
    label: place.name,
    category: normalizeCategory(place.curatedType),
  }));

  const route = sorted.map((place) => place.location);
  const center =
    route.length > 0 ? getCenter(route) : { lat: 35.1595, lng: 126.8526 };

  return { markers, route, center };
};
