import { create } from "zustand";

interface LocationSimulationState {
  /** 시뮬레이션 세션 활성 — 실제 GPS를 끈다. 시작하면 일시정지 중에도 true 유지 */
  isEnabled: boolean;
  /** 장소 간 이동(애니메이션) 진행 중 여부 */
  isWalking: boolean;
  /** 자동 투어 진행 중(일시정지와 구분) */
  isRunning: boolean;

  setEnabled: (isEnabled: boolean) => void;
  setWalking: (isWalking: boolean) => void;
  setRunning: (isRunning: boolean) => void;
  reset: () => void;
}

const initialState = {
  isEnabled: false,
  isWalking: false,
  isRunning: false,
};

const useLocationSimulationStore = create<LocationSimulationState>((set) => ({
  ...initialState,

  setEnabled: (isEnabled) => set({ isEnabled }),
  setWalking: (isWalking) => set({ isWalking }),
  setRunning: (isRunning) => set({ isRunning }),
  reset: () => set(initialState),
}));

export default useLocationSimulationStore;
