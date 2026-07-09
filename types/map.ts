/* 좌표 한 쌍 — 지도 어디서나 쓰는 기본 단위 */
export interface LatLng {
  lat: number;
  lng: number;
}

/* 지도에 찍는 핀 하나 */
export interface MapMarker {
  id: string; // 장소 식별자 (클릭 시 어떤 장소인지 구분)
  position: LatLng; // 핀 위치
  order?: number; // 코스 순서 번호 (코스 지도용)
  visited?: boolean; // 방문 여부 (탐험·밝힌 지도용)
  label?: string; // 핀에 띄울 이름
}

/* <Map> 컴포넌트가 받는 props */
export interface MapProps {
  center: LatLng; // 지도 중심
  markers: MapMarker[]; // 찍을 핀들
  route?: LatLng[]; // 경로선 (코스·탐험용)
  myLocation?: LatLng; // 내 현재 위치 (탐험 GPS)
  level?: number; // 확대 레벨 (작을수록 확대, 1~14)
  fitBounds?: boolean; // 최초 1회 마커·경로가 모두 보이도록 범위 자동 조정 (기본 true)
  onMarkerClick?: (markerId: string) => void; // 핀 클릭 시 동작
  glow?: boolean; // 방문 핀에 빛 효과 (탐험 지도만 켬)
  className?: string; // 크기·여백 등 스타일 주입
}
