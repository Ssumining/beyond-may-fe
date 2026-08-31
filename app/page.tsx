"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { getExplorations } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
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
 * 세션 분기(1.1.1):
 *   - 세션 없음        → 이 화면 유지
 *   - 세션 O, 코스 X   → /places 로 리다이렉트
 *   - 세션 O, 코스 O   → /explore 로 리다이렉트
 * "성향 O, 닉네임 X"(로그인 전 성향검사만 마친 사용자) 분기는 닉네임/세션 등록
 * 이슈에서 처리한다.
 *
 * 코스 존재 여부는 진행 중(ONGOING)인 탐험이 있는지로 판단한다
 * (GET /explorations?status=ONGOING).
 * TODO(백엔드 확인): 코스를 막 확정했지만 아직 탐험을 시작하지 않은 상태(BEFORE)는
 *   이 조회로 안 잡힌다 — ONGOING/COMPLETED만 지원되는지, BEFORE 상태 코스는
 *   어떻게 판단해야 하는지 백엔드 확인 필요. 조회 실패 시에는 안전하게 /places로 보낸다.
 */
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

  const router = useRouter();

  const {
    data: ongoingExplorations,
    isLoading: isCheckingCourse,
    isError: isCourseCheckError,
  } = useQuery({
    queryKey: QUERY_KEYS.EXPLORATION.LIST("ONGOING"),
    queryFn: () => getExplorations("ONGOING"),
    enabled: isLoggedIn,
  });
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
    if (isCheckingCourse) return; // 조회 완료 후 분기

    // 조회 실패 시 안전하게 장소 선택으로 보낸다 (TODO: 백엔드 에러 정책 확인 필요)
    const hasOngoingCourse =
      !isCourseCheckError &&
      (ongoingExplorations?.explorations.length ?? 0) > 0;
    router.push(hasOngoingCourse ? "/explore" : "/places");
  }, [
    isLoggedIn,
    isCheckingCourse,
    isCourseCheckError,
    ongoingExplorations,
    router,
  ]);

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
