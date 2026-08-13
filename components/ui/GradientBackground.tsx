"use client";

import type { MotionValue } from "framer-motion";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/cn";

interface GradientBackgroundProps {
  /**
   * 스크롤 진행도(0~1)를 담은 framer-motion MotionValue.
   * 미지정 시 정적 첫 프레임(아치·태양 원이 완전히 보이는 상태)으로 렌더.
   */
  progress?: MotionValue<number>;
  className?: string;
}

/**
 * 메인·성향검사 등에서 공통으로 쓰는 그라디언트 배경.
 *
 * 의도:
 * - 배경 자체(보라 → 피치 세로 그라디언트)는 고정, 상단 아치·태양 원만 스크롤에 반응해 위로 이동하며 사라짐
 * - progress가 없는 정적 사용처(QuizIntro, 결과 로딩 등)는 첫 프레임 그대로 노출
 * - prefers-reduced-motion 사용자는 progress와 무관하게 첫 프레임 고정
 */
const GradientBackground = ({
  progress,
  className,
}: GradientBackgroundProps) => {
  const prefersReducedMotion = useReducedMotion();
  const staticProgress = useMotionValue(0);
  const scroll = progress ?? staticProgress;

  const arcY = useTransform(scroll, [0, 1], [0, -220]);
  const arcOpacity = useTransform(scroll, [0, 0.7], [1, 0]);
  const sunY = useTransform(scroll, [0, 1], [0, -260]);
  const sunOpacity = useTransform(scroll, [0, 0.6], [1, 0]);

  const arcStyle = prefersReducedMotion
    ? undefined
    : { y: arcY, opacity: arcOpacity };
  const sunStyle = prefersReducedMotion
    ? undefined
    : { y: sunY, opacity: sunOpacity };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "from-primary-01 to-primary-04 pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b",
        className,
      )}
    >
      {/* 상단 아치: 화면 밖에 중심을 둔 큰 원으로 곡선 형태 연출 */}
      <motion.div
        style={arcStyle}
        className="bg-primary-07 absolute top-[-52%] left-[-30%] h-[70%] w-[160%] rounded-full"
      />
      {/* 태양 원 */}
      <motion.div
        style={sunStyle}
        className="bg-primary-06 absolute top-[10%] left-1/2 -ml-[9%] h-[18%] w-[18%] rounded-full"
      />
    </div>
  );
};

export default GradientBackground;
