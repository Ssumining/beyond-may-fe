import type { LatLng } from "@/types/map";

/** 두 좌표 간 거리(제곱). 비교용이라 sqrt 생략 — 최근접점 찾기에만 씀 */
const getSquaredDistance = (a: LatLng, b: LatLng): number => {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return dLat * dLat + dLng * dLng;
};

/**
 * 전체 경로에서 현재 위치 "이후"의 남은 경로만 반환한다 (걸어온 부분 제거).
 * 1) path에서 현재 위치와 가장 가까운 점을 찾고
 * 2) 그 점부터 끝까지 남긴 뒤
 * 3) 잘린 앞을 현재 위치로 이어 붙여 선이 끊긴 느낌 없이 매끄럽게 만든다.
 *
 * 좌표가 자주 갱신되는(체험 모드 50ms) 상황에서 호출돼 선이 야금야금 줄어든다.
 */
export const getRemainingRoute = (
  path: LatLng[],
  current: LatLng,
): LatLng[] => {
  if (path.length === 0) return [];

  let nearestIndex = 0;
  let minDistance = Infinity;
  path.forEach((point, index) => {
    const distance = getSquaredDistance(point, current);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });

  // 최근접점 이후만 남기고, 맨 앞에 현재 위치를 붙여 이어지게 함
  const remaining = path.slice(nearestIndex);
  return [current, ...remaining];
};
