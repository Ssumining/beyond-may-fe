import type { LatLng } from "@/types/map";
import type { Coordinates } from "@/stores/geolocationStore";

/** geolocationStore 좌표(Coordinates) → 지도 좌표(LatLng) 변환 */
export const toLatLng = (coordinates: Coordinates): LatLng => ({
  lat: coordinates.latitude,
  lng: coordinates.longitude,
});
