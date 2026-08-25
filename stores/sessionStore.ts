import { create } from "zustand";

interface SessionState {
  nickname: string | null;
  isLoggedIn: boolean;
  setSession: (nickname: string) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  nickname: null,
  isLoggedIn: false,
  setSession: (nickname) => set({ nickname, isLoggedIn: true }),
  clearSession: () => set({ nickname: null, isLoggedIn: false }),
}));

export default useSessionStore;
