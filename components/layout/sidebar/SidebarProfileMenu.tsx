"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";
import ChevronRight from "@/components/ui/icons/ChevronRight";
import useSessionStore from "@/stores/sessionStore";
import SidebarCodeAccordion from "./SidebarCodeAccordion";

interface SidebarProfileMenuProps {
  /** 성향 검사 결과 유형명 (예: "사색러"). 아직 검사 전이면 undefined — 뱃지 숨김 */
  mbtiName?: string;
}

const MENU_ITEM_CLASS =
  "border-neutral-02 flex w-full cursor-pointer items-center justify-between border-b py-4 text-[15px]";

/**
 * 사이드바 로그인 상태 콘텐츠 (프로필 메뉴).
 * 닉네임은 세션 스토어에서 직접 읽는다 — 이 컴포넌트는 로그인 상태에서만
 * 마운트되므로 세션에 닉네임이 있다고 가정한다.
 */
const SidebarProfileMenu = ({ mbtiName }: SidebarProfileMenuProps) => {
  const nickname = useSessionStore((state) => state.nickname);
  const identificationCode = useSessionStore(
    (state) => state.identificationCode,
  );
  const clearSession = useSessionStore((state) => state.clearSession);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    clearSession();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <div
          className="bg-primary-06 h-16 w-16 shrink-0 rounded-full"
          aria-hidden="true"
        />
        <div>
          <p className="text-neutral-07 text-[16px] font-semibold">
            {nickname}
          </p>
          {mbtiName && (
            <span className="bg-primary-06 text-neutral-01 mt-1 inline-block rounded-full px-2.5 py-1 text-[12px] font-medium">
              {mbtiName}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        {identificationCode && (
          <SidebarCodeAccordion code={identificationCode} />
        )}

        <Link href="/onboarding/result" className={MENU_ITEM_CLASS}>
          내 성향 결과
          <ChevronRight className="text-neutral-04 h-3 w-3" />
        </Link>

        <Link href="/course" className={MENU_ITEM_CLASS}>
          진행 중인 코스
          <ChevronRight className="text-neutral-04 h-3 w-3" />
        </Link>

        <Link href="/record" className={MENU_ITEM_CLASS}>
          여행 기록
          <ChevronRight className="text-neutral-04 h-3 w-3" />
        </Link>

        {/* TODO: 밝힌 지도 경로 미확정 */}
        <button type="button" className={cn(MENU_ITEM_CLASS, "border-b-0")}>
          밝힌 지도
          <ChevronRight className="text-neutral-04 h-3 w-3" />
        </button>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleLogout}
        className="text-neutral-04 cursor-pointer py-4 text-left text-[14px]"
      >
        로그아웃
      </button>
    </div>
  );
};

export default SidebarProfileMenu;
