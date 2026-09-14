import { useCallback, useRef } from "react";
import useGeolocationStore from "@/stores/geolocationStore";
import useLocationSimulationStore from "@/stores/locationSimulationStore";

interface WalkTarget {
  latitude: number;
  longitude: number;
}

const WALK_DURATION_MS = 1500;
const WALK_STEPS = 30;
const WALK_INTERVAL_MS = WALK_DURATION_MS / WALK_STEPS;
/** 시뮬레이션 좌표는 항상 정확한 것으로 취급 (isAccurate 통과용) */
const SIMULATED_ACCURACY_METERS = 5;

/**
 * 위치 체험 모드에서 선택한 장소로 좌표를 이동시킴.
 * geolocationStore를 실제 GPS와 동일한 방식으로 갱신.
 */
const useSimulatedLocation = () => {
  const setCoordinates = useGeolocationStore((state) => state.setCoordinates);
  const setAccurate = useGeolocationStore((state) => state.setAccurate);
  const setWalking = useLocationSimulationStore((state) => state.setWalking);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const walkTo = useCallback(
    (target: WalkTarget, onArrive?: () => void) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const current = useGeolocationStore.getState().coordinates;

      if (!current) {
        setCoordinates({ ...target, accuracy: SIMULATED_ACCURACY_METERS });
        setAccurate(true);
        onArrive?.();
        return;
      }

      setWalking(true);
      let step = 0;

      intervalRef.current = setInterval(() => {
        step += 1;
        const ratio = step / WALK_STEPS;

        setCoordinates({
          latitude:
            current.latitude + (target.latitude - current.latitude) * ratio,
          longitude:
            current.longitude +
            (target.longitude - current.longitude) * ratio,
          accuracy: SIMULATED_ACCURACY_METERS,
        });
        setAccurate(true);

        if (step >= WALK_STEPS) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setWalking(false);
          onArrive?.();
        }
      }, WALK_INTERVAL_MS);
    },
    [setCoordinates, setAccurate, setWalking],
  );
  // 걷는 도중 취소 — 현재 좌표에 그대로 정지 (재개 시 여기서 이어감)
  const stopWalk = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setWalking(false);
  }, [setWalking]);

  return { walkTo, stopWalk };
};

export default useSimulatedLocation;