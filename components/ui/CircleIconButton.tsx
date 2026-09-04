import { type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type CircleIconButtonVariant = "light" | "dark";

interface CircleIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: CircleIconButtonVariant;
}

const VARIANT_CLASS: Record<CircleIconButtonVariant, string> = {
  light: "bg-neutral-01 text-neutral-04 shadow-soft",
  dark: "bg-neutral-07 text-neutral-01 shadow-strong",
};

/**
 * 원형 아이콘 버튼 (components/ui). 닫기·되돌리기·좋아요처럼
 * 바텀시트·카드덱 위에 떠 있는 원형 액션 버튼에서 공통으로 쓴다.
 * 크기는 className의 h-, w- 값으로 지정.
 */
const CircleIconButton = ({
  icon,
  variant = "light",
  className,
  type = "button",
  ...rest
}: CircleIconButtonProps) => (
  <button
    type={type}
    className={cn(
      "flex cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50",
      VARIANT_CLASS[variant],
      className,
    )}
    {...rest}
  >
    {icon}
  </button>
);

export default CircleIconButton;
