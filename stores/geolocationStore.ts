import { create } from "zustand";

/** 위치 권한 상태 */
export type GeolocationPermission = "prompt" | "granted" | "denied";

/** 현재 좌표 */
export interface Coordinates {
  latitude: number;
  longitude: number;
  /** 위치 정확도 (미터). watchPosition의 accuracy */
  accuracy: number;
}

interface GeolocationState {
  /** 현재 좌표. 아직 취득 전이면 null */
  coordinates: Coordinates | null;
  /** 위치 권한 상태 */
  permission: GeolocationPermission;
  /** 정확도 기준값 통과 여부 (기준 미달 시 마커 표시 보류) */
  isAccurate: boolean;
  /** 위치 취득 중 발생한 에러 메시지 */
  error: string | null;

  setCoordinates: (coordinates: Coordinates) => void;
  setPermission: (permission: GeolocationPermission) => void;
  setAccurate: (isAccurate: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  coordinates: null,
  permission: "prompt" as GeolocationPermission,
  isAccurate: false,
  error: null,
};

const useGeolocationStore = create<GeolocationState>((set) => ({
  ...initialState,

  setCoordinates: (coordinates) => set({ coordinates }),
  setPermission: (permission) => set({ permission }),
  setAccurate: (isAccurate) => set({ isAccurate }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

export default useGeolocationStore;
