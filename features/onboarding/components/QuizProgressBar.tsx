import { cn } from "@/lib/cn";

interface QuizProgressBarProps {
  /** 0 ~ 100 진행률 */
  progress: number;
  className?: string;
}

/**
 * 성향 검사 상단 진행률 바.
 * 분모는 useQuiz에서 서버 문항 수 기준으로 계산해 넘겨준다.
 */
const QuizProgressBar = ({ progress, className }: QuizProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={cn(
        "bg-neutral-03 h-[9px] w-full overflow-hidden rounded-full",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <div
        className="bg-neutral-07 h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default QuizProgressBar;
