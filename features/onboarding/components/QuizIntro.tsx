import GradientBackground from "@/components/ui/GradientBackground";

interface QuizIntroProps {
  /** 질문 로딩 중 여부. 로딩이 끝나면 페이지가 질문 화면으로 자동 전환. */
  isLoading: boolean;
}

/**
 * 성향 검사 인트로 겸 로딩 화면 (기능명세 1.1.2).
 * 질문 API를 기다리는 동안 안내 문구와 스피너를 노출.
 * 로딩이 끝나면 상위 페이지가 질문 화면으로 자동 전환.
 */

const QuizIntro = ({ isLoading }: QuizIntroProps) => {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
      <GradientBackground className="opacity-70" />

      <p className="text-neutral-07 text-[20px] leading-relaxed font-medium">
        몇 가지 질문을 통해서
        <br />
        당신의 여행 유형을 알아보아요.
      </p>

      {isLoading && (
        <span
          className="border-neutral-07/20 border-t-neutral-07 mt-2 block h-[42px] w-[42px] animate-spin rounded-full border-2"
          role="status"
          aria-label="질문을 불러오는 중"
        />
      )}
    </section>
  );
};

export default QuizIntro;
