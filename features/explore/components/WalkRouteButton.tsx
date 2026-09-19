"use client";

import { cn } from "@/lib/cn";

interface WalkRouteButtonProps {
  /** 경로 표시 중인지 — 켜져 있으면 "경로 끄기"로 토글 */
  isActive: boolean;
  /** 조회 중 로딩 */
  isLoading?: boolean;
  /** 비활성 (좌표 없음·광주 밖·다음 목적지 없음) */
  disabled?: boolean;
  /** 경로가 있을 때 도보 시간·거리 표시용 (예: "도보 12분 · 850m") */
  summary?: string;
  onClick: () => void;
  className?: string;
}

/**
 * 도보 길찾기 버튼 (지도 위 알약 버튼).
 * 현재 위치 → 다음 목적지 보행자 경로를 켜고 끈다.
 * 도보 경로임을 라벨로 명시(도보 아닌 이동수단 사용자 배려).
 */
const WalkRouteButton = ({
  isActive,
  isLoading = false,
  disabled = false,
  summary,
  onClick,
  className,
}: WalkRouteButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isLoading}
    aria-pressed={isActive}
    className={cn(
      "focus-visible:outline-primary-03 flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.14)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
      isActive ? "bg-neutral-07 text-neutral-01" : "text-neutral-07 bg-white",
      "disabled:bg-neutral-02 disabled:text-neutral-04 disabled:cursor-not-allowed",
      className,
    )}
  >
    <span aria-hidden="true">⚐</span>
    {isLoading
      ? "경로 찾는 중"
      : isActive
        ? summary
          ? `도보 길찾기 · ${summary}`
          : "경로 끄기"
        : "도보 길찾기"}
  </button>
);

export default WalkRouteButton;
