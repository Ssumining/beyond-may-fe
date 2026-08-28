import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  nickname: string | null;
  identificationCode: number | null;
  /** 확정된 코스 id. 홈 화면 라우팅 가드(세션 O, 코스 O/X 분기)에 사용
   *  TODO(course 도메인 연동 필요): 코스 확정(POST /courses/{id}/confirm) 성공 시
   *  이 값을 setCourseId로 채워야 한다. 현재는 이 스토어만 준비된 상태. */
  courseId: number | null;
  isLoggedIn: boolean;
  setSession: (nickname: string, identificationCode: number) => void;
  setCourseId: (courseId: number) => void;
  clearSession: () => void;
}

/** 로컬스토리지에 영속화되는 세션 상태. 새로고침해도 로그인 상태가 유지된다. */
const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      nickname: null,
      identificationCode: null,
      courseId: null,
      isLoggedIn: false,
      setSession: (nickname, identificationCode) =>
        set({ nickname, identificationCode, isLoggedIn: true }),
      setCourseId: (courseId) => set({ courseId }),
      clearSession: () =>
        set({
          nickname: null,
          identificationCode: null,
          courseId: null,
          isLoggedIn: false,
        }),
    }),
    { name: "session-storage" },
  ),
);

export default useSessionStore;
