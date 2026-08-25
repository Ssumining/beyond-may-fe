import { create } from "zustand";

interface SessionState {
  nickname: string | null;
  identificationCode: string | null;
  isLoggedIn: boolean;
  setSession: (nickname: string, identificationCode: string) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  nickname: null,
  identificationCode: null,
  isLoggedIn: false,
  setSession: (nickname, identificationCode) =>
    set({ nickname, identificationCode, isLoggedIn: true }),
  clearSession: () =>
    set({ nickname: null, identificationCode: null, isLoggedIn: false }),
}));

export default useSessionStore;
