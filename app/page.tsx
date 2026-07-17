"use client";

import { useState } from "react";

import GradientBackground from "@/components/ui/GradientBackground";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import AppHeader from "@/components/layout/AppHeader";

/**
 * 서비스 시작 화면 (기능명세 1.1.1).
 *
 * 하단 "TAB ▼"으로 성향 검사 온보딩에 진입한다.
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

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden pb-10">
      <GradientBackground />

      <AppHeader onOpenMenu={() => setIsMenuOpen(true)} />

      <div className="flex-1" />

      <div className="text-neutral-07 px-8">
        <p className="text-[20px] font-medium tracking-[0.35em]">
          광주 동행 지도
        </p>
        <h1 className="mt-3 text-[64px] leading-[1.18] font-bold tracking-tight">
          5월 너머의
          <br />
          광주
        </h1>
      </div>

      <div className="mt-23 flex justify-center">
        <ScrollIndicator label="TAB" href="/onboarding" />
      </div>

      {/* TODO: isMenuOpen 시 사이드바 렌더. 내용 확정 후 별도 컴포넌트로 분리 */}
    </main>
  );
};

export default HomePage;
