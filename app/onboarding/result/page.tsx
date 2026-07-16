"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import GradientBackground from "@/components/ui/GradientBackground";
import AppHeader from "@/components/layout/AppHeader";

/**
 * 성향 검사 결과 로딩(계산 대기) 화면 (기능명세 1.2.2 일부).
 *
 * 마지막 문항 응답 후, 백엔드가 유형을 계산하는 동안 표시.
 * 계산이 끝나면 결과 카드 화면으로 자동 전환.
 *
 * UX: 결과 계산은 단일 요청이라 진행률 근거가 없으므로,
 *   "거의 완료" 같은 진행률 주장 대신 단일 안내 문구 + 스피너만 노출.
 *
 * TODO: 결과 제출/조회 API 연결 후, 응답 도착 시 결과 카드로 전환. (1.2.2)
 *   - postPreferenceResult 응답을 기다렸다가 /onboarding/result/[type] 등으로 이동
 *   - 현재는 화면(UI)만 구현. 전환 로직은 결과 카드 이슈에서 연결.
 * TODO: 결과 제출(POST) userId 경로, 결과 응답 형태, 동점 처리 플래그 확정. (backend)
 */
const ResultLoadingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // TODO: 실제로는 결과 제출/조회 완료 시점에 결과 카드 화면으로 이동.
    //   지금은 API 미확정이라 자동 전환 로직을 비워둔다.
    //   예) const { type } = await postPreferenceResult(...);
    //       router.replace(`/onboarding/result/${type}`);
    void router;
  }, [router]);

  return (
    <main className="bg-neutral-01 relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden">
      <GradientBackground interactive={false} className="opacity-70" />

      {/* 상단 헤더 (Home). 로딩 화면 디자인 기준 */}
      <AppHeader showMenu={false} className="text-neutral-04" />

      <section className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-neutral-07 text-[20px] leading-relaxed font-medium">
          당신의 여행 유형을
          <br />
          분석하고 있어요
        </p>

        <span
          className="border-neutral-07/20 border-t-neutral-07 mt-2 block h-[42px] w-[42px] animate-spin rounded-full border-2"
          role="status"
          aria-label="여행 유형을 분석하는 중"
        />

        {/* 하단 안심 문구 */}
        <p className="text-7 text-neutral-05 mt-28 text-center">
          뒤로 가지 말고 잠시만 기다려 주세요.
        </p>
      </section>
    </main>
  );
};

export default ResultLoadingPage;
