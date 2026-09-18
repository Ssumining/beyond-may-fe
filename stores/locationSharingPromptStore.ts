import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationSharingPromptState {
  dismissed: Record<string, true>;
  dismiss: (explorationId: string, participantId: number) => void;
}

/** 팝업 확인 여부만 브라우저에 보관한다. 실제 공유 동의는 서버가 관리한다. */
const useLocationSharingPromptStore = create<LocationSharingPromptState>()(
  persist(
    (set) => ({
      dismissed: {},
      dismiss: (explorationId, participantId) =>
        set((state) => ({
          dismissed: {
            ...state.dismissed,
            [`${explorationId}:${participantId}`]: true,
          },
        })),
    }),
    { name: "location-sharing-prompts" },
  ),
);

export default useLocationSharingPromptStore;
