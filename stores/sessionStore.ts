import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  nickname: string | null;
  identificationCode: number | null;
  isLoggedIn: boolean;
  setSession: (nickname: string, identificationCode: number) => void;
  clearSession: () => void;
}

/** 로컬스토리지에 영속화되는 세션 상태. 새로고침해도 로그인 상태가 유지된다. */
const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      nickname: null,
      identificationCode: null,
      isLoggedIn: false,
      setSession: (nickname, identificationCode) =>
        set({ nickname, identificationCode, isLoggedIn: true }),
      clearSession: () =>
        set({ nickname: null, identificationCode: null, isLoggedIn: false }),
    }),
    { name: "session-storage" },
  ),
);

export default useSessionStore;
