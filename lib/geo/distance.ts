/**
 * 방문 인증(명세 4.3.3)용 좌표 거리 계산 유틸.
 * 클라이언트 거리 계산은 버튼 활성화·거리 표시용,
 * 실제 인증 판정은 서버가 좌표를 재검증.
 */

/** 인증 가능 반경 (미터). */
// TODO: 인증 반경 확정값 명기 (명세 4.3.3 "100m 제안", 백엔드/팀 결정) (backend)
export const VISIT_RADIUS_METERS = 100;

interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * 두 좌표 사이의 실제 거리(미터)를 Haversine 공식으로 계산.
 * 지구를 구로 근사하며, 수백 m~수 km 범위에서 충분히 정확.
 */
export const getDistanceInMeters = (
  from: Coordinates,
  to: Coordinates,
): number => {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};

/** 대상 좌표가 인증 반경 안에 있는지 여부. */
export const isWithinVisitRadius = (
  current: Coordinates,
  target: Coordinates,
  radius: number = VISIT_RADIUS_METERS,
): boolean => getDistanceInMeters(current, target) <= radius;

/**
 * 남은 거리 표시용 문자열 (명세 4.3.3 "약 Nm 남음").
 * 1km 이상은 km, 미만은 m 단위로 반올림.
 */
export const formatRemainingDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `약 ${(meters / 1000).toFixed(1)}km 남음`;
  }
  return `약 ${Math.round(meters)}m 남음`;
};
