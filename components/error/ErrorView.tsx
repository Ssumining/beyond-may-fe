import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ErrorViewProps {
  /** 큰 코드 숫자 (404, 500 등). 아이콘 대신 쓸 때 */
  code?: string;
  /** 코드 대신 쓸 아이콘 (타임아웃 시계 등) */
  icon?: ReactNode;
  /** 제목 (예: "페이지를 찾을 수 없어요") */
  title: string;
  /** 설명 (2줄이면 \n으로 줄바꿈) */
  description?: string;
  /** 하단 액션 (다시 시도 버튼, 이전 이동 링크 등) */
  actions?: ReactNode;
  className?: string;
}

/**
 * 공통 오류/예외 화면 (기능명세 6.1.x).
 * 큰 코드(404/500) 또는 아이콘 + 제목 + 설명 + 액션 구조로,
 * 화면마다 코드·문구·버튼만 다르게 재사용한다.
 * 상단 헤더는 이 컴포넌트를 쓰는 화면이 AppHeader로 직접 얹는다.
 */
const ErrorView = ({
  code,
  icon,
  title,
  description,
  actions,
  className,
}: ErrorViewProps) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-7 text-center",
        className,
      )}
    >
      {code && (
        <span className="text-neutral-07 text-[64px] leading-none font-semibold">
          {code}
        </span>
      )}
      {icon && <div className="text-neutral-05 mb-2">{icon}</div>}

      <h1 className="text-neutral-07 mt-6 text-[20px] font-semibold">
        {title}
      </h1>

      {description && (
        <p className="text-neutral-06 mt-2.5 text-[13px] leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}

      {actions && (
        <div className="mt-8 flex flex-col items-center gap-3">{actions}</div>
      )}
    </div>
  );
};

export default ErrorView;
