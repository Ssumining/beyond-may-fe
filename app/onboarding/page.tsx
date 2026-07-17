"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useGetPreferenceQuestionsQuery } from "@/features/onboarding/hooks/useGetPreferenceQuestionsQuery";
import { useQuiz } from "@/features/onboarding/hooks/useQuiz";
import AppHeader from "@/components/layout/AppHeader";
import QuizIntro from "@/features/onboarding/components/QuizIntro";
import QuizProgressBar from "@/features/onboarding/components/QuizProgressBar";
import QuizQuestion from "@/features/onboarding/components/QuizQuestion";
import { postPreferenceResult } from "@/services/api/preference/preferenceApi";
import type { PreferenceSubmitRequest } from "@/types/preference";

/**
 * 성향 검사 온보딩 페이지 (기능명세 1.1.2 / 1.2.1).
 *
 * 흐름:
 * 1. 질문 로딩 중 → 로딩(인트로) 화면만 노출
 * 2. 질문 도착 → 질문 스크롤 컨테이너로 전환 (로딩 화면은 DOM에서 제거) → 로딩으로 되돌아갈 수 없음
 * 3. 질문끼리는 scroll-snap으로 진행. 답변 시 다음 섹션 자동 스크롤, 위로 스크롤하면 이전 답 수정 가능.
 */

const OnboardingPage = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } =
    useGetPreferenceQuestionsQuery();

  const questions = data?.questions ?? [];
  const isReady = !isLoading && !isError && questions.length > 0;

  const {
    answers,
    visibleQuestions,
    progress,
    isCompleted,
    getSelectedOption,
    selectAnswer,
  } = useQuiz({ questions });

  /** 각 문항 섹션 DOM 참조 → 답변 후 다음 섹션으로 스크롤 */
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const hasSubmittedRef = useRef(false);

  const { mutate: submitPreferenceResult } = useMutation({
    mutationFn: ({
      userId,
      body,
    }: {
      userId: number;
      body: PreferenceSubmitRequest;
    }) => postPreferenceResult(userId, body),
    onSuccess: () => {
      router.replace("/onboarding/result");
    },
    onError: () => {
      hasSubmittedRef.current = false;
    },
  });

  const handleSelect = (questionId: number, optionId: number): void => {
    const isNewAnswer = getSelectedOption(questionId) === null;
    selectAnswer(questionId, optionId);

    // 처음 답한 경우에만 다음 문항으로 스크롤 (기존 답 수정 시엔 이동 안 함)
    if (!isNewAnswer) return;

    const currentIndex = questions.findIndex(
      (question) => question.questionId === questionId,
    );
    const nextQuestion = questions[currentIndex + 1];
    if (!nextQuestion) return;

    requestAnimationFrame(() => {
      sectionRefs.current
        .get(nextQuestion.questionId)
        ?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (!isCompleted || hasSubmittedRef.current) {
      return;
    }

    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId === null ? NaN : Number(storedUserId);
    if (!Number.isFinite(userId)) {
      return;
    }

    hasSubmittedRef.current = true;
    submitPreferenceResult({
      userId,
      body: { answers },
    });
  }, [answers, isCompleted, submitPreferenceResult]);

  // 로딩/에러 상태: 질문 준비 전에는 인트로(로딩) 화면만 출력.
  if (!isReady) {
    return (
      <main className="bg-neutral-01 mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col">
        {/* 로딩·에러 화면에는 상단 헤더 노출 (질문 화면에는 없음) */}
        <AppHeader className="text-neutral-04" />

        {isError ? (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-neutral-07/70 text-[15px]">
              질문을 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="border-neutral-07 text-neutral-07 rounded-full border px-6 py-3 text-[15px] font-medium"
            >
              다시 시도
            </button>
          </section>
        ) : (
          <QuizIntro isLoading />
        )}
      </main>
    );
  }

  // 질문 준비 완료: 질문 스크롤 컨테이너로 전환 (로딩 화면 없음)
  return (
    <main className="scrollbar-hide bg-neutral-01 mx-auto h-[100dvh] w-full max-w-[430px] snap-y snap-mandatory overflow-y-scroll">
      {/* 진행률 바: 질문 화면 상단 고정 */}
      <div className="bg-neutral-01/80 sticky top-0 z-10 px-6 pt-6 pb-10 backdrop-blur">
        <QuizProgressBar progress={progress} />
      </div>

      {visibleQuestions.map((question, index) => (
        <div
          key={question.questionId}
          ref={(node) => {
            if (node) sectionRefs.current.set(question.questionId, node);
            else sectionRefs.current.delete(question.questionId);
          }}
        >
          <QuizQuestion
            question={question}
            selectedOptionId={getSelectedOption(question.questionId)}
            hasPrevious={index > 0}
            onSelect={(optionId) => handleSelect(question.questionId, optionId)}
          />
        </div>
      ))}
    </main>
  );
};

export default OnboardingPage;
