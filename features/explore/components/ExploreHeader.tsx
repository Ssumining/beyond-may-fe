"use client";

import Link from "next/link";
import Home from "@/components/ui/icons/Home";
import Hamburger from "@/components/ui/icons/Hamburger";

interface ExploreHeaderProps {
  /** 참여자 수 배지 등 가운데 영역 (팀 N명 배지) */
  center?: React.ReactNode;
  /** 햄버거 클릭 시 사이드바 열기 */
  onOpenMenu?: () => void;
  /** 스크롤로 헤더를 숨길지 여부 */
  hidden?: boolean;
}

/**
 * 탐험 지도 전용 상단 헤더 (4.3.1).
 * 공용 AppHeader와 형태가 달라 탐험 전용으로 놔둠.
 * TODO: 다른 화면에서도 이 형태가 필요하면 공용 컴포넌트로 승격 (혜진과 논의).
 */
const ExploreHeader = ({ center, onOpenMenu, hidden }: ExploreHeaderProps) => {
  return (
    <header
      className="pointer-events-none absolute inset-x-0 top-0 z-60 flex items-start justify-between px-6 pt-5.25 transition-opacity duration-200 data-[hidden=true]:opacity-0"
      data-hidden={hidden}
    >
      {/* 홈 — 원 + 그림자 */}
      <Link
        href="/"
        aria-label="홈으로 이동"
        className="bg-white-01 pointer-events-auto flex h-9.5 w-9.5 items-center justify-center rounded-full"
        style={{ boxShadow: "0 0 8px rgba(0,0,0,0.14)" }}
      >
        <Home className="text-neutral-07 h-6.5 w-6.5" />
      </Link>

      {/* 가운데 — 팀 배지 등 */}
      <div className="pointer-events-auto">{center}</div>

      {/* 햄버거 — 원 + 그림자 */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="메뉴 열기"
        className="bg-white-01 pointer-events-auto flex h-9.5 w-9.5 items-center justify-center rounded-full"
        style={{ boxShadow: "0 0 8px rgba(0,0,0,0.14)" }}
      >
        <Hamburger className="text-neutral-07 h-5 w-5" />
      </button>
    </header>
  );
};

export default ExploreHeader;
