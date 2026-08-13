"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import GradientBackground from "@/components/ui/GradientBackground";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import AppHeader from "@/components/layout/AppHeader";
import QuizIntro from "@/features/onboarding/components/QuizIntro";

/**
 * 서비스 시작 화면 (기능명세 1.1.1).
 *
 * 히어로 섹션을 스크롤해 내려가면 다음 섹션(성향 검사 인트로 프리뷰)이 이어진다.
 * 스크롤 진행도에 따라 배경의 아치·태양 원과 타이틀 텍스트가 위로 이동하며 페이드아웃된다.
 *
 * TODO(1.1.1): 로컬 스토리지 세션 검사 후 분기 처리 (인증 방식 확정 후 별도 이슈)
 *   - 세션 없음        → 이 화면 유지
 *   - 세션 O, 코스 X   → /places 로 리다이렉트
 *   - 세션 O, 코스 O   → /explore 로 리다이렉트
 *   - 성향 O, 닉네임 X → /onboarding/nickname 으로 이동
 */
const HomePage = () => {
  // TODO: 사이드바 내용(설정/위치 이동 등) 확정 후 실제 사이드바 컴포넌트와 연결
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const titleStyle = prefersReducedMotion
    ? undefined
    : { y: titleY, opacity: titleOpacity };

  return (
    <main className="mx-auto w-full max-w-[430px]">
      <section
        ref={heroRef}
        className="relative flex min-h-[100dvh] flex-col overflow-hidden pb-10"
      >
        <GradientBackground progress={scrollYProgress} />

        <AppHeader onOpenMenu={() => setIsMenuOpen(true)} />

        <div className="flex-1" />

        <motion.div style={titleStyle} className="text-neutral-07 px-8">
          <p className="text-[20px] font-medium tracking-[0.35em]">
            광주 동행 지도
          </p>
          <h1 className="mt-3 text-[64px] leading-[1.18] font-bold tracking-tight">
            5월 너머의
            <br />
            광주
          </h1>
        </motion.div>

        <div className="mt-23 flex justify-center">
          <ScrollIndicator label="TAB" href="/onboarding" />
        </div>

        {/* TODO: isMenuOpen 시 사이드바 렌더. 내용 확정 후 별도 컴포넌트로 분리 */}
      </section>

      <div className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden text-center">
        {/* TODO(#21 후속): 실제 질문 API 연동·자동 화면 전환은 onboarding 담당자와 협의 후 진행. 지금은 시각적 프리뷰만 노출 */}
        <QuizIntro isLoading={false} />
      </div>
    </main>
  );
};

export default HomePage;
