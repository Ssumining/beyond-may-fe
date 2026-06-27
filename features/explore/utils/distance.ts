// 두 좌표 사이의 거리를 미터(m) 단위로 계산 (Haversine 공식)
// 방문 인증(4.2.3): 내 위치와 장소 좌표 거리가 인증 반경 이내인지 판정에 사용

interface Coord {
  lat: number;
  lng: number;
}

/* 두 좌표 사이 거리를 미터로 반환 */
export function getDistanceInMeters(a: Coord, b: Coord): number {
  const R = 6371000; // 지구 반지름 (미터)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/* 인증 반경 이내인지 판정 (radius: 미터) */
export function isWithinRadius(
  myLocation: Coord,
  target: Coord,
  radius: number,
): boolean {
  return getDistanceInMeters(myLocation, target) <= radius;
}
