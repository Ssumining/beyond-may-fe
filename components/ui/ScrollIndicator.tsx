import Link from "next/link";

import { cn } from "@/lib/cn";
import ChevronDown from "@/components/ui/icons/ChevronDown";

type ScrollDirection = "up" | "down";

interface ScrollIndicatorProps {
  /** 화살표 방향. 메인·다음 문항은 down, 이전 문항은 up */
  direction?: ScrollDirection;
  /** 화살표 위(down) 또는 아래(up)에 붙는 라벨. 메인 화면의 "TAB" */
  label?: string;
  /** 지정 시 링크로 동작한다. 없으면 시각적 힌트로만 사용. */
  href?: string;
  className?: string;
}

/**
 * "여기서 더 진행할 수 있다"는 것을 알리는 스크롤 힌트.
 * 메인 화면(TAB ▼)과 성향 검사 문항 화면(▲/▼)에서 공통으로 사용.
 */

const ScrollIndicator = ({
  direction = "down",
  label,
  href,
  className,
}: ScrollIndicatorProps) => {
  const content = (
    <span
      className={cn(
        "text-neutral-06 flex flex-col items-center gap-1",
        direction === "up" && "flex-col-reverse",
        className,
      )}
    >
      {label && (
        <span className="text-[13px] font-medium tracking-[0.14em]">
          {label}
        </span>
      )}
      <ChevronDown
        className={cn(
          "animate-hint-bounce h-2.5 w-4",
          direction === "up" && "rotate-180",
        )}
      />
    </span>
  );

  if (!href) {
    return <span aria-hidden="true">{content}</span>;
  }

  return (
    <Link
      href={href}
      className="focus-visible:outline-neutral-06 rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {content}
    </Link>
  );
};

export default ScrollIndicator;
