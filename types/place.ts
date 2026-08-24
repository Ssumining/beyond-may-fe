import type { PlaceCategory } from "./map";

/** 장소 상세 조회 응답 */
export interface PlaceDetailResponse {
  placeId: string;
  name: string;
  address: string;
  /** 장소 사진 목록. 1장 이상, 여러 장이면 캐러셀로 넘겨볼 수 있음 */
  images: string[];
  // TODO(백엔드 확인): 운영시간 응답 포맷 미확정, 우선 문자열로 가정
  operatingHours?: string;
  tags: string[];
  description: string;
  // TODO(백엔드 확인): 5·18 관련 장소 판별 필드명·형식 미확정, 우선 boolean으로 가정
  isMemorialSite: boolean;
  category: PlaceCategory;
}
