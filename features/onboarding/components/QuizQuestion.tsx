import { cn } from "@/lib/cn";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import type { PreferenceQuestion } from "@/types/preference";

import AnswerOption from "./AnswerOption";
import type { AnswerOptionState } from "./AnswerOption";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

interface QuizQuestionProps {
  question: PreferenceQuestion;
  /** 화면에 표시할 문항 번호(1부터) */
  order: number;
  /** 이 문항에서 고른 optionId (없으면 null) */
  selectedOptionId: number | null;
  /** 위로 스크롤할 수 있는 이전 문항이 있는지 (첫 문항은 ▲ 숨김) */
  hasPrevious: boolean;
  onSelect: (optionId: number) => void;
}

/**
 * 성향 검사 문항 한 개 = scroll-snap 섹션 한 개(100dvh).
 * 답을 고르면 나머지 선택지가 dimmed로 흐려진다.
 */
const QuizQuestion = ({
  question,
  order,
  selectedOptionId,
  hasPrevious,
  onSelect,
}: QuizQuestionProps) => {
  const hasAnswered = selectedOptionId !== null;

  const getOptionState = (optionId: number): AnswerOptionState => {
    if (!hasAnswered) return "default";
    return optionId === selectedOptionId ? "selected" : "dimmed";
  };

  return (
    <section
      className={cn(
        "flex min-h-[100dvh] snap-start flex-col px-6 pb-8",
        "pt-16",
      )}
    >
      {/* 이전 문항으로 올라가는 힌트 (첫 문항 제외). 진행률 바 바로 아래 */}
      <div className="flex h-6 items-center justify-center">
        {hasPrevious && <ScrollIndicator direction="up" />}
      </div>

      <div className="mt-16">
        <p className="text-neutral-07 text-3xl font-bold">{order}.</p>
        <h2 className="text-neutral-07 mt-3 text-lg leading-snug font-semibold">
          {question.content}
        </h2>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {question.options.map((option) => (
          <AnswerOption
            key={option.optionId}
            text={`${OPTION_LABELS[option.displayOrder - 1] ?? ""}. ${option.content}`}
            state={getOptionState(option.optionId)}
            onSelect={() => onSelect(option.optionId)}
          />
        ))}
      </div>

      {/* 답을 골랐을 때만 다음으로 내려가는 힌트 노출. 화면 맨 아래 */}
      <div className="mt-auto flex h-8 items-end justify-center">
        {hasAnswered && <ScrollIndicator direction="down" />}
      </div>
    </section>
  );
};

export default QuizQuestion;
