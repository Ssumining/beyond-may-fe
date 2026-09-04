import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PreferenceType } from "@/types/preference";

interface SessionState {
  nickname: string | null;
  identificationCode: number | null;
  isLoggedIn: boolean;
  /** 성향 검사 결과 유형. 결과 화면 조회 시점에 채워진다 (사이드바 프로필 등에서 사용) */
  preferenceType: PreferenceType | null;
  setSession: (nickname: string, identificationCode: number) => void;
  setPreferenceType: (preferenceType: PreferenceType) => void;
  clearSession: () => void;
}

/** 로컬스토리지에 영속화되는 세션 상태. 새로고침해도 로그인 상태가 유지된다. */
const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      nickname: null,
      identificationCode: null,
      isLoggedIn: false,
      preferenceType: null,
      setSession: (nickname, identificationCode) =>
        set({ nickname, identificationCode, isLoggedIn: true }),
      setPreferenceType: (preferenceType) => set({ preferenceType }),
      clearSession: () =>
        set({
          nickname: null,
          identificationCode: null,
          isLoggedIn: false,
          preferenceType: null,
        }),
    }),
    { name: "session-storage" },
  ),
);

export default useSessionStore;
