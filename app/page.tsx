"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import GradientBackground from "@/components/ui/GradientBackground";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarLoginForm from "@/components/layout/sidebar/SidebarLoginForm";
import SidebarProfileMenu from "@/components/layout/sidebar/SidebarProfileMenu";
import useSessionStore from "@/stores/sessionStore";

/** 스크롤 한 번으로 모션이 끝까지 재생되도록 하는 가상 스크롤 트랙 길이 */
const SCROLL_TRACK_HEIGHT = "240dvh";

/**
 * 서비스 시작 화면 (기능명세 1.1.1).
 *
 * 화면은 한 화면(히어로)에 고정(sticky)되어 있고, 그 뒤에 깔린 가상 스크롤 트랙을
 * 끝까지 스크롤하면 배경의 아치·태양 원과 타이틀 텍스트가 위로 이동하며 페이드아웃되고,
 * 모션이 끝나는 시점에 자동으로 성향 검사 온보딩(/onboarding)으로 전환된다.
 *
 * 세션 분기(1.1.1): 세션 없음이면 이 화면을 유지한다.
 * 세션 있음일 때의 나머지 분기(코스·성향 조회)는 해당 API 연동 전까지 TODO로 남겨둔다.
 *   - 세션 없음        → 이 화면 유지
 *   - 세션 O, 코스 X   → /places 로 리다이렉트 (TODO: 코스 존재 조회 API)
 *   - 세션 O, 코스 O   → /explore 로 리다이렉트 (TODO: 코스 존재 조회 API)
 *   - 성향 O, 닉네임 X → /onboarding/nickname 으로 이동 (TODO: 성향 결과 조회 API)
 */
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const hasNavigated = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value < 0.98 || hasNavigated.current) return;
    hasNavigated.current = true;
    router.push("/onboarding");
  });

  useEffect(() => {
    if (!isLoggedIn) return; // 세션 없음 → 이 화면 유지

    // TODO(백엔드 확인): 코스 존재 여부 조회 API 연동 후 분기 완성
    //   세션 O, 코스 X → router.push("/places")
    //   세션 O, 코스 O → router.push("/explore")
    // TODO(백엔드 확인): 성향 결과 조회 API 연동 후 분기 완성
    //   성향 O, 닉네임 X → router.push("/onboarding/nickname")
  }, [isLoggedIn, router]);

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const titleStyle = prefersReducedMotion
    ? undefined
    : { y: titleY, opacity: titleOpacity };

  return (
    <main
      ref={trackRef}
      className="relative mx-auto w-full max-w-[430px]"
      style={{ height: SCROLL_TRACK_HEIGHT }}
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden pb-10">
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
      </div>

      <Sidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        {isLoggedIn ? <SidebarProfileMenu /> : <SidebarLoginForm />}
      </Sidebar>
    </main>
  );
};

export default HomePage;
