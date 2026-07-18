import { cn } from "@/lib/cn";

/**
 * 선택지 상태.
 * - default: 아직 아무것도 안 고른 문항의 기본 선택지
 * - selected: 이 선택지를 고름. 시각적으로 default와 동일,
 *   나머지가 dimmed 되면서 상대적으로 "선택됨"이 드러난다.
 * - dimmed: 같은 문항에서 다른 선택지가 골라짐 (회색으로 흐려짐)
 *
 * 3-state union으로 두어 "selected이면서 dimmed" 같은 불가능한 조합을 타입이 차단.
 */
type AnswerOptionState = "default" | "selected" | "dimmed";

interface AnswerOptionProps {
  /** 라벨을 포함한 전체 문구 */
  text: string;
  state: AnswerOptionState;
  onSelect: () => void;
}

/**
 * 성향 검사 선택지 버튼 (알약형).
 */
const AnswerOption = ({ text, state, onSelect }: AnswerOptionProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={state === "selected"}
      className={cn(
        "w-full rounded-[24px] border px-6 py-3 text-left text-[14px] font-medium transition-colors duration-200",
        "focus-visible:outline-neutral-07 focus-visible:outline-2 focus-visible:outline-offset-2",
        (state === "default" || state === "selected") &&
          "border-neutral-07 bg-neutral-01 text-neutral-07",
        state === "dimmed" && "border-neutral-05 bg-neutral-04 text-neutral-05",
      )}
    >
      {text}
    </button>
  );
};

export type { AnswerOptionState };
export default AnswerOption;
