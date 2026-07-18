"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

/** 배경을 구성하는 그라디언트 원 하나의 정의 */
interface GradientBlob {
  /** Tailwind 색상 토큰 (globals.css @theme 에 등록됨) */
  color: string;
  /** 컨테이너 대비 지름(%) */
  size: number;
  /** 중심 좌표(%) — left, top */
  x: number;
  y: number;
  /** 클수록 앞쪽 레이어 → 포인터를 더 많이 따라옴 (px) */
  depth: number;
  /** 부유 애니메이션 주기(초) — 서로 다르게 두어야 유기적으로 보임 */
  duration: number;
  /** 애니메이션 시작 지연(초) */
  delay: number;
}

/**
 * Figma 메인 화면의 메시 그라디언트를 재현한 blob 배치.
 * 색상은 디자인 Selection colors 11개를 그대로 사용한다.
 */
const BLOBS: readonly GradientBlob[] = [
  {
    color: "bg-brand-magenta",
    size: 95,
    x: 8,
    y: 6,
    depth: 34,
    duration: 19,
    delay: 0,
  },
  {
    color: "bg-brand-orchid",
    size: 105,
    x: 92,
    y: 4,
    depth: 28,
    duration: 23,
    delay: -4,
  },
  {
    color: "bg-brand-violet",
    size: 88,
    x: 96,
    y: 34,
    depth: 20,
    duration: 27,
    delay: -9,
  },
  {
    color: "bg-brand-sky",
    size: 78,
    x: 2,
    y: 38,
    depth: 30,
    duration: 21,
    delay: -2,
  },
  {
    color: "bg-brand-periwinkle",
    size: 70,
    x: 20,
    y: 30,
    depth: 16,
    duration: 25,
    delay: -13,
  },
  {
    color: "bg-brand-peach",
    size: 92,
    x: 52,
    y: 44,
    depth: 38,
    duration: 17,
    delay: -6,
  },
  {
    color: "bg-brand-blossom",
    size: 80,
    x: 80,
    y: 58,
    depth: 24,
    duration: 29,
    delay: -17,
  },
  {
    color: "bg-brand-mint",
    size: 46,
    x: 12,
    y: 62,
    depth: 12,
    duration: 24,
    delay: -11,
  },
  {
    color: "bg-brand-petal",
    size: 100,
    x: 24,
    y: 86,
    depth: 22,
    duration: 20,
    delay: -7,
  },
  {
    color: "bg-brand-wisteria",
    size: 86,
    x: 74,
    y: 96,
    depth: 14,
    duration: 26,
    delay: -15,
  },
  {
    color: "bg-brand-lilac",
    size: 74,
    x: 50,
    y: 74,
    depth: 10,
    duration: 22,
    delay: -19,
  },
] as const;

/** 포인터 목표 지점까지 매 프레임 접근하는 비율 (0~1). 낮을수록 부드럽고 느리게 따라옴 */
const EASING = 0.06;

interface GradientBackgroundProps {
  /** 포인터(마우스·터치) 반응 여부. 배경으로만 쓸 땐 false */
  interactive?: boolean;
  className?: string;
}

/**
 * 메인·성향검사 등에서 공통으로 쓰는 그라디언트 배경.
 *
 * 의도:
 * - 권한이 필요한 기기 기울기(deviceorientation) 대신, 자동 부유 + 포인터 패럴랙스로 "살아있는" 느낌을 냄
 * - blob마다 depth가 달라 레이어감이 생김
 * - prefers-reduced-motion 사용자는 CSS에서 자동 정지 (globals.css)
 */
const GradientBackground = ({
  interactive = true,
  className,
}: GradientBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameId = useRef<number>(0);

  useEffect(() => {
    if (!interactive) return;

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    /** 포인터 위치를 -0.5 ~ 0.5 범위로 정규화해 저장 */
    const updateTarget = (clientX: number, clientY: number): void => {
      const { left, top, width, height } = container.getBoundingClientRect();
      target.current = {
        x: (clientX - left) / width - 0.5,
        y: (clientY - top) / height - 0.5,
      };
    };

    const handlePointerMove = (event: PointerEvent): void => {
      updateTarget(event.clientX, event.clientY);
    };

    /** 포인터가 벗어나면 서서히 중앙으로 복귀 */
    const handlePointerLeave = (): void => {
      target.current = { x: 0, y: 0 };
    };

    const tick = (): void => {
      current.current.x += (target.current.x - current.current.x) * EASING;
      current.current.y += (target.current.y - current.current.y) * EASING;

      container.style.setProperty("--pointer-x", String(current.current.x));
      container.style.setProperty("--pointer-y", String(current.current.y));

      frameId.current = requestAnimationFrame(tick);
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    frameId.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(frameId.current);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "bg-brand-petal pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        interactive && "pointer-events-auto",
        className,
      )}
    >
      {BLOBS.map((blob) => (
        <div
          key={`${blob.color}-${blob.x}-${blob.y}`}
          className={cn(
            "absolute rounded-full mix-blend-normal blur-[64px]",
            "animate-float",
            blob.color,
          )}
          style={{
            width: `${blob.size}%`,
            aspectRatio: "1 / 1",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            // 자체 부유 애니메이션(transform)과 포인터 이동(translate)이 겹치지 않도록
            // translate 프로퍼티를 따로 사용한다.
            translate: `calc(-50% + (var(--pointer-x, 0) * ${blob.depth}px)) calc(-50% + (var(--pointer-y, 0) * ${blob.depth}px))`,
            animationDuration: `${blob.duration}s`,
            animationDelay: `${blob.delay}s`,
          }}
        />
      ))}

      {/* 텍스트 가독성 확보용 아주 옅은 밝기 레이어 */}
      <div className="absolute inset-0 bg-white/10" />
    </div>
  );
};

export default GradientBackground;
