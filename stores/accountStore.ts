import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccountState {
  /** 이 기기에서 가입/로그인한 적 있는지. 로그아웃·세션 만료와 무관하게 유지. */
  hasAccount: boolean;
  markHasAccount: () => void;
}

/** 계정 이력 저장소. 세션 스토어("session-storage")와 분리된 키를 써서
 *  401(세션 만료) 시 session-storage가 지워져도 이 값은 남는다. */
const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      hasAccount: false,
      markHasAccount: () => set({ hasAccount: true }),
    }),
    { name: "account-storage" },
  ),
);

export default useAccountStore;
